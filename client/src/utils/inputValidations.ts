// export const validateName = (name: string): boolean => {
//     
// }

export const validateMail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

export const validatePassword = (password: string): boolean => {
    return password.trim().length >= 6
}