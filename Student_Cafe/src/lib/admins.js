// List of authorized admin emails
export const ADMIN_EMAILS = [
    // Add your email here to get access
    "abhinavgangone7@gmail.com",
];

export const isAdmin = (email) => {
    return ADMIN_EMAILS.includes(email);
};
