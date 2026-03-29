/**
 * Dock Navigation Module
 * @module DockNavigation
 * @description Mac-style dock navigation with accessibility and performance optimizations
 * @version 2.0.0
 */

import { app } from '../core/App.js';

/**
 * DockNavigation class - Accessible, performant dock navigation
 */
export class DockNavigation {
    /**
     * Default pages configuration
     * @static
     */
    static pages = [
        { id: 'home', icon: 'fas fa-home', label: 'Home', url: 'index.html' },
        { id: 'about', icon: 'fas fa-info-circle', label: 'About', url: 'about.html' },
        { id: 'contact', icon: 'fas fa-envelope', label: 'Contact', url: 'inquiry.html' },
        { id: 'faq', icon: 'fas fa-question-circle', label: 'FAQ', url: 'faq.html' }
    ];

    /**
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        /** @type {HTMLElement|null} */
        this.container = null;
        
        /** @type {Array<HTMLElement>} */
        this.items = [];
        
        /** @type {boolean} */
        this.isVisible = false;
        
        /** @type {boolean} */
        this.isHovering = false;
        
        /** @type {number} */
        this.mouseX = 0;
        
        /** @type {number|null} */
        this.showTimeout = null;
        
        /** @type {number|null} */
        this.rafId = null;
        
        /** @type {Object} */
        this.config = {
            showDelay: 4500,
            maxScale: 1.4,
            maxDistance: 150,
            ...options
        };

        this._init();
    }

    /**
     * Initialize dock navigation
     * @private
     */
    _init() {
        this._createDock();
        this._setupEventListeners();
        this._scheduleShow();
        this._setActiveItem();
        
        app.eventBus.emit('dockNavigation:initialized', { instance: this });
    }

    /**
     * Create dock DOM elements
     * @private
     */
    _createDock() {
        this.container = document.createElement('nav');
        this.container.className = 'dock-container';
        this.container.setAttribute('role', 'navigation');
        this.container.setAttribute('aria-label', 'Main navigation');
        
        DockNavigation.pages.forEach(page => {
            const item = this._createDockItem(page);
            this.container.appendChild(item);
            this.items.push(item);
        });
        
        document.body.insertBefore(this.container, document.body.firstChild);
    }

    /**
     * Create a single dock item
     * @private
     * @param {Object} page
     * @returns {HTMLElement}
     */
    _createDockItem(page) {
        const item = document.createElement('a');
        item.href = page.url;
        item.className = 'dock-item';
        item.setAttribute('data-page', page.id);
        item.setAttribute('role', 'link');
        item.setAttribute('aria-label', page.label);
        
        item.innerHTML = `
            <i class="dock-icon ${page.icon}" aria-hidden="true"></i>
            <span class="dock-label">${page.label}</span>
        `;
        
        // Keyboard navigation
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._navigate(page.url);
            }
        });
        
        return item;
    }

    /**
     * Setup event listeners
     * @private
     */
    _setupEventListeners() {
        // Mouse tracking for magnification
        this.container.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.isHovering = true;
            this._scheduleMagnificationUpdate();
        }, { passive: true });

        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this._resetMagnification();
        }, { passive: true });

        // Focus management for keyboard
        this.items.forEach((item, index) => {
            item.addEventListener('focus', () => {
                this._onItemFocus(index);
            });
            
            item.addEventListener('blur', () => {
                this._resetMagnification();
            });
        });
    }

    /**
     * Schedule dock show after delay
     * @private
     */
    _scheduleShow() {
        this.showTimeout = setTimeout(() => {
            this.show();
        }, this.config.showDelay);
    }

    /**
     * Show the dock
     */
    show() {
        this.container.classList.add('visible');
        this.isVisible = true;
        app.eventBus.emit('dockNavigation:shown');
    }

    /**
     * Hide the dock
     */
    hide() {
        this.container.classList.remove('visible');
        this.container.classList.add('hidden');
        this.isVisible = false;
        app.eventBus.emit('dockNavigation:hidden');
    }

    /**
     * Update magnification effect using RAF
     * @private
     */
    _scheduleMagnificationUpdate() {
        if (this.rafId) return;
        
        this.rafId = requestAnimationFrame(() => {
            this._updateMagnification();
            this.rafId = null;
        });
    }

    /**
     * Update item magnification based on mouse position
     * @private
     */
    _updateMagnification() {
        if (!this.isHovering) return;

        this.items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(this.mouseX - itemCenterX);
            
            if (distance < this.config.maxDistance) {
                const scale = 1 + (1 - distance / this.config.maxDistance) * (this.config.maxScale - 1);
                const translateY = -(1 - distance / this.config.maxDistance) * 15;
                item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                item.classList.add('magnified');
            } else {
                item.style.transform = '';
                item.classList.remove('magnified');
            }
        });
    }

    /**
     * Handle item focus for keyboard navigation
     * @private
     * @param {number} index
     */
    _onItemFocus(index) {
        this.items.forEach((item, i) => {
            if (i === index) {
                item.style.transform = 'scale(1.2) translateY(-10px)';
            } else {
                item.style.transform = '';
            }
        });
    }

    /**
     * Reset all item magnifications
     * @private
     */
    _resetMagnification() {
        this.items.forEach(item => {
            item.style.transform = '';
            item.classList.remove('magnified');
        });
    }

    /**
     * Set active item based on current page
     * @private
     */
    _setActiveItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageMap = {
            'index.html': 'home',
            'about.html': 'about',
            'inquiry.html': 'contact',
            'faq.html': 'faq'
        };

        const activePage = pageMap[currentPage] || 'home';
        
        this.items.forEach(item => {
            const itemPage = item.getAttribute('data-page');
            item.classList.toggle('active', itemPage === activePage);
            item.setAttribute('aria-current', itemPage === activePage ? 'page' : 'false');
        });
    }

    /**
     * Navigate to URL
     * @private
     * @param {string} url
     */
    _navigate(url) {
        window.location.href = url;
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
        }
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        app.eventBus.emit('dockNavigation:destroyed');
    }
}
