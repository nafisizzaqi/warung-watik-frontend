import { useEffect, useState } from "react";
import api from "../api/axios";
import CartItem from "../components/CartItem";

export default function Cart({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = () => {
    api.get("/customer/cart").then(res => setCartItems(res.data));
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const handleUpdateQty = (id, qty) => {
    api.put(`/cart/${id}`, { quantity: qty }).then(fetchCart);
  };

  const handleRemove = (id) => {
    api.delete(`/cart/${id}`).then(fetchCart);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">My Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
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
      </div>
    </>
  );
}

