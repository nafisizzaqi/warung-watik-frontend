import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PageTransition from "../components/Effect/PageTransition";

export default function Profile() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");

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

  const handleNavWithTransition = (path, text, order) => {
    setTransitionText(text);
    setTransitioning(true);

    setTimeout(() => {
      navigate(path, {
        state: {
          order,
          readOnly: order.status === "success",
          paymentMethod: order.payment_method
        }
      });
      setTransitioning(false);
    }, 1500);
  };

  // Filter status orders
  const incomingOrders = orders.filter((o) => o.status === "pending");
  const processingOrders = orders.filter((o) => o.status === "processing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const paidOrders = orders.filter((o) => o.status === "success"); // tambah paid

  // Pesanan terbaru (3 terakhir)
  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading)
    return (
      <div className="min-h-screen bg-[#730302] p-6">
        {/* Skeleton Header */}
        <div className="text-center mb-8">
          <div className="h-8 w-48 bg-gray-400/50 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-400/50 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Skeleton Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 mx-24">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-400/20 p-4 rounded-2xl text-center shadow-md animate-pulse"
            >
              <div className="h-6 w-24 bg-gray-400/50 rounded mx-auto mb-2"></div>
              <div className="h-10 w-10 bg-gray-400/50 rounded mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Pesanan Terbaru */}
        <div className="space-y-4 mx-24">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-400/20 rounded-2xl p-4 shadow-md animate-pulse relative"
            >
              <div className="mx-5">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-6 w-32 bg-gray-400/50 rounded"></div>
                  <div className="h-4 w-20 bg-gray-400/50 rounded"></div>
                </div>

                <div className="h-5 w-16 bg-gray-400/50 rounded mb-2"></div>

                <div className="mt-2 space-y-1">
                  <div className="h-3 w-32 bg-gray-400/50 rounded"></div>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <div className="h-3 w-20 bg-gray-400/50 rounded"></div>
                  <div className="h-3 w-24 bg-gray-400/50 rounded"></div>
                </div>

                <div className="absolute bottom-12 right-9 h-8 w-28 bg-gray-400/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

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
          <h2 className="text-xl font-semibold mb-2">Pending</h2>
          <p className="text-4xl font-bold">{incomingOrders.length}</p>
        </div>
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Processing</h2>
          <p className="text-4xl font-bold">{processingOrders.length}</p>
        </div>
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Ready</h2>
          <p className="text-4xl font-bold">{readyOrders.length}</p>
        </div>
        <div className="bg-gray-50/20 p-4 rounded-2xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Success</h2>
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
                    className={`text-sm px-3 py-1 rounded-full ${order.status === "ready"
                      ? "bg-blue-600/50"
                      : order.status === "processing"
                        ? "bg-yellow-600/50"
                        : order.status === "success"
                          ? "bg-green-600/50"
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
                    onClick={() => handleNavWithTransition(`/order-detail/${order.id}`, `Order #${order.queue_number}`, order)}
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
      <PageTransition show={transitioning} text={transitionText} />
    </div>
  );
}
