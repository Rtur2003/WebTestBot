"""
Core bot implementation using Playwright for Python.

This module demonstrates Python-first approach with superior type safety,
better error handling, and cleaner architecture.
"""

from typing import Optional, Callable, Dict, List, Any
from dataclasses import dataclass, field
from datetime import datetime
from playwright.async_api import async_playwright, Browser, BrowserContext, Page, Playwright
from python_bot.config.models import BotConfig


@dataclass
class ActionResult:
    """Result of a single action execution."""
    action_type: str
    status: str
    message: str
    timestamp: datetime = field(default_factory=datetime.now)
    details: Optional[Dict[str, Any]] = None


@dataclass
class PageAnalysis:
    """Analysis results for a web page."""
    title: str
    url: str
    link_count: int
    form_count: int
    button_count: int
    input_count: int
    image_count: int
    has_service_worker: bool
    viewport: Dict[str, int]
    scroll_height: int
    links: List[Dict[str, str]]
    forms: List[Dict[str, Any]]


@dataclass
class BotReport:
    """Complete test execution report."""
    success: bool
    actions: List[ActionResult] = field(default_factory=list)
    errors: List[Dict[str, Any]] = field(default_factory=list)
    analysis: Optional[PageAnalysis] = None
    performance: Dict[str, float] = field(default_factory=dict)


