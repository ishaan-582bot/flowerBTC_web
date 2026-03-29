/**
 * Accessibility Manager Module
 * @module AccessibilityManager
 * @description Manages accessibility features and WCAG 2.1 AA compliance
 * @version 2.0.0
 */

import { app } from './App.js';

/**
 * Accessibility manager for WCAG 2.1 AA compliance
 */
export class AccessibilityManager {
    constructor() {
        /** @type {boolean} */
        this.keyboardNavigation = false;
        
        /** @type {Set<Element>} */
        this.focusableElements = new Set();
        
        /** @type {HTMLElement|null} */
        this.skipLink = null;
        
        this._init();
    }

    /**
     * Initialize accessibility features
     * @private
     */
    _init() {
        this._setupKeyboardNavigation();
        this._setupFocusManagement();
        this._setupSkipLink();
        this._announcePageLoad();
    }

    /**
     * Setup keyboard navigation detection
     * @private
     */
    _setupKeyboardNavigation() {
        // Detect keyboard vs mouse navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.keyboardNavigation = true;
                document.body.classList.add('keyboard-navigation');
            }
        }, { passive: true });

        document.addEventListener('mousedown', () => {
            this.keyboardNavigation = false;
            document.body.classList.remove('keyboard-navigation');
        }, { passive: true });
    }

    /**
     * Setup focus management
     * @private
     */
    _setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('focusin', (e) => {
            const modal = document.querySelector('.modal[aria-modal="true"]');
            if (modal && !modal.contains(e.target)) {
                const focusable = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length) {
                    focusable[0].focus();
                }
            }
        });
    }

    /**
     * Setup skip navigation link
     * @private
     */
    _setupSkipLink() {
        this.skipLink = document.createElement('a');
        this.skipLink.href = '#main-content';
        this.skipLink.className = 'skip-link';
        this.skipLink.textContent = 'Skip to main content';
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .skip-link {
                position: absolute;
                top: -100%;
                left: 50%;
                transform: translateX(-50%);
                background: #000;
                color: #fff;
                padding: 1rem 2rem;
                z-index: 10000;
                text-decoration: none;
                border-radius: 0 0 8px 8px;
                transition: top 0.3s;
            }
            .skip-link:focus {
                top: 0;
                outline: 3px solid #4ECDC4;
                outline-offset: 2px;
            }
            body.keyboard-navigation *:focus {
                outline: 3px solid #4ECDC4;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(styles);
        
        document.body.insertBefore(this.skipLink, document.body.firstChild);
        
        // Ensure main content has id
        const main = document.querySelector('main') || document.querySelector('#main-content');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }

    /**
     * Announce page load to screen readers
     * @private
     */
    _announcePageLoad() {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'FlowerBTC page loaded';
        
        const styles = document.createElement('style');
        styles.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(styles);
        
        document.body.appendChild(announcement);
    }

    /**
     * Announce message to screen readers
     * @param {string} message
     * @param {string} [priority='polite']
     */
    announce(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    /**
     * Trap focus within an element
     * @param {HTMLElement} element
     * @returns {Function} Cleanup function
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        element.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }

    /**
     * Set ARIA attributes on an element
     * @param {HTMLElement} element
     * @param {Object} attributes
     */
    setAriaAttributes(element, attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            if (value === null) {
                element.removeAttribute(`aria-${key}`);
            } else {
                element.setAttribute(`aria-${key}`, value);
            }
        });
    }

    /**
     * Check if element is focusable
     * @param {Element} element
     * @returns {boolean}
     */
    isFocusable(element) {
        const focusableSelectors = [
            'button:not([disabled])',
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable]'
        ];
        
        return focusableSelectors.some(selector => element.matches(selector));
    }

    /**
     * Get all focusable elements within a container
     * @param {HTMLElement} [container=document.body]
     * @returns {NodeListOf<Element>}
     */
    getFocusableElements(container = document.body) {
        return container.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }
}
