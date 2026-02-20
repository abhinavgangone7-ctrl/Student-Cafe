// React Router handles navigation (moving between pages) without reloading the browser.
// - BrowserRouter: The main container that enables routing.
// - Routes: a container for all your individual "Route" definitions.
// - Route: defines a single page (URL path -> Component).
// - Navigate: used to force-redirect a user to a different page.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Context Providers.
// Context is a way to share data (like "who is logged in" or "what is in the cart")
// across the ENTIRE app without passing it down manually through every component.
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Import Layout wrappers.
// MainLayout provides the common header/footer/sidebar for pages.
import MainLayout from "./components/layout/MainLayout";
// ErrorBoundary catches crashes so the app doesn't just go white.
import ErrorBoundary from "./components/layout/ErrorBoundary";
// AdminRoute checks if the user is an admin before letting them see the page.
import AdminRoute from "./components/layout/AdminRoute";

// React internals for performance.
// - lazy: Loads a component ONLY when it is needed (code splitting).
// - Suspense: Shows a loading spinner while a "lazy" component is being downloaded.
import { lazy, Suspense } from "react";
// Import a spinner icon.
import { Loader2 } from "lucide-react";
// Import version logic (helps reload the app if a new version is deployed).
import "./lib/version";

/**
 * Lazy Load Pages
 * 
 * Why?
 * Instead of downloading the ENTIRE app code at once (which is slow),
 * we split it into small chunks. The "Checkout" code is only downloaded
 * when the user actually visits the "/checkout" page.
 */
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

/**
 * PageLoader Component
 * 
 * What it is: A simple full-screen loading spinner.
 * usage: Shown by <Suspense> while a lazy-loaded page is being fetched.
 */
const PageLoader = () => (
  // Full screen (min-h-screen), dark background, centered content.
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    {/* The spinner icon with animation */}
    <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
  </div>
);

/**
 * ProtectedRoute Wrapper
 * 
 * What it does:
 * Wraps pages that require the user to be logged in (like /cart or /checkout).
 * 
 * Logic:
 * 1. If auth is still loading -> Show a loader.
 * 2. If finished loading and NO user -> Redirect to /login.
 * 3. If user exists -> Render the protected page (children).
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Get auth state from context.

  // Wait until we know if the user is logged in or not.
  if (loading) return <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">Loading...</div>;

  // If not logged in, kick them to the login page.
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If logged in, show the protected content.
  return children;
};

/**
 * LayoutWrapper Component
 * 
 * What it does:
 * Simply wraps the page content in our standard "MainLayout" (Nav + Footer).
 * This ensures every page looks consistent.
 */
const LayoutWrapper = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

/**
 * Main App Component
 * 
 * Role:
 * The "Manager" of the application. It sets up all the global rules:
 * 1. Routing (BrowserRouter)
 * 2. Error Handling (ErrorBoundary)
 * 3. State Management (AuthProvider, CartProvider)
 * 4. Page Definitions (Routes)
 */
function App() {
  return (
    // 1. Enable Routing
    <BrowserRouter>
      {/* 2. Catch any crashes in the app */}
      <ErrorBoundary>
        {/* 3. Provide Authentication logic to everything inside */}
        <AuthProvider>
          {/* 4. Provide Shopping Cart logic to everything inside */}
          <CartProvider>
            {/* 5. Handle "Loading..." states for lazy-loaded pages */}
            <Suspense fallback={<PageLoader />}>
              {/* 6. Define the Map of URLs to Pages */}
              <Routes>

                {/* --- PUBLIC ROUTES (Anyone can visit) --- */}
                {/* Home Page */}
                <Route path="/" element={<LayoutWrapper><Landing /></LayoutWrapper>} />
                {/* Login Page */}
                <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />

                {/* --- PROTECTED ROUTES (Must be logged in) --- */}

                {/* Menu Page */}
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><Menu /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Shopping Cart Page */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><Cart /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Checkout Page */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><Checkout /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Order Confirmation (after payment) */}
                <Route
                  path="/order-confirmation"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><OrderConfirmation /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* --- ADMIN ROUTES (Must be logged in AND an Admin) --- */}
                {/* Dashboard (note: AdminRoute handles its own protection logic) */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

// Export App so main.jsx can render it.
export default App;
