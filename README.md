# FlowerBTC Website - Growth System

## Overview
The FlowerBTC website features an interactive Growth System section that showcases the 10 levels of sunflower growth with a seamless auto-scrolling marquee featuring requestAnimationFrame-based motion, manual drag control, and intelligent interaction handling.

## Features

### 🌻 Growth System Section
- **10 Sunflower Levels**: Displays all growth stages from Level 1 to Level 10
- **Seamless Auto-Scroll**: Smooth, continuous scrolling at 80px/sec using requestAnimationFrame
- **Infinite Loop**: Perfect looping with dynamic cloning to cover 2× container width
- **Manual Control**: Users can drag/swipe to manually control the marquee
- **Smart Interaction**: Auto-scroll pauses on interaction and resumes after 200ms
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects with scale animation (1.05x)
- **Accessibility**: Respects prefers-reduced-motion user preference

### 🚀 Advanced Marquee Implementation
- **requestAnimationFrame**: Smooth 60fps animation with precise timing
- **Dynamic Cloning**: Automatically clones content to ensure seamless looping
- **Touch & Pointer Support**: Full mobile touch and desktop mouse drag functionality
- **Performance Optimized**: Hardware acceleration with translate3d transforms
- **Resilient**: Rebuilds on resize and handles image loading gracefully

## File Structure

```
website/
├── index.html              # Main HTML file with Growth System section
├── js/
│   └── growth-carousel.js  # Marquee implementation
├── package.json            # Dependencies
├── README.md              # This documentation
└── sunflower levels/      # Sunflower level images
    ├── Level 1.png
    ├── Level 2.png
    ├── ...
    └── Level 10.png
```

## Installation

1. **Start Development Server**:
   ```bash
   npm start
   # or
   python -m http.server 8000
   ```

2. **Open in Browser**:
   Navigate to `http://localhost:8000`

## Implementation Details

### HTML Structure
The Growth System uses a clean, semantic HTML structure:

```html
<section id="growth-system" class="growth-section">
    <h2 class="growth-title">🌻 Growth System: Levels 1–10</h2>
    <div id="growthMarquee" class="growth-marquee" aria-label="Sunflower growth levels carousel">
        <div id="growthTrack" class="growth-track" role="list"></div>
    </div>
</section>
```

### CSS Styling
The marquee uses modern CSS with responsive design:

```css
.growth-marquee {
    position: relative;
    overflow: hidden;            /* No scrollbars */
    border-radius: 28px;
    background: transparent;     /* Show silk backdrop */
    padding: clamp(10px, 2vh, 18px);
    user-select: none;
    touch-action: pan-x;          /* Allow horizontal drags */
    cursor: grab;
}

.growth-card img {
    height: clamp(180px, 38vh, 520px);
    width: auto;
    aspect-ratio: 9 / 19.5;  /* tall phone ratio */
    object-fit: cover;
    border-radius: 22px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    pointer-events: none; /* so drag hits container */
}
```

### JavaScript Animation
The seamless scrolling uses requestAnimationFrame for smooth 60fps motion:

```javascript
function frame(ts) {
    const dt = Math.min(64, ts - lastTs) / 1000;
    lastTs = ts;

    if (auto && !dragging && logicalSetWidth > 0) {
        pos -= SPEED_PX_PER_SEC * dt;
        pos = wrapWithinSet(pos);
        track.style.transform = `translate3d(${pos}px,0,0)`;
    }
    requestAnimationFrame(frame);
}
```

### Dynamic Cloning
Content is dynamically cloned to ensure seamless looping:

```javascript
function ensureClones() {
    const minWidth = marquee.clientWidth * 2;
    while (track.scrollWidth < minWidth) {
        IMAGES.forEach((src, i) => track.appendChild(createCard(src, i)));
    }
}
```

## Responsive Design

### Desktop
- Images: clamp(180px, 38vh, 520px) height
- Smooth 80px/sec auto-scrolling animation
- Hover effects with scale (1.05x)
- clamp(16px, 3vw, 40px) gap between images
- Full manual drag control with grab/grabbing cursors

