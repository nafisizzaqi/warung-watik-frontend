import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from 'react-hot-toast';

export default function Cart({ isOpen, onClose, cart = [], loading = false }) {
  const isEmpty = useMemo(() => !cart || cart.length === 0, [cart]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const navigate = useNavigate();

  // Dummy function untuk increment & remove
  const increment = (item) => {
    console.log("Increment qty:", item);
    // nanti bisa ditambah logika update cart
  };
  const removeItem = (item) => {
    console.log("Remove item:", item);
    // nanti bisa ditambah logika update cart
  };

  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const discount = 0;
  const total = subtotal - discount;

  useEffect(() => {
    document.body.style.overflow = (isOpen || checkoutModalOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, checkoutModalOpen]);

  const openCheckoutModal = () => {
    if (isEmpty) return alert("Keranjang kosong 🛒");
    setCheckoutModalOpen(true);
  };

  const handleCheckoutModal = async () => {
    setLoadingCheckout(true);

    try {
      const orderRes = await api.post("/customer/orders", {
        shipping_address: null,
        payment_method: null,
        shipping_cost: 0,
      });

      const order = orderRes.data.data;

      setCheckoutModalOpen(false);
      onClose();

      navigate(`/order-detail/${order.id}`, {
        state: {
          fromCart: true,
          paymentMethod: paymentMethod
        }
      });
    } catch (err) {
      console.error("Checkout gagal:", err);
      toast.error("Checkout gagal, coba lagi");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 cursor-pointer" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center p-4 border-b bg-[#eeb626]">
          <button onClick={onClose} className="text-white bg-[#eeb626] hover:text-black transition-colors">
            ←
          </button>
          <h2 className="text-xl font-bold ml-5 text-white">Keranjang Saya</h2>
        </div>

        <div className="p-4 h-[calc(100%-4rem)] bg-[#730302] overflow-y-auto">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow animate-pulse mb-3">
                <div className="h-10 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-3/4 bg-gray-300 rounded mb-1"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : isEmpty ? (
            <div className="flex items-center justify-center h-full text-white">
              Your cart is empty 🛒
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50/30 p-1.5 rounded-3xl">
                  <div className="grid grid-cols-3 items-center p-3 border rounded-3xl hover:shadow-md bg-gray-50/30 border-none">
                    <div className="">
                      <img
                        src={`http://localhost:8000/storage/${item.product?.image || "placeholder.png"}`}
                        alt={item.product?.name || "Unnamed product"}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="block font-semibold text-xl text-white text-left">{item.product?.name || "Unnamed product"}</span>
                      <span className="text-[#eeb626] font-semibold">
                        Rp {(item.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white bg-gray-50/30 rounded-full w-10 h-10 flex items-center justify-center">
                          {item.quantity || 1}x
                        </span>
                        <button
                          className="flex items-center justify-center bg-gray-50/30 text-white rounded-full w-10 h-10"
                          onClick={() => increment(item)}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-gray-50/50 cursor-pointer text-lg" onClick={() => removeItem(item)}>
                        Hapus
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="relative mt-32 mb-10 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/30 backdrop-blur-sm"></div>
            <div className="relative z-10 p-4 bg-gray-50/30 rounded-3xl bottom-0">
              <span className="text-2xl text-white">Rangkayan Pembayaran</span>
              <div className="flex flex-col gap-2 mb-3 mt-3">
                <div className="flex justify-between text-gray-800">
                  <span className="text-white">Subtotal</span>
                  <span className="text-white">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="text-white">Diskon</span>
                  <span className="text-white">Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-white">Total Bayar</span>
                  <span className="text-[#eeb626]">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <button
                onClick={handleCheckoutModal}
                className="w-full py-3 bg-[#eeb626] text-white font-semibold rounded-full"
                disabled={loadingCheckout}
              >
                {loadingCheckout ? "Memproses..." : "Bayar Sekarang"}
              </button>
              <div className="flex justify-end mb-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 appearance-none border-2 border-white rounded-full checked:bg-[#eeb626] checked:border-[#eeb626] transition-all duration-200"
                    checked={paymentMethod === "cash"}
                    onChange={e => setPaymentMethod(e.target.checked ? "cash" : "")}
                  />
                  <span className="text-white">Tunai saat ambil</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
