/**
 * FlowerBTC Core Application Module
 * @module App
 * @description Main application controller implementing modular architecture
 * @author FlowerBTC Development Team
 * @version 2.0.0
 */

import { EventBus } from './EventBus.js';
import { PerformanceMonitor } from './PerformanceMonitor.js';
import { AccessibilityManager } from './AccessibilityManager.js';

/**
 * Main Application Class
 * Implements singleton pattern for global state management
 */
export class App {
    /** @type {App|null} */
    static instance = null;
    
    /** @type {boolean} */
    static isDevelopment = process?.env?.NODE_ENV === 'development' || false;

    /**
     * Creates or returns the singleton App instance
     * @returns {App}
     */
    static getInstance() {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    constructor() {
        if (App.instance) {
            throw new Error('App is a singleton. Use App.getInstance() instead.');
        }

        /** @type {EventBus} */
        this.eventBus = new EventBus();
        
        /** @type {PerformanceMonitor} */
        this.performanceMonitor = new PerformanceMonitor();
        
        /** @type {AccessibilityManager} */
        this.accessibility = new AccessibilityManager();
        
        /** @type {Map<string, any>} */
        this.modules = new Map();
        
        /** @type {boolean} */
        this.initialized = false;
        
        /** @type {Object} */
        this.config = {
            animations: {
                enabled: true,
                reducedMotion: false
            },
            performance: {
                lazyLoadImages: true,
                throttleEvents: true
            }
        };

        this._init();
    }

    /**
     * Initialize the application
     * @private
     */
    _init() {
        if (this.initialized) return;

        this._detectReducedMotion();
        this._setupErrorHandling();
        this._setupVisibilityHandling();
        
        this.initialized = true;
        this.eventBus.emit('app:initialized', { timestamp: Date.now() });
        
        this._log('App initialized successfully');
    }

    /**
     * Detect user preference for reduced motion
     * @private
     */
    _detectReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.config.animations.reducedMotion = mediaQuery.matches;
        this.config.animations.enabled = !mediaQuery.matches;

        mediaQuery.addEventListener('change', (e) => {
            this.config.animations.reducedMotion = e.matches;
            this.config.animations.enabled = !e.matches;
            this.eventBus.emit('app:reducedMotionChanged', { reduced: e.matches });
        });
    }

    /**
     * Setup global error handling
     * @private
     */
    _setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this._error('Global error:', event.error);
            this.eventBus.emit('app:error', { error: event.error, source: 'window' });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this._error('Unhandled promise rejection:', event.reason);
            this.eventBus.emit('app:error', { error: event.reason, source: 'promise' });
        });
    }

    /**
     * Setup page visibility handling for performance
     * @private
     */
    _setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            const isVisible = document.visibilityState === 'visible';
            this.eventBus.emit('app:visibilityChanged', { visible: isVisible });
            
            if (isVisible) {
                this.performanceMonitor.resume();
            } else {
                this.performanceMonitor.pause();
            }
        });
    }

    /**
     * Register a module with the application
     * @param {string} name - Module identifier
     * @param {Object} moduleInstance - Module instance
     */
    registerModule(name, moduleInstance) {
        if (this.modules.has(name)) {
            this._warn(`Module '${name}' is being overwritten`);
        }
        this.modules.set(name, moduleInstance);
        this.eventBus.emit('app:moduleRegistered', { name, module: moduleInstance });
    }

    /**
     * Get a registered module
     * @param {string} name - Module identifier
     * @returns {Object|undefined}
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Check if animations should run
     * @returns {boolean}
     */
    shouldAnimate() {
        return this.config.animations.enabled && !this.config.animations.reducedMotion;
    }

    /**
     * Development-only logging
     * @param {...any} args
     * @private
     */
    _log(...args) {
        if (App.isDevelopment) {
            // eslint-disable-next-line no-console
            console.log('[FlowerBTC]', ...args);
        }
    }

    /**
     * Development-only warning
     * @param {...any} args
     * @private
     */
    _warn(...args) {
        if (App.isDevelopment) {
            // eslint-disable-next-line no-console
            console.warn('[FlowerBTC]', ...args);
        }
    }

    /**
     * Always log errors
     * @param {...any} args
     * @private
     */
    _error(...args) {
        // eslint-disable-next-line no-console
        console.error('[FlowerBTC]', ...args);
    }
}

// Export singleton instance
export const app = App.getInstance();
