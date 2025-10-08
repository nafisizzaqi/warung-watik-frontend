export default function Cart({ isOpen, onClose, cart = [] }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">My Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border rounded">
                  <span>{item.name}</span>
                  <span>Rp {item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
