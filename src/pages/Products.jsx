import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/customer/products");
        setProducts(res.data.data ?? []);
      } catch (err) {
        console.error("Error fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto my-16">
      <form className="w-full relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197M17.803 15.803A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 12.607 10.607Z"
          />
        </svg>

        <input
          type="text"
          placeholder="Cari Menu"
          className="w-full pl-12 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
      </form>

      <div className="grid grid-cols-4 gap-6 bg-[#730302]">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow animate-pulse">
              <div className="h-40 w-full bg-gray-300 rounded-md mb-2"></div>
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-1"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-8 w-24 bg-gray-300 rounded mt-2"></div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))
        ) : (
          <p>No Products Found</p>
        )}
      </div>
    </div>
  );
}

