const WebBot = require('./bot/web-bot');

async function testBot() {
    console.log('🤖 Web Test AI - Bot Test Başlatılıyor...\n');

    const bot = new WebBot();

    try {
        console.log('📡 hasanarthuraltuntas.com.tr test ediliyor...');

        const result = await bot.runTest('https://hasanarthuraltuntas.com.tr', [], (update) => {
            console.log(`[${update.type?.toUpperCase() || 'INFO'}] ${update.message}`);

            if (update.analysis) {
                console.log(`   📊 Analiz: ${update.analysis.linkCount} link, ${update.analysis.formCount} form`);
            }
        });

        console.log('\n✅ Test Tamamlandı!');
        console.log('\n📋 RAPOR:');
        console.log(`   Başarı: ${result.success ? '✅' : '❌'}`);
        console.log(`   Eylem Sayısı: ${result.actions.length}`);
        console.log(`   Hata Sayısı: ${result.errors.length}`);
        console.log(`   Yükleme Süresi: ${result.performance.loadTime}ms`);

        if (result.analysis.title) {
            console.log(`   Sayfa Başlığı: ${result.analysis.title}`);
            console.log(`   Link Sayısı: ${result.analysis.linkCount}`);
            console.log(`   Form Sayısı: ${result.analysis.formCount}`);
        }

        if (result.errors.length > 0) {
            console.log('\n❌ Hatalar:');
            result.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.type}: ${error.message}`);
            });
        }

        if (result.actions.length > 0) {
            console.log('\n✅ Başarılı Eylemler:');
            result.actions.forEach((action, index) => {
                console.log(`   ${index + 1}. ${action.type}: ${action.status}`);
            });
        }

    } catch (error) {
        console.error('❌ Test Hatası:', error.message);
    }
}

// Test başlat
testBot();