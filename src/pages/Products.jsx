import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";

export default function Products() {
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
    <Layout>
      <div className="grid grid-cols-3 gap-6">
        {loading ? (
          // tampilkan 3 skeleton card
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow animate-pulse">
              <div className="h-40 w-full bg-gray-300 rounded-md mb-2"></div>
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-1"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-8 w-24 bg-gray-300 rounded mt-2"></div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No Products Found</p>
        )}
      </div>
    </Layout>
  );
}