class WebBot:
    """
    Python-based web automation bot using Playwright.
    
    Provides superior type safety, better error handling,
    and cleaner separation of concerns compared to Node.js implementation.
    """

    def __init__(self, config: Optional[BotConfig] = None):
        """Initialize bot with optional configuration."""
        self.config = config or BotConfig()
        self._browser: Optional[Browser] = None
        self._context: Optional[BrowserContext] = None
        self._page: Optional[Page] = None
        self._playwright: Optional[Playwright] = None

    async def initialize(self) -> bool:
        """Initialize browser, context, and page."""
        try:
            await self.cleanup()

            self._playwright = await async_playwright().start()
            
            self._browser = await self._playwright.chromium.launch(
                headless=self.config.browser.headless,
                timeout=self.config.browser.timeout,
                args=self.config.browser.args
            )

            if not self._browser:
                raise RuntimeError('Browser initialization failed')

            self._context = await self._browser.new_context(
                user_agent=self.config.context.user_agent,
                viewport={
                    'width': self.config.context.viewport.width,
                    'height': self.config.context.viewport.height
                }
            )

            if not self._context:
                raise RuntimeError('Context creation failed')

            self._page = await self._context.new_page()

            if not self._page:
                raise RuntimeError('Page creation failed')

            self._page.set_default_timeout(self.config.page.default_timeout)

            return True

        except Exception as error:
            print(f'[ERROR] Browser initialization failed: {error}')
            await self.cleanup()
            return False

    async def run_test(
        self,
        url: str,
        actions: Optional[List[Dict[str, Any]]] = None,
        on_update: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> BotReport:
        """
        Execute a complete test run on the specified URL.
        
        Args:
            url: Target URL to test
            actions: Optional list of custom actions to perform
            on_update: Optional callback for progress updates
            
        Returns:
            BotReport containing test results and analysis
        """
        report = BotReport(success=False)
        actions = actions or []

        try:
            init_success = await self.initialize()
            
            if not init_success or not self._page:
                raise RuntimeError('Browser initialization failed')

            if on_update:
                on_update({'type': 'status', 'message': 'Bot started, navigating...'})

            start_time = datetime.now()
            response = await self._page.goto(
                url,
                wait_until=self.config.page.wait_until,
                timeout=self.config.page.navigation_timeout
            )
            load_time = (datetime.now() - start_time).total_seconds() * 1000

            report.performance['load_time'] = load_time
            
            if response:
                report.performance['response_time'] = response.request.timing.get('responseEnd', 0)

            if on_update:
                on_update({
                    'type': 'navigation',
                    'message': f'Page loaded ({load_time:.0f}ms)',
                    'url': self._page.url
                })

            analysis = await self.analyze_page()
            report.analysis = analysis

            if on_update:
                on_update({
                    'type': 'analysis',
                    'message': f'Page analyzed: {analysis.link_count} links, {analysis.form_count} forms',
                    'analysis': analysis
                })

            await self.perform_automated_actions(report, on_update)

            for action in actions:
                try:
                    await self.perform_action(action, report, on_update)
                except Exception as error:
                    report.errors.append({
                        'type': 'ACTION_ERROR',
                        'action': action.get('type'),
                        'message': str(error),
                        'timestamp': datetime.now()
                    })

            report.success = len(report.errors) == 0

        except Exception as error:
            report.errors.append({
                'type': 'CRITICAL_ERROR',
                'message': str(error),
                'timestamp': datetime.now()
            })

            if on_update:
                on_update({
                    'type': 'error',
                    'message': f'Critical error: {error}'
                })

        finally:
            await self.cleanup()

        return report

    async def analyze_page(self) -> PageAnalysis:
        """Analyze current page structure and content."""
        if not self._page:
            raise RuntimeError('Page not initialized')

        data = await self._page.evaluate("""
            () => {
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
                    links: Array.from(document.querySelectorAll('a'))
                        .map(a => ({
                            text: a.textContent.trim(),
                            href: a.href,
                            target: a.target
                        }))
                        .filter(link => link.href && link.text),
                    forms: Array.from(document.querySelectorAll('form'))
                        .map(form => ({
                            action: form.action,
                            method: form.method,
                            inputs: Array.from(form.querySelectorAll('input'))
                                .map(input => ({
                                    type: input.type,
                                    name: input.name,
                                    required: input.required
                                }))
                        }))
                };
            }
        """)

        return PageAnalysis(**data)

    async def perform_automated_actions(
        self,
        report: BotReport,
        on_update: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> None:
        """Execute automated testing actions."""
        if not self._page:
            return

        try:
            await self._page.evaluate('window.scrollTo(0, document.body.scrollHeight / 2)')
            await self._page.wait_for_timeout(1000)

            report.actions.append(ActionResult(
                action_type='SCROLL',
                status='SUCCESS',
                message='Scrolled to page middle'
            ))

            if on_update:
                on_update({'type': 'action', 'message': 'Page scroll test successful'})

        except Exception as error:
            report.errors.append({
                'type': 'AUTOMATION_ERROR',
                'message': str(error),
                'timestamp': datetime.now()
            })

    async def perform_action(
        self,
        action: Dict[str, Any],
        report: BotReport,
        on_update: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> None:
        """Execute a custom action."""
        if not self._page:
            return

        action_type = action.get('type')
        
        if action_type == 'click':
            await self._page.click(action['selector'])
            report.actions.append(ActionResult(
                action_type='CUSTOM_CLICK',
                status='SUCCESS',
                message=f"Clicked {action['selector']}"
            ))
            
        elif action_type == 'type':
            await self._page.fill(action['selector'], action['text'])
            report.actions.append(ActionResult(
                action_type='CUSTOM_TYPE',
                status='SUCCESS',
                message=f"Typed into {action['selector']}"
            ))
            
        elif action_type == 'wait':
            await self._page.wait_for_timeout(action.get('duration', 1000))
            report.actions.append(ActionResult(
                action_type='WAIT',
                status='SUCCESS',
                message=f"Waited {action.get('duration')}ms"
            ))

        if on_update:
            on_update({
                'type': 'action',
                'message': f'Custom action executed: {action_type}'
            })

    async def cleanup(self) -> None:
        """Clean up browser resources."""
        if self._page:
            try:
                await self._page.close()
            except Exception as error:
                print(f'[WARN] Page cleanup error: {error}')
            finally:
                self._page = None

        if self._context:
            try:
                await self._context.close()
            except Exception as error:
                print(f'[WARN] Context cleanup error: {error}')
            finally:
                self._context = None

        if self._browser:
            try:
                await self._browser.close()
            except Exception as error:
                print(f'[WARN] Browser cleanup error: {error}')
            finally:
                self._browser = None

        if self._playwright:
            try:
                await self._playwright.stop()
            except Exception as error:
                print(f'[WARN] Playwright cleanup error: {error}')
            finally:
                self._playwright = None
