/**
 * Growth Carousel Module
 * @module GrowthCarousel
 * @description Optimized infinite marquee for sunflower growth levels with glassmorphism cards
 * @version 3.0.0
 */

import { app } from '../core/App.js';
import { PerformanceMonitor } from '../core/PerformanceMonitor.js';

/**
 * GrowthCarousel class - Production-grade infinite marquee
 * Features: IntersectionObserver pause, passive events, RAF optimization, reduced motion support, spotlight effects
 */
export class GrowthCarousel {
    /**
     * Default configuration
     * @static
     */
    static defaults = {
        folder: 'sunflower-levels',
        count: 10,
        speedPxPerSec: 80,
        resumeDelayMs: 200,
        gapPx: 24,
        preloadCount: 3
    };

    /**
     * @param {HTMLElement} container - Marquee container element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        /** @type {HTMLElement} */
        this.container = container;
        
        /** @type {HTMLElement|null} */
        this.track = container.querySelector('.growth-track');
        
        /** @type {Object} */
        this.config = { ...GrowthCarousel.defaults, ...options };
        
        /** @type {Array<string>} */
        this.images = Array.from({ length: this.config.count }, (_, i) => 
            `${this.config.folder}/Level ${i + 1}.png`
        );
        
        /** @type {number} */
        this.logicalSetWidth = 0;
        
        /** @type {number} */
        this.position = 0;
        
        /** @type {number} */
        this.lastTimestamp = 0;
        
        /** @type {boolean} */
        this.isAutoScrolling = true;
        
        /** @type {boolean} */
        this.isDragging = false;
        
        /** @type {boolean} */
        this.isVisible = true;
        
        /** @type {number|null} */
        this.rafId = null;
        
        /** @type {number|null} */
        this.resumeTimeout = null;
        
        /** @type {number} */
        this.dragStartX = 0;
        
        /** @type {number} */
        this.dragStartPos = 0;
        
        /** @type {PerformanceMonitor} */
        this.perfMonitor = app.getModule('performance') || new PerformanceMonitor();
        
        /** @type {Function|null} */
        this.cleanupVisibility = null;
        
        /** @type {Function|null} */
        this.cleanupResize = null;

