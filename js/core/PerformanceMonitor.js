/**
 * Performance Monitor Module
 * @module PerformanceMonitor
 * @description Monitors and optimizes application performance
 * @version 2.0.0
 */

import { app } from './App.js';

/**
 * Performance monitoring and optimization class
 */
export class PerformanceMonitor {
    constructor() {
        /** @type {boolean} */
        this.isRunning = true;
        
        /** @type {Map<string, number>} */
        this.metrics = new Map();
        
        /** @type {IntersectionObserver|null} */
        this.visibilityObserver = null;
        
        /** @type {Set<Element>} */
        this.visibleElements = new Set();
        
        this._init();
    }

    /**
     * Initialize performance monitoring
     * @private
     */
    _init() {
        this._setupIntersectionObserver();
        this._monitorFrameRate();
    }

    /**
     * Setup IntersectionObserver for visibility tracking
     * @private
     */
    _setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        this.visibilityObserver = new IntersectionObserver(
            (entries) => this._handleVisibilityChanges(entries),
            {
                root: null,
                rootMargin: '50px',
                threshold: [0, 0.25, 0.5, 0.75, 1]
            }
        );
    }

    /**
     * Handle visibility changes from IntersectionObserver
     * @param {IntersectionObserverEntry[]} entries
     * @private
     */
    _handleVisibilityChanges(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            const isVisible = entry.isIntersecting;
            
            if (isVisible) {
                this.visibleElements.add(element);
                element.dispatchEvent(new CustomEvent('visibility:visible', { 
                    detail: { intersectionRatio: entry.intersectionRatio }
                }));
            } else {
                this.visibleElements.delete(element);
                element.dispatchEvent(new CustomEvent('visibility:hidden'));
            }
        });
    }

    /**
     * Monitor frame rate for performance issues
     * @private
     */
    _monitorFrameRate() {
        let lastTime = performance.now();
        let frames = 0;
        
        const measure = () => {
            if (!this.isRunning) return;
            
            frames++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.metrics.set('fps', fps);
                
                if (fps < 30) {
                    app.eventBus.emit('performance:lowfps', { fps });
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measure);
        };
        
        requestAnimationFrame(measure);
    }

    /**
     * Observe an element for visibility changes
     * @param {Element} element
     * @returns {Function} Cleanup function
     */
    observe(element) {
        if (!this.visibilityObserver) return () => {};
        
        this.visibilityObserver.observe(element);
        
        return () => {
            this.visibilityObserver.unobserve(element);
            this.visibleElements.delete(element);
        };
    }

    /**
     * Check if element is currently visible
     * @param {Element} element
     * @returns {boolean}
     */
    isVisible(element) {
        return this.visibleElements.has(element);
    }

    /**
     * Pause performance monitoring (page hidden)
     */
    pause() {
        this.isRunning = false;
        app.eventBus.emit('performance:paused');
    }

    /**
     * Resume performance monitoring (page visible)
     */
    resume() {
        this.isRunning = true;
        this._monitorFrameRate();
        app.eventBus.emit('performance:resumed');
    }

    /**
     * Get current performance metric
     * @param {string} name
     * @returns {number|undefined}
     */
    getMetric(name) {
        return this.metrics.get(name);
    }

    /**
     * Measure function execution time
     * @param {Function} fn
     * @param {string} label
     * @returns {any}
     */
    measure(fn, label) {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;
        
        this.metrics.set(label, duration);
        
        if (duration > 16.67) { // Longer than one frame at 60fps
            console.warn(`[Performance] '${label}' took ${duration.toFixed(2)}ms`);
        }
        
        return result;
    }

    /**
     * Create a throttled function
     * @param {Function} fn
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function}
     */
    throttle(fn, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Create a debounced function
     * @param {Function} fn
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function}
     */
    debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }
}
