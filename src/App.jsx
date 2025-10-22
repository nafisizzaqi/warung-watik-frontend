import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false); // untuk skeleton loader

  // Fetch cart
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const res = await api.get("/customer/cart");
      if (res.data.success && res.data.data?.items) {
        setCart(res.data.data.items);
      } else {
        setCart([]);
      }
    } catch (err) {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Buka drawer langsung, fetch di background
  const handleOpenCart = () => {
    setCartOpen(true);   // drawer langsung muncul
    fetchCart();         // fetch cart di background
  };

  const handleCloseCart = () => setCartOpen(false);

  // Add to cart
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

  // Cek auth
  const checkAuth = useCallback(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    checkAuth();
    fetchCart();
  };

  const handleLogout = async () => {
    try {
      await api.post("/customer/logout");
      localStorage.removeItem("user");
      setUser(null);
      setCart([]);
      toast.success("Logout berhasil!");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <Layout
                user={user}
                onLogout={handleLogout}
                onCartClick={handleOpenCart}
              >
                <Home user={user} />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute user={user}>
              <Layout
                user={user}
                onLogout={handleLogout}
                onCartClick={handleOpenCart}
              >
                <Products onAddToCart={addToCart} />
              </Layout>
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
