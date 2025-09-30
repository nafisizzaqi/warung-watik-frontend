export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <p className="font-semibold">{item.product.name}</p>
        <p>Price: Rp {item.product.price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={item.quantity}
          min="1"
          className="w-16 border rounded p-1"
          onChange={(e) => onUpdateQty(item.id, e.target.value)}
        />
        <button
          className="text-red-600 hover:underline"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
