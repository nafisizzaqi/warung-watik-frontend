import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import Register from "./pages/Register";
import api from "./api/axios";
import PrivateRoute from "./components/Routes/PrivateRoute";
import { Toaster, toast } from "react-hot-toast";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Testimoni from "./pages/Testimoni";
import ProfileNavbar from "./components/Layout/ProfileNavbar";
import OrderDetail from "./pages/OrderDetail";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false); // untuk skeleton loader

  // ===========================
  // FETCH CART
  // ===========================
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const res = await api.get("/customer/cart");
      if (res.data.success && res.data.data?.items) {
        setCart(res.data.data.items);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // ===========================
  // CART DRAWER
  // ===========================
  const handleOpenCart = () => {
    setCartOpen(true);   // drawer langsung muncul
    fetchCart();         // fetch cart di background
  };
  const handleCloseCart = () => setCartOpen(false);

  // ===========================
  // ADD TO CART
  // ===========================
  const addToCart = async (product) => {
    try {
      await api.post("/customer/cart/items", {
        product_id: product.id,
        quantity: 1,
        price: product.price,
      });
      fetchCart(); // refresh cart setelah tambah
      toast.success(`${product.name} berhasil ditambahkan ke cart!`);
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      toast.error(`Gagal menambahkan ${product.name} ke cart.`);
    }
  };

  // ===========================
  // CEK AUTH
  // ===========================
  const checkAuth = useCallback(() => {
    const savedUser = localStorage.getItem("user");

    try {
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("User data corrupted in localStorage:", err);
      localStorage.removeItem("user");
      setUser(null);
    }

    setLoading(false);
  }, []);

  // ===========================
  // LOGIN & LOGOUT HANDLER
  // ===========================
  const handleLogin = async () => {
    checkAuth();
    fetchCart();
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setCart([]);

      // optional: logout ke backend
      await api.post("/customer/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ===========================
  // LIFECYCLE
  // ===========================
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  // ===========================
  // LOADING STATE
  // ===========================
  if (loading) return <div className="text-center p-10">Loading...</div>;

  // ===========================
  // ROUTES
  // ===========================
  return (
    <Router>
      <Toaster position="bottom-right" />

      <Routes>
        {/* Redirect otomatis ke /login jika belum login */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <PrivateRoute user={user}>
              <Layout user={user} onLogout={handleLogout} onCartClick={handleOpenCart}>
                <Home user={user} />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute user={user}>
              <Layout user={user} onLogout={handleLogout} onCartClick={handleOpenCart}>
                <Products onAddToCart={addToCart} />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute user={user}>
              <ProfileNavbar user={user} onLogout={handleLogout} onCartClick={handleOpenCart}>
                <Profile />
              </ProfileNavbar>
            </PrivateRoute>
          }
        />

        <Route
          path="/testimoni"
          element={
            <PrivateRoute user={user}>
              <Layout user={user} onLogout={handleLogout} onCartClick={handleOpenCart}>
                <Testimoni />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order-detail/:id"
          element={
            <PrivateRoute user={user}>
              <OrderDetail user={user} />
            </PrivateRoute>
          }
        />
      </Routes>

      <Cart
        isOpen={cartOpen}
        onClose={handleCloseCart}
        cart={cart}
        loading={cartLoading} // pass loading ke Cart.jsx
      />
    </Router>
  );
}

export default App;
