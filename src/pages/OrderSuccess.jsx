import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderSuccess() {

  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order);

  useEffect(() => {
    if (order?.id) {
      // Ambil data paling baru dari backend
      api.get(`/customer/orders/${order.id}`)
        .then(res => setOrder(res.data.data))
        .catch(err => console.error("Gagal memuat order:", err));
    }
  }, [order?.id]);

  if (!order) return <div>Memuat...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] text-white p-6">
      <div className="bg-gray-50/10 backdrop-blur-md rounded-3xl w-full max-w-md text-center shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#eeb626] px-4 py-3">
          <button
            onClick={() => navigate("/products")}
            className="text-white bg-[#eeb626] hover:border-none border-none hover:text-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          <h2 className="text-xl font-bold text-white flex-1 text-center">
            Pesanan Berhasil!
          </h2>

          {/* Spacer biar judul tetep center */}
          <div className="w-8"></div>
        </div>

        {/* Isi konten */}
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
              <span>Rp {(order?.total_amount ?? 0).toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between">
              <span>Ongkir:</span>
              <span>Rp {(order.shipping_cost || 0).toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-[#eeb626]">
                Rp {(order?.grand_total ?? 0).toLocaleString("id-ID")}
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
