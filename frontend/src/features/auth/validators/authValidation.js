const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/
const NAME_REGEX = /^[a-zA-Z\s\-']+$/
const UNIVERSITY_ID_REGEX = /^(IT|BS|EN)\d{6,}$/

export const getPasswordStrength = (password) => {
    // This is only a UX hint for password security; all secured in backend
    const normalized = (password || '').trim()
    if (!normalized) return ''

    let score = 0
    if (normalized.length >= 8) score += 1
    if (/[A-Z]/.test(normalized)) score += 1
    if (/[a-z]/.test(normalized)) score += 1
    if (/\d/.test(normalized)) score += 1
    if (/[^A-Za-z0-9]/.test(normalized)) score += 1

    if (score <= 2) return 'Weak'
    if (score <= 4) return 'Medium'
    return 'Strong'
}

export const validateRegisterForm = (formData) => {
    // Mirror backend rules so users get feedback before submit.
    const errors = {}
    const firstName = (formData.firstName || '').trim()
    const lastName = (formData.lastName || '').trim()
    const email = (formData.email || '').trim()
    const universityId = (formData.universityId || '').trim()
    const password = (formData.password || '').trim()
    const confirmPassword = (formData.confirmPassword || '').trim()

    if (!firstName) {
        errors.firstName = 'First name is required'
    } else if (firstName.length > 50) {
        errors.firstName = 'First name must be at most 50 characters'
    } else if (!NAME_REGEX.test(firstName)) {
        errors.firstName = 'First name cannot contain numbers'
    }

    if (!lastName) {
        errors.lastName = 'Last name is required'
    } else if (lastName.length > 50) {
        errors.lastName = 'Last name must be at most 50 characters'
    } else if (!NAME_REGEX.test(lastName)) {
        errors.lastName = 'Last name cannot contain numbers'
    }

    if (!email) {
        errors.email = 'Email is required'
    } else if (email.length > 100) {
        errors.email = 'Email must be at most 100 characters'
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Enter a valid email address'
    }

    if (universityId && universityId.length > 10) {
        errors.universityId = 'ID number must be at most 10 characters'
    } else if (universityId && !UNIVERSITY_ID_REGEX.test(universityId)) {
        errors.universityId = 'ID Number must start with IT, BS, or EN followed by at least 6 digits'
    }

    if (!password) {
        errors.password = 'Password is required'
    } else if (!PASSWORD_REGEX.test(password)) {
        errors.password = 'Password needs 8+ chars with uppercase, lowercase, and number'
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm password is required'
    } else if (confirmPassword.length > 100) {
        errors.confirmPassword = 'Confirm password must be at most 100 characters'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
    }

    return errors
}

export const validateLoginForm = (formData) => {
    // Keep login checks minimal and quick; auth decision is backend-only.
    const errors = {}
    const email = (formData.email || '').trim()
    const password = (formData.password || '').trim()

    if (!email) {
        errors.email = 'Email is required'
    } else if (email.length > 100) {
        errors.email = 'Email must be at most 100 characters'
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Enter a valid email address'
    }

    if (!password) {
        errors.password = 'Password is required'
    } else if (password.length > 100) {
        errors.password = 'Password must be at most 100 characters'
    }

    return errors
}
