export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-gray-50/20 rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-center">
        <img
          src={`http://192.168.1.17:8000/storage/${product.image}`}
          alt={product.name}
          className="h-56 w-56 object-cover rounded-md"
        />
      </div>
      <h2 className="text-lg font-semibold mt-2 text-white truncate" title={product.name}>
        {product.name}
      </h2>
      <p className="text-[#eeb626] font-bold">Rp {product.price}</p>
      <button
        className="flex justify-center items-center mt-2 bg-[#eeb626] text-white px-2 py-1 rounded hover:bg-yellow-500 gap-1"
        onClick={() => {
          console.log("Product clicked:", product); // <--- ini akan tampil di console
          onAddToCart(product); // tetap panggil fungsi addToCart jika ada
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
