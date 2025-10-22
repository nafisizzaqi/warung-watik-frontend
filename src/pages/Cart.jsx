import { useMemo } from "react";

export default function Cart({ isOpen, onClose, cart = [], loading = false }) {
  const isEmpty = useMemo(() => !cart || cart.length === 0, [cart]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center p-4 border-b bg-[#eeb626]">
          <button onClick={onClose} className="text-white bg-[#eeb626] hover:border-none border-none hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold ml-5 text-white">Keranjang Saya</h2>
        </div>

        <div className="p-4 h-[calc(100%-4rem)] bg-[#730302] overflow-y-auto">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow animate-pulse mb-3">
                <div className="h-10 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-3/4 bg-gray-300 rounded mb-1"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : isEmpty ? (
            <div className="flex items-center justify-center h-full text-white">
              Your cart is empty 🛒
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div className="bg-gray-50/30 p-1.5 rounded-3xl">
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-3xl hover:shadow-md bg-gray-50/30 border-none">
                    <div className="">
                      <img src={`http://localhost:8000/storage/${item.product.image}`} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    </div>
                    <div className="flex flex-col">
                      <span className="block font-medium text-white text-left">{item.product?.name || "Unnamed product"}</span>
                      {/* Rp {item.price?.toLocaleString("id-ID") ?? 0} */}
                      <span className="text-[#eeb626] font-semibold">
                        Rp {item.price?.toLocaleString("id-ID") ?? 0}
                      </span>
                      {/* <span className="text-sm text-white">Qty: {item.quantity ?? 1}</span> */}
                    </div>
                    <span className="text-white font-semibold">

                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
