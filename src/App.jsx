import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import api from "./api/axios";
import PrivateRoute from "./components/Routes/PrivateRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = () => checkAuth();
  const handleLogout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  const handleAddToCart = async (productId) => {
    await api.post("/cart", { product_id: productId });
    alert("Product added to cart!");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* halaman login & register bebas diakses */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* halaman lain harus login */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <Home user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute user={user} loading={loading}>
              <Products onAddToCart={handleAddToCart} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute user={user}>
              <Cart />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
