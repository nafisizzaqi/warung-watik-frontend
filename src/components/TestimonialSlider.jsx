import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import api from "../api/axios";

export default function TestimonialSlider({ reloadTrigger }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/customer/testimonials");
        setTestimonials(res.data?.data ?? []);
      } catch (err) {
        console.error("Error loading testimonials:", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [reloadTrigger]);

  if (loading)
    return <p className="text-white text-center">Loading testimonials...</p>;

  if (!testimonials.length)
    return (
      <p className="text-gray-400 text-center">
        Belum ada testimoni, jadilah yang pertama 💖
      </p>
    );

  return (
    <div className="mt-10 w-full max-w-6xl mx-auto px-4 overflow-hidden">
      <h2 className="text-2xl text-white font-semibold text-center mb-6">
        Apa Kata Mereka
      </h2>

      <Swiper
  modules={[Autoplay]}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  loop={true}
  speed={1000}
  centeredSlides={true}
  grabCursor={true}
  slidesPerView={"auto"}
  spaceBetween={30}
  watchSlidesProgress={true}
  breakpoints={{
    640: { spaceBetween: 20 },
    768: { spaceBetween: 30 },
    1024: { spaceBetween: 40 },
  }}
  className="max-w-full"
>

        {testimonials.map((item) => (
          <SwiperSlide
  key={item.id}
  style={{
    width: "300px",
  }}
>
  {({ isActive }) => (
    <div
      className={`mt-24 mb-24 bg-gray-50/30 text-white p-6 rounded-2xl shadow-lg transition-all duration-500 ease-in-out min-h-[250px] gap-4
      ${
        isActive
          ? "scale-110 shadow-2xl z-10 opacity-100"
          : "scale-90 opacity-60"
      }`}
    >
        <div className="mt-14 flex gap-4">
            <div className="w-16 h-16 rounded-full bg-[#ef3d3d] flex items-center justify-center font-bold text-white text-lg uppercase">
          {item.name?.charAt(0) || "?"}
        </div>

        <div className="flex flex-col items-start">
            <h4 className="font-semibold text-xl">{item.name || "Anonim"}</h4>

      <div className="flex justify-start mb-3">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${
              i < item.rating ? "text-yellow-400" : "text-gray-600"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <p className="italic text-gray-300 text-sm leading-relaxed">
        “{item.message}”
      </p>
        </div>
        </div>
    </div>
  )}
</SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
}
