import api from "../api/axios"; // pastikan ini pathnya benar
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductCard({ product, onAddToCart }) {
  const [currentStock, setCurrentStock] = useState(product.stock);
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    try {
      // Panggil backend untuk decrease stock
      await api.post(`/customer/products/${product.id}/decrease-stock`);

      // Update stock di frontend
      setCurrentStock(prev => prev - 1);

      // Tambah ke cart
      onAddToCart(product);
    } catch (err) {
      console.error("Gagal mengurangi stock:", err);
      toast.error("Gagal menambahkan produk, coba lagi!");
    }
  };

  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-gray-50/20 rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col items-center">
      <div className="flex justify-center w-full">
        <img
          src={`http://localhost:8000/storage/${product.image}`}
          alt={product.name}
          className="w-full max-w-[200px] sm:max-w-[250px] h-auto aspect-square object-cover rounded-md"
        />
      </div>

      <h2
        className="text-base sm:text-lg font-semibold mt-2 text-white text-center truncate w-full"
        title={product.name}
      >
        {product.name}
      </h2>

      <p className="text-gray-300 text-sm mt-1">
        Stock:{" "}
        <span className={isOutOfStock ? "text-red-400" : "text-green-400"}>
          {currentStock}
        </span>
      </p>

      <p className="text-[#eeb626] font-bold mt-1">{formatRupiah(product.price)}</p>

      <button
        disabled={isOutOfStock}
        className={`flex justify-center items-center mt-2 px-4 py-2 rounded gap-1 text-sm sm:text-base w-full max-w-[150px]
          ${isOutOfStock
            ? "bg-gray-500 cursor-not-allowed text-white"
            : "bg-[#eeb626] hover:bg-yellow-500 text-white"
          }
        `}
        onClick={handleAddToCart}
      >
        {isOutOfStock ? "Habis" : "+ Tambah"}
      </button>
    </div>
  );
}
