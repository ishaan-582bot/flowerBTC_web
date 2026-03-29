/**
 * Contact Form Module
 * @module ContactForm
 * @description Handles contact form validation and submission
 * @version 2.0.0
 */

import { app } from '../core/App.js';

/**
 * ContactForm class for form handling
 */
export class ContactForm {
    /**
     * @param {HTMLFormElement} form - The contact form element
     */
    constructor(form) {
        /** @type {HTMLFormElement} */
        this.form = form;
        
        /** @type {HTMLElement|null} */
        this.messageContainer = document.getElementById('formMessage');
        
        /** @type {boolean} */
        this.isSubmitting = false;

        if (this.form) {
            this.init();
        }
    }

    /**
     * Initialize the form
     */
    init() {
        this._setupValidation();
        this._setupSubmission();
        app._log('ContactForm initialized');
    }

    /**
     * Setup real-time validation
     * @private
     */
    _setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this._validateField(input);
            });
            
            // Clear error on input
            input.addEventListener('input', () => {
                this._clearFieldError(input);
            });
        });
    }

    /**
     * Setup form submission
     * @private
     */
    _setupSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            // Validate all fields
            if (!this._validateForm()) {
                this._showMessage('Please fix the errors above.', 'error');
                return;
            }
            
            await this._submitForm();
        });
    }

    /**
     * Validate a single field
     * @private
     * @param {HTMLElement} field
     * @returns {boolean}
     */
    _validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (!field.validity.valid) {
            let message = '';
            
            if (field.validity.valueMissing) {
                message = 'This field is required';
            } else if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    message = 'Please enter a valid email address';
                }
            } else if (field.validity.tooShort) {
                message = `Minimum length is ${field.minLength} characters`;
            } else if (field.validity.tooLong) {
                message = `Maximum length is ${field.maxLength} characters`;
            }
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
            
            field.setAttribute('aria-invalid', 'true');
            return false;
        }
        
        this._clearFieldError(field);
        return true;
    }

    /**
     * Clear field error
     * @private
     * @param {HTMLElement} field
     */
    _clearFieldError(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.setAttribute('aria-invalid', 'false');
    }

    /**
     * Validate entire form
     * @private
     * @returns {boolean}
     */
    _validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this._validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Submit the form
     * @private
     */
    async _submitForm() {
        this.isSubmitting = true;
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this._showMessage(data.message, 'success');
                this.form.reset();
                app.accessibility.announce('Message sent successfully');
            } else {
                const errorMessage = data.message || 'An error occurred. Please try again.';
                this._showMessage(errorMessage, 'error');
                
                // Show field-specific errors
                if (data.errors) {
                    Object.entries(data.errors).forEach(([field, message]) => {
                        const input = this.form.querySelector(`[name="${field}"]`);
                        const errorElement = document.getElementById(`${field}-error`);
                        
                        if (input && errorElement) {
                            errorElement.textContent = message;
                            errorElement.style.display = 'block';
                            input.setAttribute('aria-invalid', 'true');
                        }
                    });
                }
                
                app.accessibility.announce('Form submission failed. Please check the errors.');
            }
            
        } catch (error) {
            this._showMessage('Network error. Please check your connection and try again.', 'error');
            app._error('Form submission error:', error);
        } finally {
            this.isSubmitting = false;
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    /**
     * Show message to user
     * @private
     * @param {string} message
     * @param {'success'|'error'} type
     */
    _showMessage(message, type) {
        if (!this.messageContainer) return;
        
        this.messageContainer.textContent = message;
        this.messageContainer.className = `form-message ${type}`;
        this.messageContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.messageContainer.style.display = 'none';
        }, 5000);
    }
}

// Auto-initialize if form exists
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        new ContactForm(form);
    }
});
