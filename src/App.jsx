import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import api from "./api/axios";
import PrivateRoute from "./components/Routes/PrivateRoute";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Sync cart dari backend
  const fetchCart = async () => {
    try {
      const res = await api.get("/customer/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Gagal fetch cart:", err);
    }
  };

const addToCart = async (product) => {
  try {
    // kirim ke backend
    await api.post("/cart", { product_id: product.id });
    
    // update frontend langsung
    setCart(prev => [...prev, product]);

    toast.success(`${product.name} berhasil ditambahkan ke cart!`);
  } catch (err) {
    console.error(err);
    toast.error(`Gagal menambahkan ${product.name} ke cart.`);
  }
};


  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
    setLoading(false);
  };

  const handleLogin = () => checkAuth();
  const handleLogout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
    fetchCart(); // ambil cart saat page pertama kali load
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <PrivateRoute user={user}>
            <Home user={user} onLogout={handleLogout} />
          </PrivateRoute>
        } />

        <Route path="/products" element={
          <PrivateRoute user={user} loading={loading}>
            <Products onAddToCart={addToCart} />
          </PrivateRoute>
        } />

        <Route path="/cart" element={
          <PrivateRoute user={user}>
            <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
