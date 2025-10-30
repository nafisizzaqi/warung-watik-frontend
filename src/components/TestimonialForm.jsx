import { useState } from "react";
import api from "../api/axios";

export default function TestimonialForm({ onSubmitted }) {
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating || !formData.message) return alert("Isi rating dan pesan ya!");

    try {
      setSubmitting(true);
      await api.post("/customer/testimonials", formData, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
      onSubmitted(); // reload data di parent
      setFormData({ name: "", rating: 0, message: "" });
      alert("Terima kasih atas ulasannya 💖");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim testimoni 😢");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#eeb626] text-white p-6 rounded-xl mt-8">
      <h2 className="text-xl font-semibold mb-4">Beri Testimoni</h2>

      <label className="block text-start mb-2">Nama</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full mb-4 p-2 rounded bg-white border border-[#eeb626] focus:border-[#eeb626] appearance-none text-[#eeb626]"
      />

      <label className="block text-start mb-2">Rating</label>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => handleRating(value)}
            className={`text-2xl ${value <= formData.rating ? "text-yellow-400" : "text-gray-500"}`}
          >
            ★
          </button>
        ))}
      </div>

      <label className="block text-start mb-2">Pesan</label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows="4"
        className="w-full mb-4 p-2 rounded text-[#eeb626] bg-white border border-[#eeb626]"
      ></textarea>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#730302] hover:bg-white hover:text-[#eeb626] px-4 py-2 rounded w-full font-semibold transition-all duration-200"
      >
        {submitting ? "Mengirim..." : "Kirim Testimoni"}
      </button>
    </form>
  );
}
