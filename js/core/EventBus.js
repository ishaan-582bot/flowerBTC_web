/**
 * Event Bus Module
 * @module EventBus
 * @description Centralized event management system for decoupled communication
 * @version 2.0.0
 */

/**
 * EventBus class implementing publish-subscribe pattern
 */
export class EventBus {
    constructor() {
        /** @type {Map<string, Set<Function>>} */
        this.listeners = new Map();
        
        /** @type {WeakMap<Function, Function>} */
        this.onceWrappers = new WeakMap();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        
        this.listeners.get(event).add(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback.apply(this, args);
        };
        
        this.onceWrappers.set(callback, wrapper);
        return this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        const listeners = this.listeners.get(event);
        if (!listeners) return;

        // Check if this was a once() wrapper
        const wrapper = this.onceWrappers.get(callback);
        if (wrapper) {
            listeners.delete(wrapper);
            this.onceWrappers.delete(callback);
        } else {
            listeners.delete(callback);
        }

        if (listeners.size === 0) {
            this.listeners.delete(event);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        const listeners = this.listeners.get(event);
        if (!listeners) return;

        listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for '${event}':`, error);
            }
        });
    }

    /**
     * Check if event has listeners
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasListeners(event) {
        const listeners = this.listeners.get(event);
        return listeners ? listeners.size > 0 : false;
    }

    /**
     * Remove all listeners for an event
     * @param {string} [event] - Event name (omit to clear all)
     */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}
