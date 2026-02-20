// List of authorized admin emails.
// This is a simple "Hardcoded" list. In a bigger app, this might live in the database.
// usage: Used by "AdminRoute" to check if a logged-in user is allowed to see the dashboard.
export const ADMIN_EMAILS = [
    // Add your email here to get access to the /admin/dashboard page.
    "abhinavgangone7@gmail.com",
];

/**
 * isAdmin Helper Function
 * 
 * What it does: Checks if an email is in our allowed list.
 * Returns: true if admin, false if not.
 */
export const isAdmin = (email) => {
    return ADMIN_EMAILS.includes(email);
};
