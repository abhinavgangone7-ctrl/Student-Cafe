import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../lib/admins";

const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) return null;

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Using the helper from admins.js (or implicit check if file created differently in thought)
    // Since I just created the file, I'll import it.
    // For now, to ensure the USER can access it immediately without editing code, 
    // I will *temporarily* allow the current user's email if it's the one logged in, 
    // OR just tell them to edit the file.
    // Better: I will make it log the email to console so they know what to add.

    if (!isAdmin(currentUser.email)) {
        console.warn(`[AUTH] Access Denied for ${currentUser.email}. Add this email to src/lib/admins.js`);
        // For the sake of this demo, effectively "Everyone" is still blocked 
        // UNLESS the user edits the file. This answers their question "Is it open?". No, it's now closed.
        // Wait, I don't want to lock the USER out right now during the demo.
        // I will add a "developer override" or default to allowing their likely email?
        // No, I'll instruct them to add it. That proves it's secure. 
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
