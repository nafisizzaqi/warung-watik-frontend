import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // <- untuk modal

  // Fetch data profil dan pesanan
useEffect(() => {
  const fetchData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        api.get("/customer/profile"),
        api.get("/customer/orders"), // sudah include payment & shipment
      ]);

      setUser(profileRes.data.data || null);
      setOrders(ordersRes.data.data || []);
      console.log("Orders lengkap:", ordersRes.data.data);
    } catch (err) {
      console.error("Gagal mengambil data profil atau pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Filter berdasarkan status
  const incomingOrders = orders.filter((o) => o.status === "masuk");
  const processingOrders = orders.filter((o) => o.status === "diproses");
  const readyOrders = orders.filter((o) => o.status === "siap_ambil");

  // Urutkan pesanan terbaru
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  if (loading)
    return <div className="text-center p-10 text-white">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-[#730302] text-white p-6 relative">
      {/* Header Profil */}
      {user && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#eeb626]">
            Halo, {user.name}!
          </h1>
          <p className="text-gray-300">{user.email}</p>
        </div>
      )}

      {/* Statistik Pesanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mx-24">
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Masuk</h2>
          <p className="text-4xl font-bold">{incomingOrders.length}</p>
        </div>
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Diproses</h2>
          <p className="text-4xl font-bold">{processingOrders.length}</p>
        </div>
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Siap Ambil</h2>
          <p className="text-4xl font-bold">{readyOrders.length}</p>
        </div>
      </div>

      {/* Pesanan Terbaru */}
      <h2 className="text-2xl font-bold mb-4 text-white mx-24">Pesanan Terbaru</h2>
      <div className="space-y-4 mx-24">
        {recentOrders.length === 0 ? (
          <p className="text-gray-300">Belum ada pesanan.</p>
        ) : (
          recentOrders.map((order) => (
            <div
  key={order.id}
  className="bg-gray-50/10 rounded-2xl p-4 shadow-md hover:bg-gray-50/20 transition-all relative"
>

  <div className="mx-5">
    <div className="flex justify-between items-center mb-2">
    <span className="font-bold text-xl">Nomor Pesanan</span>
  <span
      className={`text-sm px-3 py-1 rounded-full ${
        order.status === "siap_ambil"
          ? "bg-green-600/50"
          : order.status === "diproses"
          ? "bg-yellow-600/50"
          : "bg-gray-500/50"
      }`}
    >
      {order.status.replace("_", " ").toUpperCase()}
    </span>
  </div>

  <span className="font-semibold text-lg text-[#eeb626]">
      #{order.queue_number}
    </span>

  {user && (
    <div className="mt-2 text-sm text-gray-400 italic">
      Pemesan: <span className="text-[#eeb626]">{user.name}</span>
    </div>
  )}

  <div className="flex justify-between text-sm text-gray-300 mt-2">
    <span>
      {new Date(order.created_at).toLocaleDateString("id-ID")}
    </span>
    <span>
      Total: Rp {(order.total ?? 0).toLocaleString("id-ID")}
    </span>
  </div>

  {/* Tombol di pojok kanan bawah */}
  <div className="absolute bottom-12 right-9">
    <button
      onClick={() => setSelectedOrder(order)}
      className="bg-[#eeb626] hover:bg-[#d6a620] text-[#730302] font-semibold px-4 py-2 rounded-xl transition-all"
    >
      Lihat Detail
    </button>
  </div>
  </div>
</div>

          ))
        )}
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelectedOrder(null)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-[#eeb626] text-black w-11/12 md:w-2/3 lg:w-1/2 rounded-2xl shadow-xl p-6 relative">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-3 text-gray-500 bg-transparent border-none hover:border-none hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4 text-[#730302]">
                Detail Pesanan #{selectedOrder.queue_number}
              </h2>

             <div className="space-y-2">
              <p>
  <span className="font-semibold">Status:</span>{" "}
  <span
    className={`px-2 py-0.5 rounded-full text-white font-semibold text-sm ${
      selectedOrder.status === "siap_ambil"
        ? "bg-green-500"
        : selectedOrder.status === "diproses"
        ? "bg-yellow-500"
        : selectedOrder.status === "masuk"
        ? "bg-gray-500"
        : "bg-blue-500"
    }`}
  >
    {selectedOrder.status.replace("_", " ").toUpperCase()}
  </span>
</p>

              <p>
                <span className="font-semibold">Tanggal:</span>{" "}
                {new Date(selectedOrder.created_at).toLocaleString("id-ID")}
              </p>
              <p>
                <span className="font-semibold">Alamat Pengiriman:</span>{" "}
                {selectedOrder.shipping_address || "-"}
              </p>
              <p>
                <span className="font-semibold">Metode Pembayaran:</span>{" "}
                {selectedOrder.payment_method || "-"}
              </p>
              <p>
                <span className="font-semibold">Total:</span> Rp{" "}
                {(selectedOrder.total ?? 0).toLocaleString("id-ID")}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Daftar Item:</h3>
                <ul className="divide-y divide-gray-200">
                  {selectedOrder.items?.map((item) => (
                    <li
                      key={item.id}
                      className="py-2 flex justify-between items-center"
                    >
                      <span>
                        {item.product?.name || "Produk tidak tersedia"} x{" "}
                        {item.quantity}
                      </span>
                      <span className="font-medium">
                        Rp {(item.subtotal ?? 0).toLocaleString("id-ID")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#730302] hover:bg-[#5c0201] text-white px-5 py-2 rounded-xl font-semibold transition-all"
                >
                  Tutup
                </button>
              </div>
             </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
