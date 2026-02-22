import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

/**
 * AdminRoute Wrapper
 * 
 * What it does:
 * Protects specific pages (like the Dashboard) from regular users.
 * 
 * Logic:
 * 1. Wait for Auth to load.
 * 2. If not logged in -> Go to Login.
 * 3. Verify Custom Claim: Checks the JWT Token directly from Firebase for { admin: true }.
 * 4. If Admin -> Show the page.
 */
const AdminRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const [isAdminState, setIsAdminState] = useState(null);

    useEffect(() => {
        const verifyAdminStatus = async () => {
            if (currentUser) {
                try {
                    // Force refresh to ensure we have latest claims
                    const tokenResult = await currentUser.getIdTokenResult(true);
                    
                    // The 'admin' claim is set securely by our Backend/Cloud Function
                    if (tokenResult.claims.admin === true) {
                        setIsAdminState(true);
                    } else {
                        console.warn(`[AUTH] Access Denied. User ${currentUser.email} does not have the 'admin' custom claim.`);
                        setIsAdminState(false);
                    }
                } catch (error) {
                    console.error("Error verifying admin claim:", error);
                    setIsAdminState(false);
                }
            } else {
                setIsAdminState(false); // Not logged in
            }
        };

        if (!loading) {
            verifyAdminStatus();
        }
    }, [currentUser, loading]);

    // 1. Still auth loading or checking custom claims?
    if (loading || isAdminState === null) {
        return <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">Verifying Permissions...</div>;
    }

    // 2. Not logged in at all? Kick them to the login page.
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // 3. Logged in, but NOT an Admin. Back to Home.
    if (!isAdminState) {
         return <Navigate to="/" />;
    }

    // 4. They are an Admin! Show the protected page.
    return children;
};

export default AdminRoute;
