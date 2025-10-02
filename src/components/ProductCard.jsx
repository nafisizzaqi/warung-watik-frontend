export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={`http://192.168.1.6:8000/storage/${product.image}`}
        alt={product.name}
        className="h-60 w-60 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600">Rp {product.price}</p>
      <button
        className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
        onClick={() => onAddToCart(product.id)}
      >
        Add to Cart
      </button>
    </div>
  );
}
