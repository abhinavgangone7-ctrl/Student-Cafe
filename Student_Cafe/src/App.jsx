import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import AdminRoute from "./components/layout/AdminRoute"; // Security Wrapper
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import "./lib/version"; // Activates Chunk Load Recovery

// Lazy Load Pages to optimize initial bundle size
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Wrapper ensuring layout for specific routes (or all)
const LayoutWrapper = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LayoutWrapper><Landing /></LayoutWrapper>} />
                <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />

                {/* Protected Routes */}
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><Menu /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><Cart /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><Checkout /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper><OrderConfirmation /></LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
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

export default App;
