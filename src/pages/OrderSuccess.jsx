import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  console.log("Order data:", order);

  useEffect(() => {
    if (!order && sessionId) {
      setLoading(true);
      api.get(`/customer/orders/by-session/${sessionId}`)
        .then(res => setOrder(res.data))
        .catch(err => console.error("Gagal memuat order:", err))
        .finally(() => setLoading(false));
    }
  }, [order, sessionId]);

  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] p-6">
      <div className="w-64 h-64 rounded-full bg-gray-700/50 animate-pulse mb-6"></div>
      <div className="w-48 h-6 bg-gray-600 rounded animate-pulse mb-2"></div>
      <div className="w-32 h-6 bg-gray-600 rounded animate-pulse mb-2"></div>
      <div className="flex items-center mt-4">
        <div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span className="text-white text-lg font-medium">Memuat detail pesanan...</span>
      </div>
    </div>
  );
  if (!order) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] p-6">
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-red-600/70 mb-4">
        <span className="text-white text-3xl font-bold">!</span>
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">Order Tidak Ditemukan</h2>
      <p className="text-gray-300 text-center mb-6">
        Pesanan yang kamu cari tidak ada atau mungkin sudah dihapus.
      </p>
      <button
        onClick={() => navigate("/products")}
        className="bg-[#eeb626] text-white py-3 px-6 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
      >
        Kembali ke Produk
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] text-white p-6">
      <div className="bg-gray-50/10 backdrop-blur-md rounded-3xl w-full max-w-md text-center shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#eeb626] px-4 py-3">
          <button
            onClick={() => navigate("/products")}
            className="text-white bg-[#eeb626] hover:border-none border-none hover:text-black transition-colors"
          >
            ←
          </button>

          <h2 className="text-xl font-bold text-white flex-1 text-center">
            Pesanan Berhasil!
          </h2>
          <div className="w-8"></div>
        </div>

        {/* Konten */}
        <div className="p-6">
          <div className="bg-gray-50/30 rounded-full w-56 h-56 flex flex-col items-center justify-center text-center mx-auto">
            <p className="text-lg mb-3 mt-10">Nomor antrean kamu:</p>
            <p className="text-5xl font-extrabold text-[#eeb626] mb-8">
              #{order.queue_number}
            </p>
          </div>

          <div className="text-left mb-6 space-y-2 p-4 bg-gray-50/30 rounded-3xl bottom-0 mt-10">
            <span className="text-2xl text-white">Rangkayan Pembayaran</span>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(order?.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkir:</span>
              <span>{formatRupiah(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-[#eeb626]">
                {formatRupiah(order?.grand_total)}
              </span>
            </div>

            <button
              onClick={() => navigate("/profile", { state: { order } })}
              className="bg-[#eeb626] text-white py-3 w-full rounded-full font-semibold hover:bg-yellow-500 transition-colors"
            >
              Lihat Status Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
