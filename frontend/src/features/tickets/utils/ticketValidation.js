/**
 * Validation rules and utility functions for maintenance tickets.
 */

export const TICKET_CONSTRAINTS = {
    TITLE_MIN: 5,
    TITLE_MAX: 100,
    DESC_MIN: 10,
    DESC_MAX: 1000,
    MAX_FILES: 3,
};

/**
 * Validates the creation of a new ticket.
 * @param {Object} data - The form data (title, description, category, resourceId, etc.)
 * @param {Array} files - The selected files
 * @returns {Object} - An object containing field level error messages
 */
export const validateTicketForm = (data, files) => {
    const errors = {};

    // Title validation
    if (!data.title || !data.title.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.trim().length < TICKET_CONSTRAINTS.TITLE_MIN) {
        errors.title = `Title must be at least ${TICKET_CONSTRAINTS.TITLE_MIN} characters`;
    } else if (data.title.trim().length > TICKET_CONSTRAINTS.TITLE_MAX) {
        errors.title = `Title must not exceed ${TICKET_CONSTRAINTS.TITLE_MAX} characters`;
    }

    // Description validation
    if (!data.description || !data.description.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.trim().length < TICKET_CONSTRAINTS.DESC_MIN) {
        errors.description = `Description must be at least ${TICKET_CONSTRAINTS.DESC_MIN} characters`;
    } else if (data.description.trim().length > TICKET_CONSTRAINTS.DESC_MAX) {
        errors.description = `Description must not exceed ${TICKET_CONSTRAINTS.DESC_MAX} characters`;
    }

    // Category validation
    if (!data.category) {
        errors.category = 'Category is required';
    }

    // Resource validation
    if (!data.resourceId) {
        errors.resourceId = 'Please select a resource';
    }

    // File validation
    if (!files || files.length === 0) {
        errors.files = 'At least one attachment (image) is required';
    } else if (files.length > TICKET_CONSTRAINTS.MAX_FILES) {
        errors.files = `You can only upload up to ${TICKET_CONSTRAINTS.MAX_FILES} images`;
    }

    // Preferred Contact validation (Optional but format check if provided)
    if (data.preferredContact && data.preferredContact.trim()) {
        const contact = data.preferredContact.trim();
        // Regular expression for Sri Lankan phone numbers or general numeric contact
        // Allows optional + sign at the start and only digits (9-12 characters usually)
        const phoneRegex = /^\+?[0-9]{9,12}$/;
        if (!phoneRegex.test(contact.replace(/\s/g, ''))) {
            errors.preferredContact = 'Please enter a valid phone number (digits only)';
        }
    }

    return errors;
};

/**
 * Validates the update/edit of an existing ticket.
 * @param {Object} data - The edit form data
 * @returns {Object} - An object containing field-level error messages
 */
export const validateEditTicketForm = (data) => {
    const errors = {};

    if (!data.title || !data.title.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.trim().length < TICKET_CONSTRAINTS.TITLE_MIN) {
        errors.title = `Title must be at least ${TICKET_CONSTRAINTS.TITLE_MIN} characters`;
    }

    if (!data.description || !data.description.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.trim().length < TICKET_CONSTRAINTS.DESC_MIN) {
        errors.description = `Description must be at least ${TICKET_CONSTRAINTS.DESC_MIN} characters`;
    }

    if (data.preferredContact && data.preferredContact.trim()) {
        const contact = data.preferredContact.trim();
        const phoneRegex = /^\+?[0-9]{9,12}$/;
        if (!phoneRegex.test(contact.replace(/\s/g, ''))) {
            errors.preferredContact = 'Please enter a valid phone number';
        }
    }

    return errors;
};
