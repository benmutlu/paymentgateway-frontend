/**
 * Form Validators
 * Validation functions for forms
 */

const Validators = {
    /**
     * Validate email
     */
    email(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    },
    
    /**
     * Validate required field
     */
    required(value) {
        return value !== null && value !== undefined && value !== '';
    },
    
    /**
     * Validate minimum length
     */
    minLength(value, length) {
        return value && value.length >= length;
    },
    
    /**
     * Validate maximum length
     */
    maxLength(value, length) {
        return value && value.length <= length;
    },
    
    /**
     * Validate number
     */
    number(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    },
    
    /**
     * Validate phone number (Turkish)
     */
    phone(value) {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length === 10 || cleaned.length === 11;
    }
};

// Export to global
window.Validators = Validators;
