import { useEffect, useState } from "react";
import api from "../api/axios";
import TestimonialForm from "../components/TestimonialForm";

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [averageRating, setAverageRating] = useState(4.2);
  const [totalReviews, setTotalReviews] = useState(127);
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/customer/testimonials");
      const data = res.data?.data ?? [];
      setTestimonials(data);

      if (data.length > 0) {
        const total = data.reduce((sum, t) => sum + (t.rating || 0), 0);
        setTotalReviews(data.length);
        setAverageRating(total / data.length);
      }
    } catch (err) {
      console.error("Error loading testimonials:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await api.get("/customer/ratings");
        setAverageRating(res.data.average);
        setTotalReviews(res.data.total);
      } catch (err) {
        console.error("Gagal ambil data rating:", err);
      }
    };

    fetchRating();
  }, []);

  const handleSubmitRating = async () => {
    try {
      await api.post("/customer/ratings", { rating: userRating });
      const newTotal = totalReviews + 1;
      const newAverage =
        (averageRating * totalReviews + userRating) / newTotal;

      setTotalReviews(newTotal);
      setAverageRating(newAverage);
      setShowModal(false);
      setUserRating(0);
    } catch (err) {
      console.error("Gagal mengirim rating:", err);
    }
  };

  // **Skeleton untuk loading**
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 mt-10 mb-20 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div
              key={i}
              className="bg-gray-700/50 rounded-2xl p-6 flex gap-4 h-48"
            >
              <div className="w-16 h-16 rounded-full bg-gray-600" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="h-5 bg-gray-600 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-600 rounded w-1/3 mb-1" />
                <div className="h-10 bg-gray-600 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!testimonials.length)
    return (
      <p className="text-center text-gray-400">
        Belum ada testimoni, jadilah yang pertama 💖
      </p>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-10 mb-20">
      {/* Bagian Statistik Rating */}
      <div className="mb-10">
        <div className="bg-gray-50/30 rounded-full max-w-md mx-auto px-6 py-1 flex items-center gap-2">
          <img className="w-20 h-20" src="/logo.png" alt="Logo" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white mb-1">
              Warung Mbak Watik
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-500"
                      }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-xs">
                (<span className="font-semibold">{totalReviews}</span> reviews)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/30 max-w-sm mx-auto rounded-md mt-3 p-5">
          <p className="text-gray-200 mb-3">Pengalaman Keseluruhan</p>
          <div className="flex justify-start items-center mb-3">
            <p className="text-gray-300 text-6xl ml-2">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex items-center ml-2">
              <span
                className={`text-4xl ${averageRating >= 1 ? "text-yellow-400" : "text-gray-500"
                  }`}
              >
                ★
              </span>
            </div>
            <p className="text-gray-200">({totalReviews} reviews)</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#eeb626] hover:bg-[#d6a620] text-[#730302] font-semibold px-5 py-2 rounded-xl transition-all"
          >
            Nilai Pesanan Anda
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#2b0000] rounded-2xl p-6 max-w-lg w-full text-center shadow-lg">
              <TestimonialForm
                onSubmitted={() => {
                  fetchTestimonials(); // reload data
                  setShowModal(false); // otomatis tutup modal
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                className="block mx-auto mt-3 text-sm text-black hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bagian Semua Testimoni */}
      <h2 className="text-3xl font-bold text-white mb-3">Ulasan Pelanggan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => {
          const avatarUrl =
            item.avatar ||
            `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
              item.name || "Anonim"
            )}&chars=1`;

          return (
            <div
              key={item.id}
              className="bg-gray-50/30 text-white p-6 rounded-2xl shadow-lg flex gap-10 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={avatarUrl}
                alt={item.name || "User Avatar"}
                className="w-16 h-16 rounded-full mb-3 border border-gray-300"
              />
              <div className="flex flex-col items-center mb-3">
                <h4 className="text-center font-semibold">
                  {item.name || "Anonim"}
                </h4>
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${i < item.rating ? "text-yellow-400" : "text-gray-600"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="italic text-lg text-center text-gray-300">
                  “{item.message}”
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
