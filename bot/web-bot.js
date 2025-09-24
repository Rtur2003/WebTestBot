const { chromium } = require('playwright');

class WebBot {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async initialize() {
        try {
            // Clean up any existing instances
            await this.cleanup();

            this.browser = await chromium.launch({
                headless: true,
                timeout: 60000,
                args: [
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding'
                ]
            });

            if (!this.browser) {
                throw new Error('Browser başlatılamadı');
            }

            this.context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                viewport: { width: 1366, height: 768 },
                timeout: 30000
            });

            if (!this.context) {
                throw new Error('Browser context oluşturulamadı');
            }

            this.page = await this.context.newPage();

            if (!this.page) {
                throw new Error('Browser page oluşturulamadı');
            }

            // Set page timeout
            this.page.setDefaultTimeout(30000);

            // Enable console logging (optional, disable for performance)
            // this.page.on('console', msg => {
            //     console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
            // });

            console.log(`[BOT] Browser başarıyla başlatıldı`);
            return true;
        } catch (error) {
            console.error('Browser initialization failed:', error.message);
            await this.cleanup();
            return false;
        }
    }

    async runTest(url, actions = [], onUpdate = () => {}) {
        const report = {
            success: false,
            actions: [],
            errors: [],
            analysis: {},
            performance: {
                loadTime: 0,
                responseTime: 0,
                resourceCount: 0
            }
        };

        try {
            const initSuccess = await this.initialize();

            if (!initSuccess || !this.page) {
                throw new Error('Browser başlatma başarısız oldu');
            }

            onUpdate({ type: 'status', message: 'Bot başlatıldı, sayfaya gidiliyor...' });

            // Navigate to target URL
            const startTime = Date.now();
            const response = await this.page.goto(url, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            const loadTime = Date.now() - startTime;
            report.performance.loadTime = loadTime;
            report.performance.responseTime = response.request().timing().responseEnd;

            onUpdate({
                type: 'navigation',
                message: `Sayfa yüklendi (${loadTime}ms)`,
                url: this.page.url()
            });

            // Analyze page
            const analysis = await this.analyzePage();
            report.analysis = analysis;

            onUpdate({
                type: 'analysis',
                message: `Sayfa analiz edildi: ${analysis.linkCount} link, ${analysis.formCount} form bulundu`,
                analysis
            });

            // Perform automated actions
            await this.performAutomatedActions(report, onUpdate);

            // Custom actions
            for (const action of actions) {
                try {
                    await this.performAction(action, report, onUpdate);
                } catch (error) {
                    report.errors.push({
                        type: 'ACTION_ERROR',
                        action: action.type,
                        message: error.message,
                        timestamp: new Date()
                    });
                }
            }

            report.success = report.errors.length === 0;

        } catch (error) {
            report.errors.push({
                type: 'CRITICAL_ERROR',
                message: error.message,
                timestamp: new Date()
            });

            onUpdate({
                type: 'error',
                message: `Kritik hata: ${error.message}`
            });
        } finally {
            await this.cleanup();
        }

        return report;
    }

    async analyzePage() {
        try {
            const analysis = await this.page.evaluate(() => {
                return {
                    title: document.title,
                    url: window.location.href,
                    linkCount: document.querySelectorAll('a').length,
                    formCount: document.querySelectorAll('form').length,
                    buttonCount: document.querySelectorAll('button').length,
                    inputCount: document.querySelectorAll('input').length,
                    imageCount: document.querySelectorAll('img').length,
                    hasServiceWorker: 'serviceWorker' in navigator,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    },
                    scrollHeight: document.body.scrollHeight,
                    links: Array.from(document.querySelectorAll('a')).map(a => ({
                        text: a.textContent.trim(),
                        href: a.href,
                        target: a.target
                    })).filter(link => link.href && link.text),
                    forms: Array.from(document.querySelectorAll('form')).map(form => ({
                        action: form.action,
                        method: form.method,
                        inputs: Array.from(form.querySelectorAll('input')).map(input => ({
                            type: input.type,
                            name: input.name,
                            required: input.required
                        }))
                    }))
                };
            });

            return analysis;
        } catch (error) {
            return { error: error.message };
        }
    }

    async performAutomatedActions(report, onUpdate) {
        try {
            // Test scroll
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
            await this.page.waitForTimeout(1000);

            report.actions.push({
                type: 'SCROLL',
                status: 'SUCCESS',
                message: 'Sayfa ortasına kaydırıldı',
                timestamp: new Date()
            });

            onUpdate({ type: 'action', message: 'Sayfa kaydırma testi başarılı' });

            // Test clicking random links
            const links = await this.page.$$('a[href^="#"], a[href*="' + this.page.url().split('/')[2] + '"]');

            if (links.length > 0) {
                const randomLink = links[Math.floor(Math.random() * links.length)];
                const linkText = await randomLink.textContent();
                const linkHref = await randomLink.getAttribute('href');

                try {
                    await randomLink.click();
                    await this.page.waitForTimeout(2000);

                    report.actions.push({
                        type: 'LINK_CLICK',
                        status: 'SUCCESS',
                        target: linkText,
                        href: linkHref,
                        timestamp: new Date()
                    });

                    onUpdate({
                        type: 'action',
                        message: `Link tıklama başarılı: "${linkText}"`
                    });

                } catch (error) {
                    report.errors.push({
                        type: 'LINK_CLICK_ERROR',
                        target: linkText,
                        message: error.message,
                        timestamp: new Date()
                    });
                }
            }

            // Test form interactions
            const forms = await this.page.$$('form');
            if (forms.length > 0) {
                await this.testFormInteraction(forms[0], report, onUpdate);
            }

        } catch (error) {
            report.errors.push({
                type: 'AUTOMATION_ERROR',
                message: error.message,
                timestamp: new Date()
            });
        }
    }

    async testFormInteraction(form, report, onUpdate) {
        try {
            const inputs = await form.$$('input[type="text"], input[type="email"], textarea');

            for (const input of inputs) {
                const inputType = await input.getAttribute('type');
                const inputName = await input.getAttribute('name');

                let testValue = '';
                switch (inputType) {
                    case 'email':
                        testValue = 'test@example.com';
                        break;
                    case 'text':
                        testValue = 'Test Kullanıcısı';
                        break;
                    default:
                        testValue = 'Test mesajı';
                }

                await input.fill(testValue);
                await this.page.waitForTimeout(500);

                report.actions.push({
                    type: 'FORM_INPUT',
                    status: 'SUCCESS',
                    field: inputName || inputType,
                    value: testValue,
                    timestamp: new Date()
                });
            }

            onUpdate({
                type: 'action',
                message: `Form alanları dolduruldu (${inputs.length} alan)`
            });

        } catch (error) {
            report.errors.push({
                type: 'FORM_ERROR',
                message: error.message,
                timestamp: new Date()
            });
        }
    }

    async performAction(action, report, onUpdate) {
        switch (action.type) {
            case 'click':
                await this.page.click(action.selector);
                report.actions.push({
                    type: 'CUSTOM_CLICK',
                    selector: action.selector,
                    status: 'SUCCESS',
                    timestamp: new Date()
                });
                break;

            case 'type':
                await this.page.fill(action.selector, action.text);
                report.actions.push({
                    type: 'CUSTOM_TYPE',
                    selector: action.selector,
                    text: action.text,
                    status: 'SUCCESS',
                    timestamp: new Date()
                });
                break;

            case 'wait':
                await this.page.waitForTimeout(action.duration || 1000);
                report.actions.push({
                    type: 'WAIT',
                    duration: action.duration,
                    status: 'SUCCESS',
                    timestamp: new Date()
                });
                break;
        }

        onUpdate({
            type: 'action',
            message: `Özel eylem gerçekleştirildi: ${action.type}`
        });
    }

    async cleanup() {
        try {
            if (this.page && !this.page.isClosed()) {
                await this.page.close();
                this.page = null;
            }
        } catch (error) {
            console.error('Page cleanup error:', error.message);
        }

        try {
            if (this.context) {
                await this.context.close();
                this.context = null;
            }
        } catch (error) {
            console.error('Context cleanup error:', error.message);
        }

        try {
            if (this.browser && this.browser.isConnected()) {
                await this.browser.close();
                this.browser = null;
            }
        } catch (error) {
            console.error('Browser cleanup error:', error.message);
        }
    }
}

module.exports = WebBot;