import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function OrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Loading states
    const [loadingOrder, setLoadingOrder] = useState(true);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    // Order & couriers
    const [order, setOrder] = useState(null);
    const [couriers, setCouriers] = useState([]);

    // Form data
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [shipment, setShipment] = useState({ courier: "", service: "", cost: 0 });

    // Readonly state otomatis dari order.status
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderRes, couriersRes] = await Promise.all([
                    api.get(`/customer/orders/${id}`),
                    api.get("/customer/shipments/couriers"),
                ]);

                const fetchedOrder = orderRes.data.data;
                setOrder(fetchedOrder);
                setCouriers(couriersRes.data);

                // Prefill form
                setShippingAddress(fetchedOrder.shipping_address || "");
                setPaymentMethod(fetchedOrder.payment_method || "");

                const selectedCourier = couriersRes.data.find(c => c.courier === fetchedOrder.courier);
                const selectedService = selectedCourier?.services?.find(s => s.code === fetchedOrder.service);

                setShipment({
                    courier: selectedCourier?.courier || "",
                    service: selectedService?.code || "",
                    cost: selectedService?.cost || 0,
                });

                // Tentukan readonly dari status order
                setReadOnly(
                    ["success", "ready", "cancel"].includes(fetchedOrder.status)
                );
            } catch (err) {
                console.error(err);
                toast.error("Gagal memuat order");
            } finally {
                setLoadingOrder(false);
            }
        };
        fetchData();
    }, [id]);

    const selectedCourier = couriers.find(c => c.courier === shipment.courier);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "courier") {
            setShipment({ courier: value, service: "", cost: 0 });
        } else if (name === "service") {
            const service = selectedCourier?.services?.find(s => s.code === value);
            setShipment(prev => ({ ...prev, service: value, cost: service?.cost || 0 }));
        }
    };

    const updateOrderBeforePayment = async () => {
        await api.put(`/customer/orders/${order.id}`, {
            shipping_address: shippingAddress,
            payment_method: paymentMethod,
            courier: shipment.courier,
            service: shipment.service,
            shipping_cost: shipment.cost || 0,
        });
    };

    const handleCheckout = async () => {
        if (!shippingAddress || !paymentMethod) return toast.error("Alamat dan metode pembayaran harus diisi!");
        if (!["midtrans", "stripe", "cash"].includes(paymentMethod)) {
            return toast.error("Metode pembayaran tidak valid!");
        }
        if (!shipment.courier || !shipment.service) return toast.error("Kurir dan service harus diisi!");

        setLoadingCheckout(true);
        await updateOrderBeforePayment();

        if (paymentMethod === "midtrans") {
            const { data } = await api.post(`/customer/orders/${order.id}/midtrans/snap-token`);
            const snapToken = data.snap_token;

            window.snap.pay(snapToken, {
                onSuccess: async (result) => {
                    await api.post(`/customer/orders/${order.id}/payment`, {
                        transaction_status: result.transaction_status,
                        payment_type: result.payment_type,
                        transaction_id: result.transaction_id,
                        gross_amount: result.gross_amount,
                        shipping_cost: shipment.cost,
                        courier: shipment.courier,
                        service: shipment.service,
                    });

                    const updatedOrder = await api.get(`/customer/orders/${order.id}`);
                    setLoadingCheckout(false);
                    navigate("/order-success", { state: { order: updatedOrder.data.data } });
                },
                onPending: () => {
                    toast("Menunggu pembayaran...");
                    setLoadingCheckout(false);
                },
                onError: () => {
                    toast.error("Pembayaran gagal!");
                    setLoadingCheckout(false);
                },
                onClose: () => {
                    setLoadingCheckout(false);
                }
            });
            return;
        }

        if (paymentMethod === "stripe") {
            try {
                const { data } = await api.post(`/customer/orders/${order.id}/stripe-checkout`);
                const stripe = Stripe("pk_test_51SVPmZKTjV2bK2v7BvQd7gNj8yEe4kdjvaOrlLwkyPpDfZ4nNUIIugYMfs6DwASM88PjBEwlPGTJS2rmum7yhSkB00SmJ4GkNP");
                const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
                if (error) toast.error(error.message);
            } catch (err) {
                console.error(err);
                toast.error("Gagal membuat Stripe Checkout");
            } finally {
                setLoadingCheckout(false);
            }
            return;
        }

        if (paymentMethod === "cash") {
            const res = await api.post(`/customer/orders/${order.id}/payment`, {
                transaction_status: "settlement",
                payment_type: "cash",
                shipping_cost: shipment.cost || 0,
                courier: shipment.courier,
                service: shipment.service,
            });

            toast.success("Pesanan berhasil!");
            navigate("/order-success", { state: { order: res.data.data } });
            setLoadingCheckout(false);
        }
    };

    const formatRupiah = (value) => {
        return Number(value || 0).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
        });
    };

    if (loadingOrder) return (
        <div className="p-6 min-h-screen bg-[#730302] flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
            <div className="w-36 h-6 bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="w-28 h-6 bg-gray-600 rounded"></div>
            <span className="text-white mt-4">Memuat detail pesanan...</span>
        </div>
    );

    const totalItems = order.items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
    console.log("Order detail:", order);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] text-white p-4 sm:p-6">
            {loadingCheckout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="bg-gray-50/10 backdrop-blur-md rounded-3xl w-full max-w-6xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-[#eeb626] px-4 py-3">
                    <button onClick={() => navigate("/profile")} className="text-black bg-[#eeb626] border-none hover:border-none hover:text-white transition-colors">
                        ←
                    </button>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex-1 text-center">Detail Pesanan</h2>
                    <div className="w-6"></div>
                </div>

                <div className="flex flex-col md:flex-row p-4">
                    {/* LEFT: Produk */}
                    <div className="md:w-2/3 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.items.map(item => (
                            <div key={item.id} className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-md flex flex-col">
                                <img src={`http://localhost:8000/storage/${item.product.image}`} alt={item.product.name || "Produk"} className="w-full max-h-[200px] object-cover rounded-2xl shadow-md mb-2" />
                                <h3 className="text-lg font-bold mb-1 text-white">{item.product.name}</h3>
                                <p className="text-left"><b>Kategori:</b> {item.product.category?.name || "-"}</p>
                                <p className="text-left"><b>Deskripsi:</b> {item.product.description}</p>
                                <p className="text-left"><b>Jumlah:</b> {item.quantity || 0}</p>
                                <p className="text-left"><b>Subtotal:</b> {formatRupiah(item.subtotal)}</p>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Form */}
                    <div className="md:w-1/3 bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-md flex flex-col justify-between">
                        <div>
                            <div className="mb-2">
                                <p><b>Total Semua Item:</b> {formatRupiah(totalItems)}</p>
                                <p><b>Nomor Antrean:</b> #{order.queue_number}</p>
                            </div>

                            <div className="mt-2">
                                <label className="block mb-1 text-white">Kurir</label>
                                <select name="courier" value={shipment.courier} onChange={handleInputChange} disabled={readOnly} className="w-full rounded px-3 py-2 text-black bg-white">
                                    <option value="">Pilih kurir</option>
                                    {couriers.map(c => <option key={c.courier} value={c.courier}>{c.courier.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="mt-2">
                                <label className="block mb-1 text-white">Service</label>
                                <select name="service" value={shipment.service} onChange={handleInputChange} disabled={!shipment.courier || readOnly} className="w-full rounded px-3 py-2 text-black bg-white">
                                    <option value="">Pilih service</option>
                                    {selectedCourier?.services?.map(s => <option key={s.code} value={s.code}>{s.label} — {formatRupiah(s.cost)}</option>)}
                                </select>
                            </div>

                            <div className="mt-2">
                                <label className="block mb-1 text-white">Alamat Pengiriman</label>
                                <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} disabled={readOnly} className="w-full rounded px-3 py-2 text-black bg-white" />
                            </div>

                            <div className="mt-2">
                                <label className="block mb-1 text-white">Metode Pembayaran</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={readOnly} className="w-full rounded px-3 py-2 text-black bg-white">
                                    <option value="">Pilih metode</option>
                                    <option value="midtrans">Midtrans</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="cash">Bayar di tempat / tunai</option>
                                </select>
                            </div>
                        </div>

                        {!readOnly && (
                            <button onClick={handleCheckout} disabled={loadingCheckout} className="mt-4 w-full bg-[#eeb626] text-white py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                                {loadingCheckout ? "Memproses..." : "Bayar Sekarang"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
