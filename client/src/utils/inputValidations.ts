export const validateName = (name: string): boolean => {
    if (!name.trim()) {
        return false;
    }
    const nameRegex = /^[a-zA-Z\s-]+$/;
    return nameRegex.test(name);
};

export const validateMail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

export const validatePassword = (password: string): boolean => {
    return password.trim().length >= 6
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {

    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    
    const phoneNumberRegex = /^[2-9]\d{9}$/;
    return phoneNumberRegex.test(cleanedPhoneNumber);
};