        if (this.container && this.track) {
            this.init();
        }
    }

    /**
     * Initialize the carousel
     */
    init() {
        this._loadImages();
        this._setupVisibilityObserver();
        this._setupEventListeners();
        this._setupResizeHandler();
        this._setupSpotlightEffect();
        this._checkReducedMotion();
        
        // Start animation loop
        this.rafId = requestAnimationFrame((t) => this._animate(t));
        
        app.eventBus.emit('growthCarousel:initialized', { instance: this });
    }

    /**
     * Load and clone images for seamless loop
     * @private
     */
    _loadImages() {
        this.track.innerHTML = '';
        
        // Create cards for one set
        this.images.forEach((src, index) => {
            const card = this._createCard(src, index);
            this.track.appendChild(card);
        });

        // Wait for images to load before cloning
        const imgs = Array.from(this.track.querySelectorAll('img'));
        let loadedCount = 0;
        
        const onLoad = () => {
            loadedCount++;
            if (loadedCount >= imgs.length) {
                this._measureAndClone();
            }
        };

        imgs.forEach(img => {
            if (img.complete) {
                onLoad();
            } else {
                img.addEventListener('load', onLoad, { once: true });
                img.addEventListener('error', onLoad, { once: true });
            }
        });

        // Fallback if no images
        if (imgs.length === 0) {
            this._measureAndClone();
        }
    }

    /**
     * Create a single card element with glassmorphism
     * @private
     * @param {string} src - Image source
     * @param {number} index - Card index
     * @returns {HTMLElement}
     */
    _createCard(src, index) {
        const card = document.createElement('div');
        card.className = 'growth-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `Sunflower Level ${(index % this.config.count) + 1}`);
        
        // Level badge
        const badge = document.createElement('div');
        badge.className = 'level-badge';
        badge.textContent = `Level ${(index % this.config.count) + 1}`;
        
        const img = document.createElement('img');
        img.loading = index < this.config.preloadCount ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.alt = `Sunflower Level ${(index % this.config.count) + 1}`;
        img.src = src;
        img.width = 300;
        img.height = 650;
        
        card.appendChild(badge);
        card.appendChild(img);
        
        // Add mouse move for spotlight effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        return card;
    }

    /**
     * Measure track width and clone for seamless loop
     * @private
     */
    _measureAndClone() {
        const cards = Array.from(this.track.children).slice(0, this.config.count);
        let width = 0;
        
        cards.forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            width += rect.width;
            if (idx < cards.length - 1) {
                width += this.config.gapPx;
            }
        });
        
        this.logicalSetWidth = Math.round(width);
        
        // Clone until track is wide enough for seamless loop
        const minWidth = this.container.clientWidth * 2;
        while (this.track.scrollWidth < minWidth) {
            this.images.forEach((src, i) => {
                this.track.appendChild(this._createCard(src, i));
            });
        }
        
        this.position = 0;
        this._updateTransform();
    }

    /**
     * Setup IntersectionObserver for visibility-based pause
     * @private
     */
    _setupVisibilityObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                    if (this.isVisible) {
                        this._resume();
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        observer.observe(this.container);
        this.cleanupVisibility = () => observer.disconnect();
    }

    /**
     * Setup event listeners with passive option
     * @private
     */
    _setupEventListeners() {
        // Pointer events for drag
        this.container.addEventListener('pointerdown', this._onPointerDown.bind(this), { passive: true });
        
        // Touch events for mobile
        this.container.addEventListener('touchstart', (e) => {
            this._onPointerDown(e.touches[0]);
        }, { passive: true });

        // Prevent context menu on long press
        this.container.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Setup debounced resize handler
     * @private
     */
    _setupResizeHandler() {
        const debouncedResize = this.perfMonitor.debounce(() => {
            this._loadImages();
        }, 150);

        window.addEventListener('resize', debouncedResize, { passive: true });
        this.cleanupResize = () => window.removeEventListener('resize', debouncedResize);
    }

    /**
     * Setup spotlight effect for cards
     * @private
     */
    _setupSpotlightEffect() {
        // Spotlight effect is now handled per-card in _createCard
        // This method is kept for potential future enhancements
    }

    /**
     * Check for reduced motion preference
     * @private
     */
    _checkReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isAutoScrolling = !mediaQuery.matches;
        
        mediaQuery.addEventListener('change', (e) => {
            this.isAutoScrolling = !e.matches;
        });
    }

    /**
     * Animation loop using requestAnimationFrame
     * @private
     * @param {number} timestamp
     */
    _animate(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        
        const deltaTime = Math.min(64, timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        if (this.isAutoScrolling && !this.isDragging && this.isVisible && this.logicalSetWidth > 0) {
            this.position -= this.config.speedPxPerSec * deltaTime;
            this.position = this._wrapPosition(this.position);
            this._updateTransform();
        }

        this.rafId = requestAnimationFrame((t) => this._animate(t));
    }

    /**
     * Wrap position within logical set bounds
     * @private
     * @param {number} pos
     * @returns {number}
     */
    _wrapPosition(pos) {
        if (!this.logicalSetWidth) return pos;
        
        while (pos <= -this.logicalSetWidth) pos += this.logicalSetWidth;
        while (pos > 0) pos -= this.logicalSetWidth;
        
        return pos;
    }

    /**
     * Update CSS transform
     * @private
     */
    _updateTransform() {
        this.track.style.transform = `translate3d(${this.position}px, 0, 0)`;
    }

    /**
     * Handle pointer down event
     * @private
     * @param {PointerEvent|Touch} e
     */
    _onPointerDown(e) {
        this.isDragging = true;
        this.isAutoScrolling = false;
        this.container.classList.add('dragging');
        
        this.dragStartX = e.clientX;
        this.dragStartPos = this.position;
        
        // Clear any pending resume
        if (this.resumeTimeout) {
            clearTimeout(this.resumeTimeout);
        }
        
        // Add move/up listeners
        window.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
        window.addEventListener('pointerup', this._onPointerUp.bind(this), { once: true });
        window.addEventListener('touchmove', (e) => {
            this._onPointerMove(e.touches[0]);
        }, { passive: true });
        window.addEventListener('touchend', this._onPointerUp.bind(this), { once: true });
    }

    /**
     * Handle pointer move event
     * @private
     * @param {PointerEvent|Touch} e
     */
    _onPointerMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.dragStartX;
        this.position = this._wrapPosition(this.dragStartPos + deltaX);
        this._updateTransform();
    }

    /**
     * Handle pointer up event
     * @private
     */
    _onPointerUp() {
        this.isDragging = false;
        this.container.classList.remove('dragging');
        
        // Remove move listeners
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('touchmove', this._onPointerMove);
        
        // Resume auto-scroll after delay (respect reduced motion)
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!mediaQuery.matches) {
            this.resumeTimeout = setTimeout(() => {
                this.isAutoScrolling = true;
            }, this.config.resumeDelayMs);
        }
    }

    /**
     * Resume auto-scrolling
     * @private
     */
    _resume() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isAutoScrolling = !mediaQuery.matches;
    }

    /**
     * Pause auto-scrolling
     */
    pause() {
        this.isAutoScrolling = false;
    }

    /**
     * Resume auto-scrolling
     */
    resume() {
        this._resume();
    }

    /**
     * Set scroll speed
     * @param {number} speed - Pixels per second
     */
    setSpeed(speed) {
        this.config.speedPxPerSec = speed;
    }

    /**
     * Destroy the carousel and cleanup
     */
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        if (this.resumeTimeout) {
            clearTimeout(this.resumeTimeout);
        }
        
        if (this.cleanupVisibility) {
            this.cleanupVisibility();
        }
        
        if (this.cleanupResize) {
            this.cleanupResize();
        }
        
        // Remove event listeners
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('touchmove', this._onPointerMove);
        
        app.eventBus.emit('growthCarousel:destroyed', { instance: this });
    }
}
