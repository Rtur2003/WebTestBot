# 🤖 Web Test AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40%2B-brightgreen.svg)](https://playwright.dev/)

**Python-First** web otomasyonu ve analiz botu ile yerel kontrol arayüzü. Bu proje, web sitelerini test etmek, analiz etmek ve performans raporları oluşturmak için tasarlanmıştır.

> **Architecture Note**: This project follows strict Python-first principles with type safety, comprehensive validation, and maintainable design. See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

## 🚀 Özellikler

### 🐍 Python-First Architecture
- **Type Safety**: Pydantic models with comprehensive validation
- **Async/Await**: Modern async implementation with Playwright
- **Error Handling**: Robust error handling with detailed reporting
- **Configuration Management**: Centralized, validated configuration
- **Code Quality**: Black, Mypy, Pylint for maintainability

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

### Development Standards
- **Strict Commit Discipline**: Atomic commits with clear justification
- **Multi-Branch Strategy**: Topic-based branches, no direct main commits
- **Code Review**: Comprehensive PR requirements
- **Documentation**: Architecture docs, contribution guidelines

## 📦 Kurulum

### Python Environment (Required)

```bash
# Proje dosyalarını indirin
git clone https://github.com/Rtur2003/WebTestBot.git
cd WebTestBot

# Python sanal ortamı oluşturun
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Python bağımlılıklarını yükleyin
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development tools

# Playwright browser kurulumu
playwright install chromium
```

### Node.js Environment (Optional - Web Interface)

```bash
# Node.js bağımlılıklarını yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
```

## 🎯 Kullanım

### Python CLI (Recommended)

```bash
# Activate virtual environment
source venv/bin/activate

# Test default URL
python -m python_bot.cli

# Test custom URL
python -m python_bot.cli https://example.com

# Run multiple concurrent bots
python -m python_bot.cli https://example.com --bots=3

# Show help
python -m python_bot.cli --help
```

### Web Dashboard (Legacy)

#### 1. Sunucuyu Başlatma
```bash
npm start
```

#### 2. Dashboard Erişimi
Tarayıcınızda şu adrese gidin: `http://localhost:3001`

#### 3. Legacy Bot Testi
```bash
# Hızlı test için (Node.js implementation)
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

### Python Configuration
**Python bot** uses Pydantic models for type-safe configuration:
- `python_bot/config/models.py`: Configuration models with validation
- `config/default.json`: Default configuration values (shared)
- Environment variables for overrides

### Legacy Node.js Configuration
- `bot/web-bot.js`: Browser settings (legacy)
- `server.js`: Server and Socket.io settings
- `config/manager.js`: Configuration management

## 🛠️ Geliştirme

### Code Quality Tools

**Python:**
```bash
# Format code
black python_bot/

# Type checking
mypy python_bot/

# Linting
pylint python_bot/
```

**JavaScript:**
```bash
# Format code
npm run format

# Linting
npm run lint
```

### Contributing
Bu proje **strict multi-branch, atomic commit** disiplini kullanır. Katkıda bulunmadan önce [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

**Temel Kurallar:**
- Python-first approach
- One commit = one change
- No direct commits to main
- Topic-based branches
- Comprehensive PR descriptions

### Pre-Commit Checklist
- [ ] Tests pass
- [ ] Linting passes (black, pylint, eslint)
- [ ] Type checking passes (mypy)
- [ ] Documentation updated
- [ ] Atomic commits with clear messages

## 📊 Test Senaryoları

### Otomatik Testler
1. **Sayfa Yükleme Testi**: Ana sayfa yükleme süresi
2. **Navigation Testi**: Menü ve link tıklama
3. **Form Testi**: İletişim formu doldurma
4. **Scroll Testi**: Sayfa kaydırma işlemleri
5. **Responsive Testi**: Farklı çözünürlük testleri

### Python API Example
```python
from python_bot.core.bot import WebBot
from python_bot.config.models import BotConfig
import asyncio

async def main():
    config = BotConfig()
    bot = WebBot(config)
    
    # Custom actions
    actions = [
        {'type': 'click', 'selector': '#my-button'},
        {'type': 'type', 'selector': '#input-field', 'text': 'test data'},
        {'type': 'wait', 'duration': 2000}
    ]
    
    report = await bot.run_test('https://example.com', actions)
    print(f'Success: {report.success}')
    print(f'Actions: {len(report.actions)}')

asyncio.run(main())
```

### Legacy JavaScript API
```javascript
const customActions = [
    { type: 'click', selector: '#my-button' },
    { type: 'type', selector: '#input-field', text: 'test data' },
    { type: 'wait', duration: 2000 }
];
```

## 🛡️ Güvenlik

- **Input Validation**: Comprehensive validation using Pydantic
- **Type Safety**: Mypy strict mode for Python code
- **Error Handling**: Centralized error handling framework
- **XSS Protection**: Input sanitization
- **Rate Limiting**: Request throttling support
- **Secure Headers**: Security-first configuration

## 🛠️ Teknoloji Stack

### Python Core (Primary)
- **Python 3.8+**: Primary language
- **Playwright**: Browser automation (async)
- **Pydantic**: Data validation and type safety
- **asyncio**: Asynchronous programming

### Backend (Minimal Web Interface)
- **Node.js**: Runtime environment (minimal layer)
- **Express.js**: Web framework (API gateway only)
- **Socket.io**: Real-time communication

### Frontend
- **HTML5/CSS3**: Modern UI design
- **Vanilla JavaScript**: Client-side logic
- **Socket.io Client**: Real-time updates

### Development Tools
- **Black**: Python code formatting
- **Mypy**: Python type checking
- **Pylint**: Python linting
- **ESLint**: JavaScript linting
- **Prettier**: JavaScript formatting

### DevOps
- **Git**: Version control with strict branching
- **pip**: Python package management
- **npm**: Node.js package management

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

### Legacy Node.js Implementation
Eski Node.js implementasyonunda bazı sorunlar vardı:
- Element visibility issues
- Slow loading handling
- Mixed concerns in code

### Python Implementation Improvements
Yeni Python implementasyonu bu sorunları çözüyor:
- **Type Safety**: Pydantic ile compile-time hata yakalama
- **Better Error Handling**: Detaylı hata mesajları ve recovery
- **Cleaner Architecture**: Separation of concerns
- **Configuration**: Centralized, validated configuration

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Architecture decisions and design
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Contribution guidelines and standards
- **README.md**: This file - setup and usage

## 🛠️ Development Roadmap

### Completed ✅
- [x] Python-first core implementation
- [x] Type-safe configuration with Pydantic
- [x] Comprehensive validation layer
- [x] Error handling framework
- [x] CLI interface
- [x] Development tooling (black, mypy, pylint, eslint, prettier)
- [x] Architecture documentation
- [x] Contribution guidelines

### In Progress 🚧
- [ ] IPC bridge for Node.js ↔ Python integration
- [ ] Health check endpoints
- [ ] Comprehensive test suite
- [ ] CI/CD pipeline

### Planned 📋
- [ ] Advanced reporting dashboard
- [ ] Database integration for report persistence
- [ ] API for external integrations
- [ ] Docker containerization
- [ ] Kubernetes deployment configs

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Not**: Bu bot test ve eğitim amaçlı geliştirilmiştir. Üretim ortamında kullanımdan önce güvenlik ve performans testlerini tamamlayın.