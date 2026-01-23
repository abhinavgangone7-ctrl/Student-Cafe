import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

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
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
