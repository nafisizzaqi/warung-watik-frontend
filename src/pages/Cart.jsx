import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import CartItem from "../components/CartItem";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = () => {
    api.get("/customer/cart").then(res => setCartItems(res.data));
    console.log(cartItems);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = (id, qty) => {
    api.put(`/cart/${id}`, { quantity: qty }).then(fetchCart);
  };

  const handleRemove = (id) => {
    api.delete(`/cart/${id}`).then(fetchCart);
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
