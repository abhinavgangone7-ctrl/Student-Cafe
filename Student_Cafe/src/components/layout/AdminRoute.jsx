// Helper to redirect users who aren't allowed here.
import { Navigate } from "react-router-dom";
// Get the current user to see who they are.
import { useAuth } from "../../context/AuthContext";
// Helper to check if their email is in the "Allowed List".
import { isAdmin } from "../../lib/admins";

/**
 * AdminRoute Wrapper
 * 
 * What it does:
 * Protects specific pages (like the Dashboard) from regular users.
 * 
 * Logic:
 * 1. Wait for Auth to load.
 * 2. If not logged in -> Go to Login.
 * 3. If logged in but NOT an admin -> Go to Home + Log a warning.
 * 4. If Admin -> Show the page.
 */
const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    // 1. Still checking if they are logged in? Show nothing (or a loader) for a split second.
    if (loading) return null;

    // 2. Not logged in at all? Kick them to the login page.
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // 3. Logged in, but are they an Admin?
    // We check their email against our hardcoded list in 'src/lib/admins.js'.
    if (!isAdmin(currentUser.email)) {
        // Helpful log so the developer knows why they were rejected.
        console.warn(`[AUTH] Access Denied for ${currentUser.email}. Add this email to src/lib/admins.js`);

        // Redirect regular users back to the home page.
        return <Navigate to="/" />;
    }

    // 4. They are an Admin! Show the protected page.
    return children;
};

export default AdminRoute;
