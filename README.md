<div align="center">

# 🌻 FlowerBTC Website

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ishaan-582bot/flowerBTC_web)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**🚀 Web3 | GameFi | DeFi | Play-to-Earn | Crypto Mining Ecosystem**

[Live Demo](https://ishaan-582bot.github.io/flowerBTC_web) · [Report Bug](https://github.com/ishaan-582bot/flowerBTC_web/issues) · [Request Feature](https://github.com/ishaan-582bot/flowerBTC_web/issues)

</div>

---

## 📖 Description

FlowerBTC is an innovative **Web3 Telegram Mini Application** that combines GameFi, DeFi, and Play-to-Earn mechanics into a cohesive crypto mining ecosystem. This repository contains the official website featuring an interactive **Growth System** that visualizes the progression journey through 10 beautiful sunflower growth levels.

The website showcases a seamless, interactive marquee carousel with advanced JavaScript animation techniques, providing users with an engaging visual experience of the FlowerBTC growth stages.

---

## ✨ Features

### 🌻 Interactive Growth System
- **10 Dynamic Sunflower Levels** — Visual progression from Level 1 to Level 10
- **Seamless Auto-Scrolling** — Smooth continuous marquee at 80px/sec using `requestAnimationFrame`
- **Infinite Loop** — Perfect seamless looping with dynamic DOM cloning
- **Manual Drag Control** — Users can drag/swipe to manually navigate the carousel
- **Smart Interaction** — Auto-scroll pauses on interaction and intelligently resumes after 200ms

### 🎨 Advanced UI/UX
- **Responsive Design** — Optimized for desktop, tablet, and mobile devices
- **Hardware Acceleration** — GPU-accelerated transforms using `translate3d`
- **Touch & Pointer Support** — Full mobile touch and desktop mouse drag functionality
- **Accessibility First** — Respects `prefers-reduced-motion` user preferences
- **Lazy Loading** — Images load asynchronously for optimal performance

### 🛡️ Web3 Integration Ready
- **Comprehensive Privacy Policy** — Detailed GDPR-compliant privacy documentation
- **Crypto Transactional Data Handling** — Ready for Web3 wallet integrations
- **Multi-jurisdictional Compliance** — Framework for global regulatory requirements

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Animation** | `requestAnimationFrame`, CSS Transforms, Motion library |
| **Styling** | CSS Grid, Flexbox, CSS Custom Properties, `clamp()` for responsive sizing |
| **Build Tools** | Python HTTP Server (development) |
| **Dependencies** | Motion v10.16.2 |
| **Assets** | PNG Images (10 Sunflower Levels) |

---

## 📁 Folder Structure

```
flowerBTC_web/
├── 📄 index.html                 # Main HTML file (Privacy Policy + Growth System)
├── 📄 about.html                 # About page
├── 📄 faq.html                   # FAQ page
├── 📄 inquiry.html               # Inquiry/Contact page
├── 📄 style.css                  # Global stylesheet
├── 📄 script.js                  # Main JavaScript file
├── 📄 dock-nav.css               # Dock navigation styles
├── 📄 dock-nav.js                # Dock navigation logic
├── 📄 SplitText.js               # Text split animation utility
├── 📄 package.json               # Project configuration & dependencies
├── 📄 README.md                  # Project documentation
├── 📄 .htaccess                  # Apache server configuration
├── 📁 js/
│   └── 📄 growth-carousel.js    # Core marquee/carousel implementation
├── 📁 php/
│   ├── 📄 save_message.php      # Save contact form messages
│   ├── 📄 send_email.php        # Email sending handler
│   └── 📄 view_messages.php     # View stored messages
├── 📁 sql/
│   └── 📄 create_messages_table.sql  # Database schema
├── 📁 sunflower levels/         # Growth system visual assets
│   ├── 🖼️ Level 1.png
│   ├── 🖼️ Level 2.png
│   ├── 🖼️ Level 3.png
│   ├── 🖼️ Level 4.png
│   ├── 🖼️ Level 5.png
│   ├── 🖼️ Level 6.png
│   ├── 🖼️ Level 7.png
│   ├── 🖼️ Level 8.png
│   ├── 🖼️ Level 9.png
│   └── 🖼️ Level 10.png
├── 📁 Mechanics/                # Game mechanics assets
│   ├── 🖼️ Leaderboard.png
│   ├── 🖼️ Potion.png
│   ├── 🖼️ Store.png
│   ├── 🖼️ Sack.png
│   ├── 🖼️ Red Sun.png
│   └── 🖼️ Yellow Sun.png
└── 📁 Coming Soon/              # Upcoming feature SVGs
```

---

## 🚀 Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server) or any static file server

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishaan-582bot/flowerBTC_web.git
   cd flowerBTC_web
   ```

2. **Start the development server**

   **Option A: Using Python (Recommended)**
   ```bash
   python -m http.server 8000
   ```

   **Option B: Using Node.js**
   ```bash
   npx serve .
   ```

   **Option C: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click on `index.html` → "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

---

## 📄 Pages & Sections

### 1. 🏠 Home (`index.html`)
The main landing page featuring:
- **Privacy Policy Section** — Comprehensive GDPR-compliant documentation
- **Growth System Carousel** — Interactive 10-level sunflower progression

### 2. ℹ️ About (`about.html`)
Project and team overview page covering the FlowerBTC ecosystem vision.

### 3. ❓ FAQ (`faq.html`)
Frequently asked questions about the platform, tokenomics, and gameplay.

### 4. 📬 Inquiry (`inquiry.html`)
Contact/inquiry form with backend PHP integration for message handling.

---

## ⚙️ Customization

**Adjust Animation Speed** — Edit `js/growth-carousel.js`:
```javascript
const SPEED_PX_PER_SEC = 80; // Change to desired pixels per second
```

**Modify Image Sizing** — CSS uses fluid sizing with `clamp()`:
```css
.growth-card img {
    height: clamp(180px, 38vh, 520px); /* min, preferred, max */
    aspect-ratio: 9 / 19.5;
}
```

**Change Resume Delay:**
```javascript
const RESUME_DELAY_MS = 200; // Delay before auto-scroll resumes (ms)
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository and create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```

2. **Follow code standards**
   - Use semantic HTML5 elements
   - CSS: Use BEM methodology or clear naming conventions
   - JavaScript: ES6+ syntax, modular structure

3. **Test across devices** — Verify responsive behavior (320px–2560px width)

4. **Commit changes**
   ```bash
   git commit -m 'Add: Description of feature'
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/AmazingFeature
   ```

### Development Priorities
- [ ] Additional landing page sections (Hero, Features, Tokenomics)
- [ ] Web3 wallet integration UI
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Performance optimization (WebP images, lazy loading enhancements)

---

## 📜 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 FlowerBTC Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🌐 Connect With Us

<div align="center">

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?logo=telegram&logoColor=white)](https://t.me/FlowerBTCCommunity)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?logo=twitter&logoColor=white)](https://twitter.com/flowerbtc)
[![Discord](https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=white)](https://discord.gg/flowerbtc)

[⬆ Back to Top](#-flowerbtc-website)

Built with 🌻 by the **FlowerBTC Corporation** Team

</div>
