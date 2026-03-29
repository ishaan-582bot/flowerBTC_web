/**
 * FAQ Module
 * @module FAQ
 * @description Handles FAQ tab switching and search functionality
 * @version 2.0.0
 */

import { app } from '../core/App.js';

/**
 * FAQ class for tab and search functionality
 */
export class FAQ {
    constructor() {
        /** @type {NodeListOf<HTMLElement>} */
        this.tabs = document.querySelectorAll('.faq-tab');
        
        /** @type {NodeListOf<HTMLElement>} */
        this.panels = document.querySelectorAll('.faq-panel');
        
        /** @type {HTMLInputElement|null} */
        this.searchInput = document.getElementById('faqSearch');
        
        /** @type {NodeListOf<HTMLElement>} */
        this.faqItems = document.querySelectorAll('.faq-item');

        if (this.tabs.length && this.panels.length) {
            this.init();
        }
    }

    /**
     * Initialize FAQ functionality
     */
    init() {
        this._setupTabs();
        this._setupSearch();
        app._log('FAQ initialized');
    }

    /**
     * Setup tab switching
     * @private
     */
    _setupTabs() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this._switchTab(tab);
            });
            
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this._switchTab(tab);
                }
            });
        });
    }

    /**
     * Switch to a tab
     * @private
     * @param {HTMLElement} selectedTab
     */
    _switchTab(selectedTab) {
        const targetPanel = selectedTab.getAttribute('aria-controls');
        
        // Update tabs
        this.tabs.forEach(tab => {
            const isSelected = tab === selectedTab;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected.toString());
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
        
        // Update panels
        this.panels.forEach(panel => {
            const isActive = panel.id === targetPanel;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
        
        // Announce to screen readers
        app.accessibility.announce(`Switched to ${selectedTab.textContent.trim()} FAQ`);
    }

    /**
     * Setup search functionality
     * @private
     */
    _setupSearch() {
        if (!this.searchInput) return;
        
        const debouncedSearch = this._debounce((e) => {
            this._search(e.target.value);
        }, 300);
        
        this.searchInput.addEventListener('input', debouncedSearch);
        
        // Clear search on Escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchInput.value = '';
                this._search('');
                this.searchInput.blur();
            }
        });
    }

    /**
     * Perform search
     * @private
     * @param {string} query
     */
    _search(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        if (!normalizedQuery) {
            // Show all items
            this.faqItems.forEach(item => {
                item.classList.remove('hidden', 'highlight');
            });
            return;
        }
        
        let matchCount = 0;
        
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
            const answer = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
            
            const isMatch = question.includes(normalizedQuery) || answer.includes(normalizedQuery);
            
            item.classList.toggle('hidden', !isMatch);
            item.classList.toggle('highlight', isMatch);
            
            if (isMatch) {
                matchCount++;
                // Open matching items
                item.setAttribute('open', '');
            }
        });
        
        // Announce results to screen readers
        app.accessibility.announce(`Found ${matchCount} matching questions`);
    }

    /**
     * Debounce function
     * @private
     * @param {Function} func
     * @param {number} wait
     * @returns {Function}
     */
    _debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    new FAQ();
});