### Tablet (768px and below)
- Responsive image sizing with clamp()
- Touch-friendly scrolling with touch-action: pan-x
- Optimized spacing for medium screens
- Maintains aspect ratio 9:19.5 (phone mockup)

### Mobile (480px and below)
- Responsive image sizing with clamp()
- Full touch/swipe support
- Show 2–3 images at a time
- Optimized for mobile interaction

## Browser Support
- Modern browsers with CSS3 animation support
- CSS Grid and Flexbox support
- Hardware acceleration support

## Performance Features
- **requestAnimationFrame**: Smooth 60fps animation with precise timing control
- **Hardware Acceleration**: Uses translate3d for optimal GPU acceleration
- **Dynamic Cloning**: Intelligent content duplication for seamless looping
- **Touch Optimization**: touch-action: pan-x for smooth mobile interaction
- **Resilient Design**: Rebuilds on resize and handles image loading gracefully
- **Accessibility**: Respects prefers-reduced-motion user preference

## Customization

### Animation Speed
Adjust the scroll speed in JavaScript:
```javascript
const SPEED_PX_PER_SEC = 80; // Change to desired speed in pixels per second
```

### Image Sizing
Modify image heights using CSS clamp():
```css
.growth-card img {
    height: clamp(180px, 38vh, 520px); /* min, preferred, max */
}
```

### Spacing & Gaps
Adjust gaps between images:
```css
.growth-track {
    gap: clamp(16px, 3vw, 40px); /* min, preferred, max */
}
```

### Resume Delay
Adjust how quickly auto-scroll resumes after interaction:
```javascript
const RESUME_DELAY_MS = 200; // Change to desired delay in milliseconds
```

### Folder Configuration
Update the image folder path:
```javascript
const FOLDER = "sunflower levels"; // Change to your folder name
```

## JavaScript Functionality

### requestAnimationFrame Loop
The marquee uses a smooth animation loop for consistent 60fps motion:

```javascript
function frame(ts) {
    const dt = Math.min(64, ts - lastTs) / 1000; // clamp delta for safety
    lastTs = ts;

    if (auto && !dragging && logicalSetWidth > 0) {
        pos -= SPEED_PX_PER_SEC * dt;
        pos = wrapWithinSet(pos);
        track.style.transform = `translate3d(${pos}px,0,0)`;
    }
    requestAnimationFrame(frame);
}
```

### Pointer & Touch Support
Full mobile and desktop interaction support:

```javascript
function onPointerDown(e) {
    dragging = true;
    auto = false;
    marquee.classList.add("dragging");
    dragStartX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    dragStartPos = pos;
}

function onPointerMove(e) {
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const dx = x - dragStartX;
    pos = wrapWithinSet(dragStartPos + dx);
    track.style.transform = `translate3d(${pos}px,0,0)`;
}
```

### Smart Resume & Accessibility
Animation automatically resumes and respects user preferences:

```javascript
function onPointerUp() {
    dragging = false;
    marquee.classList.remove("dragging");

    // Respect reduced motion: don't resume if user prefers no motion
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!rm.matches) {
        setTimeout(() => (auto = true), RESUME_DELAY_MS);
    }
}
```

### Dynamic Cloning
Content is automatically cloned to ensure seamless looping:

```javascript
function ensureClones() {
    const minWidth = marquee.clientWidth * 2;
    while (track.scrollWidth < minWidth) {
        IMAGES.forEach((src, i) => track.appendChild(createCard(src, i)));
    }
}
```

## Troubleshooting

### Common Issues
1. **Images not loading**: Check file paths in `sunflower levels/` folder
2. **Animation not smooth**: Ensure browser supports CSS animations
3. **Responsive issues**: Check media query breakpoints

### Performance Tips
- Keep image file sizes optimized
- Use appropriate image formats (PNG for transparency, WebP for better compression)
- Ensure images are properly sized for their display dimensions

## Contributing
1. Follow the existing code style
2. Test on multiple devices and browsers
3. Ensure responsive design works correctly
4. Update documentation for any changes
5. Keep CSS animations performant

## License
MIT License - see package.json for details
