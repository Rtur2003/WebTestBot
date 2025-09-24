# 🤖 Web Test AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40%2B-brightgreen.svg)](https://playwright.dev/)

Gelişmiş web otomasyonu ve analiz botu ile yerel kontrol arayüzü. Bu proje, web sitelerini test etmek, analiz etmek ve performans raporları oluşturmak için tasarlanmıştır.

## 🚀 Özellikler

### Bot Yetenekleri
- **Otomatik Web Navigasyonu**: Sayfalar arası gezinme ve link tıklama
- **Form Etkileşimi**: Otomatik form doldurma ve gönderme
- **Hata Raporlama**: Detaylı hata analizi ve raporlama
- **Performans Ölçümü**: Sayfa yükleme süreleri ve kaynak kullanımı
- **Çoklu Bot Desteği**: Eş zamanlı birden fazla bot çalıştırma
- **Gerçek Zamanlı İzleme**: Anlık aktivite takibi

### Analiz Özellikleri
- Sayfa yapısı analizi (linkler, formlar, resimler)
- Responsive tasarım testi
- JavaScript hata tespit etme
- Network aktivitesi izleme
- SEO elementi kontrolü

### Raporlama Sistemi
- Detaylı test raporları
- Başarı/başarısızlık oranları
- Performans metrikleri
- Hata logs ve stack trace
- Bot aktivite geçmişi

## 📦 Kurulum

```bash
# Proje dosyalarını indirin
git clone https://github.com/yourusername/WebTestAI.git
cd WebTestAI

# Bağımlılıkları yükleyin
npm install

# Playwright browser kurulumu
npx playwright install chromium

# .env dosyasını oluşturun
cp .env.example .env
```

## 🎯 Kullanım

### 1. Sunucuyu Başlatma
```bash
npm start
```

### 2. Dashboard Erişimi
Tarayıcınızda şu adrese gidin: `http://localhost:3001`

### 3. Bot Testi
```bash
# Hızlı test için
npm test
```

## 🖥️ Dashboard Özellikleri

### Ana Kontrol Paneli
- **Hedef URL Belirleme**: Test edilecek web sitesi
- **Bot Sayısı Seçimi**: 1-10 arasında eş zamanlı bot
- **Test Başlatma**: Tek tıkla test başlatma

### Gerçek Zamanlı İzleme
- Aktif bot sayısı
- Anlık aktivite logs
- Sistem durumu göstergesi
- Canlı performans metrikleri

### Rapor Sistemi
- Test sonuçları özeti
- Bot başına detaylı rapor
- Hata analizi
- Performans grafikleri

## 🔧 Yapılandırma

### Bot Ayarları
`bot/web-bot.js` dosyasında:
- Browser yapılandırması
- Timeout değerleri
- User agent ayarları
- Viewport boyutları

### Server Ayarları
`server.js` dosyasında:
- Port numarası
- Socket.io yapılandırması
- API endpoint'leri

## 📊 Test Senaryoları

### Otomatik Testler
1. **Sayfa Yükleme Testi**: Ana sayfa yükleme süresi
2. **Navigation Testi**: Menü ve link tıklama
3. **Form Testi**: İletişim formu doldurma
4. **Scroll Testi**: Sayfa kaydırma işlemleri
5. **Responsive Testi**: Farklı çözünürlük testleri

### Özel Testler
Kendi test senaryolarınızı ekleyebilirsiniz:
```javascript
const customActions = [
    { type: 'click', selector: '#my-button' },
    { type: 'type', selector: '#input-field', text: 'test data' },
    { type: 'wait', duration: 2000 }
];
```

## 🛡️ Güvenlik

- XSS koruması
- CSRF token desteği
- Rate limiting
- Input sanitization
- Güvenli header ayarları

## 📈 Performans

- Lightweight bot tasarımı
- Asenkron işlem desteği
- Memory leak koruması
- Resource optimization
- Headless browser kullanımı

## 🔍 Test Edilen Site

Bu bot özellikle **hasanarthuraltuntas.com.tr** sitesi için optimize edilmiştir:

### Site Özellikleri
- Modern SPA (Single Page Application)
- Progressive Web App (PWA)
- Responsive tasarım
- İletişim formu
- Sosyal medya entegrasyonları
- Dinamik içerik yükleme

### Test Kapsamı
- Form validasyonu
- Link navigasyonu
- PWA kurulum butonu
- Dil değiştirme özelliği
- Sosyal medya linklerı
- Newsletter aboneliği

## 🚨 Bilinen Sorunlar ve Çözümler

### Element Visibility Sorunu
Bazı elementler viewport dışında kalabilir. Çözüm:
- Scroll to element fonksiyonu eklendi
- Wait for stable stratejisi kullanılıyor

### Slow Loading
Site yavaş yüklenme durumunda:
- Timeout değerleri artırıldı
- Network idle stratejisi kullanılıyor

## 🛠️ Geliştirme

### Yeni Bot Özelliği Ekleme
1. `bot/web-bot.js` dosyasını düzenleyin
2. Yeni performAction methodu ekleyin
3. Dashboard'da UI kontrolü ekleyin

### Yeni Rapor Türü
1. Analiz fonksiyonlarını genişletin
2. Report template'ini güncelleyin
3. Dashboard görselleştirmesi ekleyin

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Browser developer tools kullanın
3. Network sekmesinde hataları inceleyin

## 🛠️ Teknoloji Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Socket.io**: Real-time bidirectional communication
- **Playwright**: Browser automation

### Frontend
- **HTML5/CSS3**: Modern UI design
- **Vanilla JavaScript**: Client-side logic
- **Socket.io Client**: Real-time updates

### DevOps
- **Git**: Version control
- **npm**: Package management

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Not**: Bu bot test ve eğitim amaçlı geliştirilmiştir. Üretim ortamında kullanımdan önce güvenlik ve performans testlerini tamamlayın.