# FlowerBTC UI Improvements - Complete Implementation Guide

This document contains all 20 UI improvements implemented to transform FlowerBTC into a premium Web3 experience.

---

## Table of Contents

1. [Unified Chromatic System](#1-unified-chromatic-system)
2. [Typography Hierarchy](#2-typography-hierarchy)
3. [Hero Gradient Text Animation](#3-hero-gradient-text-animation)
4. [Privacy Policy Visual Hierarchy](#4-privacy-policy-visual-hierarchy)
5. [Growth Carousel Glassmorphism](#5-growth-carousel-glassmorphism)
6. [Dock Navigation Magnetic Hover](#6-dock-navigation-magnetic-hover)
7. [Coin Showcase Card Depth](#7-coin-showcase-card-depth)
8. [Mechanics 3D Card Flip](#8-mechanics-3d-card-flip)
9. [Form Floating Labels](#9-form-floating-labels)
10. [Loading Screen Brand Experience](#10-loading-screen-brand-experience)
11. [Custom Cursor Enhancement](#11-custom-cursor-enhancement)
12. [Ecosystem Grid Staggered Reveal](#12-ecosystem-grid-staggered-reveal)
13. [Button Hierarchy System](#13-button-hierarchy-system)
14. [Roadmap Timeline Connector](#14-roadmap-timeline-connector)
15. [Affiliate Cards Spotlight](#15-affiliate-cards-spotlight)
16. [Footer Grid Redesign](#16-footer-grid-redesign)
17. [FAQ Accordion Animation](#17-faq-accordion-animation)
18. [Background Ambient Orbs](#18-background-ambient-orbs)
19. [Mobile Menu Blur Backdrop](#19-mobile-menu-blur-backdrop)
20. [Coming Soon Device Mockups](#20-coming-soon-device-mockups)

---

## 1. Unified Chromatic System with Semantic Color Roles

### Target: Global CSS variables in :root

**Before:** Conflicting color values - #fbff00 (neon yellow), #FFD700 (gold), #4ECDC4 (turquoise), #FF6B6B (coral)

**After:** Cohesive 5-color semantic system

```css
:root {
  /* Primary Brand Colors - Muted Sunflower Gold */
  --color-primary: #F2C94C;
  --color-primary-light: #F9E79F;
  --color-primary-dark: #D4A823;
  
  /* Secondary - Fresh Teal */
  --color-secondary: #2DD4BF;
  --color-secondary-light: #5EEAD4;
  --color-secondary-dark: #14B8A6;
  
  /* Accent - Rose for CTAs */
  --color-accent: #F43F5E;
  --color-accent-light: #FB7185;
  --color-accent-dark: #E11D48;
  
  /* Neutral Scale */
  --color-text: #FFFFFF;
  --color-text-muted: rgba(255, 255, 255, 0.7);
  --color-text-dim: rgba(255, 255, 255, 0.5);
  
  /* Background Layers */
  --color-bg: #0a0a0a;
  --color-bg-elevated: rgba(255, 255, 255, 0.03);
  --color-bg-overlay: rgba(15, 23, 42, 0.6);
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-hover: rgba(242, 201, 76, 0.3);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  /* Gradients */
  --gradient-primary: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  --gradient-gold: linear-gradient(135deg, #F2C94C 0%, #FFD700 50%, #F59E0B 100%);
  --gradient-text: linear-gradient(135deg, #F2C94C 0%, #FFD700 50%, #F59E0B 100%);
  --gradient-glow: radial-gradient(ellipse at center, rgba(242, 201, 76, 0.15) 0%, transparent 70%);
}
```

### Visual Impact
Creates instant visual coherence. The muted gold (#F2C94C) feels premium and crypto-native compared to the current jarring neon yellow.

---

## 2. Typography Hierarchy with Display/Body Font Pairing

### Target: Global body and heading styles

**Before:** Single font (Poppins) for everything, no typographic scale

**After:** Dual-font system with proper hierarchy

```css
/* Import Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  /* Font Families */
  --font-display: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Typography Scale */
  --text-h1: 600 clamp(3rem, 8vw, 5rem)/1.05 var(--font-display);
  --text-h2: 600 clamp(2rem, 5vw, 3rem)/1.1 var(--font-display);
  --text-h3: 500 clamp(1.5rem, 3vw, 2rem)/1.2 var(--font-display);
  --text-h4: 500 clamp(1.25rem, 2vw, 1.5rem)/1.3 var(--font-display);
  --text-body: 400 clamp(1rem, 1.5vw, 1.125rem)/1.7 var(--font-body);
  --text-caption: 500 clamp(0.875rem, 1vw, 1rem)/1.5 var(--font-body);
  --text-small: 400 0.875rem/1.5 var(--font-body);
}

/* Apply Typography */
body { 
  font: var(--text-body);
  letter-spacing: -0.01em;
}

h1, h2, h3, h4, h5, h6 { 
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}

h1 { font: var(--text-h1); }
h2 { font: var(--text-h2); }
h3 { font: var(--text-h3); }
h4 { font: var(--text-h4); }
```

### HTML Update
```html
<!-- Update font links in head -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Visual Impact
Space Grotesk brings geometric, technical precision perfect for Web3/crypto, while Inter ensures readability.

---

## 3. Hero Section Gradient Text Restoration with Animation

### Target: .gradient-text class and .hero-title

**Before:** Flat #FFFF00 text, no effects

**After:** Animated gradient with glow

```css
.hero-title {
  font: var(--text-h1);
  background: linear-gradient(135deg, #F2C94C 0%, #FFD700 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  position: relative;
  filter: drop-shadow(0 0 40px rgba(242, 201, 76, 0.3));
}

/* Glow effect behind text */
.hero-title::before {
  content: 'FlowerBTC';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #F2C94C 0%, #FFD700 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: blur(80px);
  opacity: 0.15;
  z-index: -1;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Subtitle styling */
.hero-subtitle {
  font: var(--text-h3);
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}
```

### Visual Impact
Creates the "moment of delight" expected in crypto landing pages. The slow gradient shift draws the eye without distraction.

---

## 4. Privacy Policy Visual Hierarchy Restructuring

### Target: Privacy Policy modal content

**Before:** Wall of dense legal text with no visual breaks

**After:** Editorial design with TOC and numbered sections

```css
.privacy-section {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem;
}

.privacy-header {
  text-align: center;
  margin-bottom: 2rem;
}

.privacy-header h2 {
  font: var(--text-h2);
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.privacy-header p {
  color: var(--color-text-muted);
  font: var(--text-caption);
}

/* Table of Contents Grid */
.privacy-toc {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--color-bg-elevated);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
}

.toc-item {
  font: var(--text-caption);
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toc-item::before {
  content: attr(data-num);
  font: 600 0.75rem var(--font-body);
  color: var(--color-primary-dark);
  border: 1px solid var(--glass-border);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.toc-item:hover {
  background: rgba(242, 201, 76, 0.1);
}

/* Section Headers with Numbers */
.privacy-section h3 {
  font: var(--text-h3);
  color: var(--color-primary);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.privacy-section h3::before {
  content: attr(data-num);
  font: 600 0.875rem var(--font-body);
  color: var(--color-primary-dark);
  border: 1px solid var(--glass-border);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.privacy-section p {
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  line-height: 1.7;
}

.privacy-section ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.privacy-section li {
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}
```

### HTML Update
```html
<div class="privacy-section">
  <div class="privacy-header">
    <h2>Privacy Policy</h2>
    <p>Effective Date: January 2024</p>
  </div>
  
  <nav class="privacy-toc">
    <a href="#section1" class="toc-item" data-num="01">Information</a>
    <a href="#section2" class="toc-item" data-num="02">Usage</a>
    <a href="#section3" class="toc-item" data-num="03">Security</a>
    <a href="#section4" class="toc-item" data-num="04">Cookies</a>
    <a href="#section5" class="toc-item" data-num="05">Rights</a>
    <a href="#section6" class="toc-item" data-num="06">Contact</a>
  </nav>
  
  <h3 id="section1" data-num="01">Information We Collect</h3>
  <!-- Content -->
  
  <h3 id="section2" data-num="02">How We Use Your Information</h3>
  <!-- Content -->
</div>
```

---

## 5. Growth Carousel Card Enhancement with Glassmorphism Overlays

### Target: .growth-card elements

**Before:** Naked `<img>` tags with no container styling

**After:** Sophisticated glass containers with spotlight effect

```css
.growth-card {
  position: relative;
  flex-shrink: 0;
  width: clamp(280px, 30vw, 380px);
  background: linear-gradient(180deg, 
    rgba(255,255,255,0.05) 0%, 
    rgba(255,255,255,0.02) 100%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Spotlight effect */
.growth-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
    rgba(242, 201, 76, 0.1), 
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.growth-card:hover {
  transform: translateY(-8px);
  border-color: var(--glass-border-hover);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.growth-card:hover::before {
  opacity: 1;
}

.growth-card img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
  transition: transform 0.4s ease;
}

.growth-card:hover img {
  transform: scale(1.05);
}

/* Level Badge */
.level-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font: 600 0.875rem var(--font-display);
  color: var(--color-primary);
  z-index: 2;
}
```

### JavaScript for Mouse Tracking
```javascript
// Add to GrowthCarousel.js
_setupSpotlightEffect() {
  this.track.querySelectorAll('.growth-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}
```

---

## 6. Dock Navigation Active State & Magnetic Hover

### Target: .dock-item.active and hover states

**Before:** Clashing red active state, simple scale hover

**After:** Brand-consistent gold active, magnetic physics

```css
.dock-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: clamp(50px, 8vw, 64px);
  height: clamp(50px, 8vw, 64px);
  margin: 0 6px;
  border-radius: 16px;
  background: rgba(6, 0, 16, 0.4);
  border: 1px solid rgba(34, 34, 34, 0.3);
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center bottom;
}

/* Active State - Brand Gold */
.dock-item.active {
  background: rgba(242, 201, 76, 0.15);
  border-color: rgba(242, 201, 76, 0.5);
  box-shadow: 0 0 20px rgba(242, 201, 76, 0.2);
}

.dock-item.active .dock-icon {
  color: var(--color-primary);
}

/* Magnetic Hover */
.dock-item:hover {
  transform: scale(1.15) translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Fish-eye effect on neighbors */
.dock-item:hover + .dock-item,
.dock-item:has(+ .dock-item:hover) {
  transform: scale(1.05);
}

.dock-icon {
  font-size: clamp(18px, 3vw, 22px);
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.dock-item:hover .dock-icon {
  color: var(--color-primary);
}

/* Enhanced Label */
.dock-label {
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(6, 0, 16, 0.9);
  color: var(--color-text);
  padding: 8px 14px;
  border-radius: 10px;
  font: 500 0.8rem var(--font-body);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.dock-item:hover .dock-label {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}
```

---

## 7. Coin Showcase Card Depth & Refraction

### Target: .coin-text-container

**Before:** Flat translucent box with inconsistent blur

**After:** Layered glass with gradient border

```css
.coin-text-container {
  position: relative;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
}

/* Gradient border effect */
.coin-text-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, 
    rgba(242, 201, 76, 0.4) 0%, 
    rgba(255, 255, 255, 0.1) 50%,
    rgba(242, 201, 76, 0.2) 100%);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Inner glow */
.coin-text-container::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.coin-subheading {
  color: var(--color-primary);
  font: 600 1.25rem var(--font-display);
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}
```

---

## 8. Mechanics 3D Card Flip Refinement

### Target: .mechanic-card flip animation

**Before:** Basic rotateY with no physics or shadow animation

**After:** Spring physics with shifting shadow

```css
.mechanic-card {
  height: 320px;
  perspective: 1200px;
  cursor: pointer;
  position: relative;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), 
              box-shadow 0.4s ease;
  padding: 2rem;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.06) 0%, 
    rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-front {
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(180deg, 
    rgba(242, 201, 76, 0.1) 0%, 
    rgba(242, 201, 76, 0.02) 100%);
  border-color: rgba(242, 201, 76, 0.2);
}

/* Spring flip animation */
.mechanic-card:hover .card-front,
.mechanic-card:focus-within .card-front {
  transform: rotateY(-180deg);
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.2);
}

.mechanic-card:hover .card-back,
.mechanic-card:focus-within .card-back {
  transform: rotateY(0deg);
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.4);
}

.mechanic-icon {
  width: 90px;
  height: 90px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}
```

---

## 9. Form Input Floating Labels & Micro-interactions

### Target: .form-group inputs in contact form

**Before:** Standard block labels, abrupt focus states with wrong colors

**After:** Floating labels with coordinated focus states

```css
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 1.25rem 1rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  color: var(--color-text);
  font: var(--text-body);
  transition: all 0.3s ease;
}

/* Floating Label */
.form-group label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-dim);
  font: var(--text-caption);
  pointer-events: none;
  transition: all 0.2s ease;
  transform-origin: left top;
}

/* Float label on focus or when value exists */
.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label,
.form-group textarea:focus ~ label,
.form-group textarea:not(:placeholder-shown) ~ label {
  top: 0.5rem;
  transform: translateY(0) scale(0.8);
  color: var(--color-primary);
}

/* Focus state */
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(242, 201, 76, 0.03);
  box-shadow: 0 0 0 3px rgba(242, 201, 76, 0.1);
}

/* Validation states */
.form-group input:valid:not(:placeholder-shown) {
  border-color: var(--color-secondary);
}

.form-group input:invalid:not(:placeholder-shown):not(:focus) {
  border-color: var(--color-accent);
}

/* Error message */
.error-message {
  color: var(--color-accent);
  font: var(--text-small);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.error-message::before {
  content: '⚠';
}

.form-group input:invalid:not(:placeholder-shown):not(:focus) ~ .error-message {
  opacity: 1;
  transform: translateY(0);
}
```

### HTML Update
```html
<div class="form-group">
  <input type="text" id="name" name="name" placeholder=" " required>
  <label for="name">Full Name <span aria-label="required">*</span></label>
  <span class="error-message">Please enter your name</span>
</div>
```

---

## 10. Loading Screen Brand Experience

### Target: .loading-screen

**Before:** Basic black screen with "Loading..." text

**After:** Immersive brand moment with breathing logo

```css
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.loading-logo {
  width: 120px;
  height: 120px;
  position: relative;
}

.loading-logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: breathe 3s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(242, 201, 76, 0.3));
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(242, 201, 76, 0.2));
  }
  50% { 
    transform: scale(1.05);
    filter: drop-shadow(0 0 40px rgba(242, 201, 76, 0.4));
  }
}

/* Progress bar */
.loading-progress {
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.loading-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, 
    transparent, 
    var(--color-primary), 
    transparent);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

.loading-text {
  font: var(--text-caption);
  color: var(--color-text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### HTML Update
```html
<div class="loading-screen" role="status" aria-label="Loading FlowerBTC">
  <div class="loading-logo">
    <img src="assets/images/sunflower-logo.png" alt="" loading="eager">
  </div>
  <div class="loading-progress" aria-hidden="true"></div>
  <span class="loading-text">Loading Experience</span>
  <span class="sr-only">Loading...</span>
</div>
```

---

## 11. Custom Cursor Implementation Fix & Enhancement

### Target: .custom-cursor

**Before:** Broken Windows path, static image

**After:** CSS-only animated cursor with mix-blend-mode

```css
.custom-cursor {
  width: 24px;
  height: 24px;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  display: none;
}

.custom-cursor::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary);
  border-radius: 50%;
  transform: scale(0.5);
  transition: transform 0.15s ease;
}

.custom-cursor::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px solid var(--color-primary);
  border-radius: 50%;
  opacity: 0.5;
  transition: all 0.15s ease;
}

@media (pointer: fine) {
  .custom-cursor {
    display: block;
  }
  
  * {
    cursor: none !important;
  }
}

/* Hover state - expand */
.custom-cursor.hover::before {
  transform: scale(1);
}

.custom-cursor.hover::after {
  inset: -8px;
  opacity: 0.3;
}

/* Click state - shrink */
.custom-cursor.clicking::before {
  transform: scale(0.3);
}
```

### JavaScript Update
```javascript
// In main.js - update custom cursor
initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  
  // Smooth follow with RAF
  const animate = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = `${cursorX - 12}px`;
    cursor.style.top = `${cursorY - 12}px`;
    
    requestAnimationFrame(animate);
  };
  animate();
  
  // Hover detection
  document.querySelectorAll('a, button, .interactive').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
  
  // Click detection
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}
```

---

## 12. Ecosystem Grid Staggered Reveal Animation

### Target: .ecosystem-grid and .eco-card

**Before:** Static cards with only hover lift

**After:** Scroll-triggered staggered entrance

```css
.ecosystem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.eco-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.eco-card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Stagger delays */
.eco-card:nth-child(1) { transition-delay: 0s; }
.eco-card:nth-child(2) { transition-delay: 0.1s; }
.eco-card:nth-child(3) { transition-delay: 0.2s; }

.eco-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;
}

.eco-card:hover .eco-icon {
  transform: scale(1.1) rotate(-5deg);
}

.eco-card h3 {
  font: var(--text-h4);
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.eco-card p {
  color: var(--color-text-muted);
  font: var(--text-caption);
  margin-bottom: 1.5rem;
}
```

### JavaScript for Intersection Observer
```javascript
// Add to main.js
initEcosystemReveal() {
  const cards = document.querySelectorAll('.eco-card');
  if (!cards.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
  
  cards.forEach(card => observer.observe(card));
}
```

---

## 13. Button Consistency with Primary/Secondary/Tertiary Hierarchy

### Target: All button classes

**Before:** Inconsistent styling - 30px, 10px, 4px border-radius, random colors

**After:** Standardized three button types

```css
/* Base Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font: 500 0.9375rem var(--font-body);
  letter-spacing: -0.01em;
  text-decoration: none;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #0a0a0a;
  box-shadow: 0 4px 14px rgba(242, 201, 76, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 201, 76, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(242, 201, 76, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
  border: 1px solid var(--glass-border);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Tertiary Button */
.btn-tertiary {
  background: transparent;
  color: var(--color-primary);
  padding: 0.75rem 1rem;
}

.btn-tertiary:hover {
  background: rgba(242, 201, 76, 0.1);
}

/* Shine effect on hover */
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}
```

### HTML Update
```html
<!-- Before -->
<a href="#" class="cta-button primary">Explore</a>

<!-- After -->
<a href="#" class="btn btn-primary">
  <i class="fab fa-telegram"></i>
  Explore The Game
</a>
```

---

## 14. Roadmap Timeline Connector Refinement

### Target: .roadmap-timeline

**Before:** Basic 2px line with no progress indication

**After:** Progress-aware connector with glowing nodes

```css
.roadmap-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

/* Timeline connector */
.roadmap-container::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, 
    var(--color-primary) 0%, 
    var(--color-primary) var(--progress, 50%), 
    var(--glass-border) var(--progress, 50%), 
    var(--glass-border) 100%);
  border-radius: 2px;
}

.roadmap-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 3rem;
  position: relative;
  padding-left: 8px;
}

.roadmap-marker {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  z-index: 1;
  position: relative;
  transition: all 0.3s ease;
}

/* Completed */
.roadmap-item.completed .roadmap-marker {
  background: var(--gradient-primary);
  color: #0a0a0a;
  box-shadow: 0 0 20px rgba(242, 201, 76, 0.4);
}

/* Active/In Progress */
.roadmap-item.active .roadmap-marker {
  background: var(--color-bg);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  animation: pulse-node 2s ease infinite;
}

@keyframes pulse-node {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(242, 201, 76, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 12px rgba(242, 201, 76, 0);
  }
}

/* Future */
.roadmap-item.future .roadmap-marker {
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  color: var(--color-text-dim);
}

.roadmap-content {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1.5rem;
  flex: 1;
  transition: all 0.3s ease;
}

.roadmap-item:hover .roadmap-content {
  border-color: var(--glass-border-hover);
  transform: translateX(8px);
}
```

---

## 15. Affiliate Cards Grid with Hover Spotlight

### Target: .info-card in affiliate section

**Before:** Dark cards with basic hover lift

**After:** Radial spotlight and border illumination

```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.info-card {
  position: relative;
  background: linear-gradient(180deg, 
    rgba(30, 37, 48, 0.9) 0%, 
    rgba(20, 25, 32, 0.95) 100%);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  padding: 2rem;
  overflow: hidden;
  transition: all 0.4s ease;
}

/* Inner spotlight glow */
.info-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(242, 201, 76, 0.08),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

/* Border highlight */
.info-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: radial-gradient(
    400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(242, 201, 76, 0.4),
    transparent 50%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.info-card:hover::before,
.info-card:hover::after {
  opacity: 1;
}

.info-card:hover {
  transform: translateY(-4px);
}

.info-card h3 {
  font: var(--text-h4);
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.info-card.highlight {
  background: linear-gradient(180deg, 
    rgba(242, 201, 76, 0.08) 0%, 
    rgba(20, 25, 32, 0.95) 100%);
  border-color: rgba(242, 201, 76, 0.3);
}
```

---

## 16. Footer Redesign with Grid System

### Target: footer and .footer-content

**Before:** 3-column grid (1fr 2fr 1fr), plain links

**After:** 4-column balanced layout with animated underlines

```css
footer {
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(0,0,0,0.5) 100%);
  border-top: 1px solid var(--glass-border);
  padding: 4rem 2rem 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Brand Column */
.footer-brand {
  max-width: 280px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo img {
  height: 40px;
  width: auto;
}

.footer-logo span {
  font: 600 1.25rem var(--font-display);
  color: var(--color-text);
}

.footer-tagline {
  font: var(--text-caption);
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Link Columns */
.link-group h4 {
  font: 600 0.875rem var(--font-body);
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.link-group a {
  display: block;
  color: var(--color-text-muted);
  text-decoration: none;
  font: var(--text-caption);
  padding: 0.375rem 0;
  position: relative;
  transition: color 0.2s;
  width: fit-content;
}

/* Animated underline */
.link-group a::after {
  content: '';
  position: absolute;
  bottom: 0.25rem;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.link-group a:hover {
  color: var(--color-primary);
}

.link-group a:hover::after {
  width: 100%;
}

/* Footer Bottom */
.footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  font: var(--text-small);
  color: var(--color-text-dim);
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.footer-social a {
  width: 40px;
  height: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-social a:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #0a0a0a;
  transform: translateY(-3px);
}
```

---

## 17. FAQ Accordion with Smooth Height Animation

### Target: FAQ page accordion items

**Before:** Static heading+paragraph blocks

**After:** Collapsible accordion with physics-based animation

```css
.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  background: none;
  border: none;
  color: var(--color-text);
  font: var(--text-h4);
  text-align: left;
  cursor: pointer;
  transition: color 0.2s;
}

.faq-question:hover {
  color: var(--color-primary);
}

.faq-icon {
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-icon::before,
.faq-icon::after {
  content: '';
  position: absolute;
  background: currentColor;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-icon::before {
  width: 12px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.faq-icon::after {
  width: 2px;
  height: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Expanded state - rotate to X */
.faq-item.open .faq-icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
}

.faq-item.open .faq-answer {
  max-height: 500px;
  transition: max-height 0.5s ease;
}

.faq-answer-content {
  padding-bottom: 1.5rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}
```

### JavaScript
```javascript
// In FAQ.js
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    
    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
      }
    });
    
    // Toggle current
    item.classList.toggle('open', !isOpen);
  });
});
```

---

## 18. Background Ambient Orb System

### Target: body background

**Before:** Static radial gradients, particle noise

**After:** Layered, depth-aware ambient orbs

```css
body {
  font: var(--text-body);
  letter-spacing: -0.01em;
  color: var(--color-text);
  background-color: var(--color-bg);
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}

/* Ambient Orbs */
body::before,
body::after {
  content: '';
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: -1;
}

/* Primary orb - gold */
body::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(242, 201, 76, 0.15) 0%, transparent 70%);
  top: -200px;
  right: -100px;
  animation: orbFloat1 20s ease-in-out infinite;
}

/* Secondary orb - teal */
body::after {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%);
  bottom: -150px;
  left: -100px;
  animation: orbFloat2 25s ease-in-out infinite;
}

@keyframes orbFloat1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30px, 20px) scale(1.1);
  }
  66% {
    transform: translate(20px, -30px) scale(0.95);
  }
}

@keyframes orbFloat2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(40px, -20px) scale(1.05);
  }
}

/* Additional orb via HTML */
.ambient-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: -1;
}

.ambient-orb.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbFloat3 30s ease-in-out infinite;
}

@keyframes orbFloat3 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-45%, -55%) scale(1.1);
  }
}
```

### HTML Update
```html
<!-- Add to body -->
<div class="ambient-orb orb-3" aria-hidden="true"></div>
```

---

## 19. Responsive Mobile Menu with Blur Backdrop

### Target: Mobile navigation

**Before:** Plain column menu, basic hamburger

**After:** Full-screen overlay with staggered link animation

```css
/* Mobile Menu Overlay */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
}

.mobile-menu.open {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}

.mobile-menu-links a {
  font: var(--text-h2);
  color: var(--color-text);
  text-decoration: none;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.mobile-menu.open .mobile-menu-links a {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger animation */
.mobile-menu.open .mobile-menu-links a:nth-child(1) { transition-delay: 0.1s; }
.mobile-menu.open .mobile-menu-links a:nth-child(2) { transition-delay: 0.15s; }
.mobile-menu.open .mobile-menu-links a:nth-child(3) { transition-delay: 0.2s; }
.mobile-menu.open .mobile-menu-links a:nth-child(4) { transition-delay: 0.25s; }
.mobile-menu.open .mobile-menu-links a:nth-child(5) { transition-delay: 0.3s; }

.mobile-menu-links a:hover {
  color: var(--color-primary);
}

/* Hamburger Button */
.menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  z-index: 1000;
}

.menu-toggle span {
  width: 20px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
}

/* Hamburger to X animation */
.menu-toggle.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle.open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-dots {
    display: none;
  }
}
```

### HTML Update
```html
<button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>

<div class="mobile-menu">
  <nav class="mobile-menu-links">
    <a href="#home">Home</a>
    <a href="#coin">Coin</a>
    <a href="#ecosystem">Ecosystem</a>
    <a href="#community">Community</a>
    <a href="inquiry.html">Contact</a>
  </nav>
</div>
```

---

## 20. Coming Soon Section Device Mockup Refinement

### Target: .device-mockups

**Before:** Simple rotation transforms with basic shadows

**After:** Floating device composition with parallax depth

```css
.device-showcase {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: -50px;
  perspective: 1000px;
  padding: 3rem 0;
}

.device-mockup {
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.device-mockup img {
  width: 100%;
  height: auto;
  display: block;
}

/* Screen glare overlay */
.device-mockup::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 40%,
    transparent 60%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

/* Center (hero) device */
.device-mockup.center {
  width: 280px;
  z-index: 3;
  transform: translateZ(50px);
}

/* Side devices */
.device-mockup.left {
  width: 240px;
  z-index: 2;
  transform: 
    translateX(30px) 
    translateZ(-30px) 
    rotateY(25deg);
  opacity: 0.8;
}

.device-mockup.right {
  width: 240px;
  z-index: 2;
  transform: 
    translateX(-30px) 
    translateZ(-30px) 
    rotateY(-25deg);
  opacity: 0.8;
}

/* Hover - align all devices */
.device-showcase:hover .device-mockup.center {
  transform: translateZ(80px);
}

.device-showcase:hover .device-mockup.left {
  transform: 
    translateX(60px) 
    translateZ(0) 
    rotateY(0deg);
  opacity: 1;
}

.device-showcase:hover .device-mockup.right {
  transform: 
    translateX(-60px) 
    translateZ(0) 
    rotateY(0deg);
  opacity: 1;
}

/* Device frame */
.device-mockup::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 30px;
  border: 8px solid #1a1a1a;
  pointer-events: none;
  z-index: 1;
}
```

### HTML Update
```html
<div class="device-showcase">
  <div class="device-mockup left">
    <img src="assets/images/app-screen-1.png" alt="" loading="lazy">
  </div>
  <div class="device-mockup center">
    <img src="assets/images/app-screen-2.png" alt="" loading="lazy">
  </div>
  <div class="device-mockup right">
    <img src="assets/images/app-screen-3.png" alt="" loading="lazy">
  </div>
</div>
```

---

## Summary

All 20 improvements have been documented with complete CSS and JavaScript code. These changes transform FlowerBTC from a basic crypto site into a premium Web3 experience with:

- **Cohesive visual identity** through unified color system
- **Premium typography** with Space Grotesk + Inter pairing
- **Delightful interactions** with animations and micro-interactions
- **Professional polish** through glassmorphism and depth effects
- **Accessibility** maintained throughout all improvements

---

**Implementation Order:**
1. Update CSS variables (Improvement #1)
2. Update font imports (Improvement #2)
3. Apply gradient text (Improvement #3)
4. Update components one by one
5. Test and refine animations
