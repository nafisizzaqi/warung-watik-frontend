import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Filter status orders
  const incomingOrders = orders.filter((o) => o.status === "masuk");
  const processingOrders = orders.filter((o) => o.status === "diproses");
  const readyOrders = orders.filter((o) => o.status === "siap_ambil");
  const paidOrders = orders.filter((o) => o.status === "paid"); // tambah paid

  // Pesanan terbaru (3 terakhir)
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
          <h1 className="text-3xl font-bold text-[#eeb626]">Halo, {user.name}!</h1>
          <p className="text-gray-300">{user.email}</p>
        </div>
      )}

      {/* Statistik Pesanan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 mx-24">
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
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Paid</h2>
          <p className="text-4xl font-bold">{paidOrders.length}</p>
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
                    className={`text-sm px-3 py-1 rounded-full ${order.status === "siap_ambil"
                      ? "bg-green-600/50"
                      : order.status === "diproses"
                        ? "bg-yellow-600/50"
                        : order.status === "paid"
                          ? "bg-blue-600/50"
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
                  <span>{new Date(order.created_at).toLocaleDateString("id-ID")}</span>
                  <span>Total: Rp {(order.total ?? 0).toLocaleString("id-ID")}</span>
                </div>

                {/* Tombol lihat pesanan */}
                <div className="absolute bottom-12 right-9">
                  <button
                    onClick={() => navigate("/order-detail", { state: { order } })}
                    className="bg-[#eeb626] hover:bg-[#d6a620] text-[#730302] font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    Lihat Pesanan
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
