import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import api from "../api/axios";

export default function OrderDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // Loading states
    const [loadingOrder, setLoadingOrder] = useState(true); // skeleton
    const [loadingCheckout, setLoadingCheckout] = useState(false); // checkout spinner
    const [order, setOrder] = useState(null);

    // Form data
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [shipment, setShipment] = useState({ courier: "", service: "", cost: 0 });
    const [couriers, setCouriers] = useState([]);

    const readOnly = location.state?.readOnly || false;
    const prePaymentMethod = location.state?.paymentMethod || "";

    // Fetch order & couriers
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderRes, couriersRes] = await Promise.all([
                    id ? api.get(`/customer/orders/${id}`) : Promise.resolve({ data: { data: location.state?.order || null } }),
                    api.get("/customer/shipments/couriers")
                ]);
                setOrder(orderRes.data.data);
                setCouriers(couriersRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingOrder(false);
            }
        };
        fetchData();
    }, [id, location.state]);

    // Sync form data
    useEffect(() => {
        if (order && couriers.length > 0) {
            setShippingAddress(order.shipping_address || "");
            setPaymentMethod(prePaymentMethod || order.payment_method || "");
            setShipment({
                courier: order.courier || "",
                service: order.service || "",
                cost: order.shipping_cost || 0
            });
        }
    }, [order, couriers, prePaymentMethod]);

    const selectedCourier = couriers.find(c => c.courier === shipment.courier);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "service") {
            const service = selectedCourier?.services?.find(s => s.code === value);
            setShipment(prev => ({ ...prev, service: value, cost: service?.cost || 0 }));
        } else if (name === "courier") {
            setShipment(prev => ({ ...prev, courier: value, service: "", cost: 0 }));
        } else {
            setShipment(prev => ({ ...prev, [name]: value }));
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
        if (!shipment.courier || !shipment.service) return toast.error("Kurir dan service harus diisi!");

        try {
            setLoadingCheckout(true);

            await updateOrderBeforePayment();

            if (paymentMethod === "midtrans") {
                const res = await api.post(`/customer/orders/${order.id}/midtrans/snap-token`);
                const snapToken = res.data.snap_token;

                window.snap.pay(snapToken, {
                    onSuccess: async () => {
                        toast.success("Pembayaran berhasil!");
                        navigate("/order-success", { state: { order } });
                    },
                    onPending: () => toast("Menunggu pembayaran..."),
                    onError: () => toast.error("Pembayaran gagal!"),
                });
            }

            if (paymentMethod === "cash") {
                await api.post(`/customer/orders/${order.id}/payment`, {
                    transaction_status: "settlement",
                    payment_type: "cash",
                    shipping_cost: shipment.cost || 0,
                    courier: shipment.courier,
                    service: shipment.service,
                });
                toast.success("Pesanan berhasil!");
                navigate("/order-success", { state: { order } });
            }
        } catch (err) {
            console.error(err);
            toast.error("Checkout gagal!");
        } finally {
            setLoadingCheckout(false);
        }
    };

    // Skeleton loading
    if (loadingOrder) return (
        <div className="p-6 min-h-screen bg-[#730302] flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
            <div className="w-48 h-6 bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="w-32 h-6 bg-gray-600 rounded animate-pulse"></div>
            <span className="text-white mt-4">Memuat detail pesanan...</span>
        </div>
    );

    const firstItem = order.items?.[0] || [];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] text-white p-6">
            {/* Loading overlay */}
            {loadingCheckout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="bg-gray-50/10 backdrop-blur-md rounded-3xl w-full max-w-6xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-[#eeb626] px-4 py-3">
                    <button onClick={() => navigate("/profile")} className="text-black bg-[#eeb626] hover:text-white hover:border-none border-none transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-white flex-1 text-center">Detail Pesanan</h2>
                    <div className="w-6"></div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                    {/* Kolom 1: Image */}
                    {firstItem.product && (
                        <div className="md:col-span-2 flex items-center justify-center">
                            <img
                                src={`http://localhost:8000/storage/${firstItem.product.image}`}
                                alt={firstItem.product.name || "Produk"}
                                className="w-full max-h-[400px] object-cover rounded-2xl shadow-md"
                            />
                        </div>
                    )}

                    {/* Kolom 2: Detail Produk */}
                    <div className="md:col-span-1 bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-md flex flex-col justify-start">
                        <h3 className="text-xl font-bold mb-4 text-white">Detail Produk</h3>
                        <p><b>Nama:</b> {firstItem.product.name}</p>
                        <p><b>Kategori:</b> {firstItem.product.category?.name || "-"}</p>
                        <p><b>Deskripsi:</b> {firstItem.product.description}</p>
                        <p><b>Jumlah:</b> {firstItem.quantity || 0}</p>
                        <p><b>Subtotal:</b> Rp {parseFloat(firstItem.subtotal || 0).toLocaleString("id-ID")}</p>

                        <div className="mt-10">
                            <p><b>Nomor Antrean:</b> #{order.queue_number}</p>
                            <p><b>Total:</b> Rp {parseFloat(order.grand_total || 0).toLocaleString("id-ID")}</p>
                        </div>
                    </div>

                    {/* Kolom 3: Form / Checkout */}
                    <div className="md:col-span-1 bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-md flex flex-col justify-between">
                        <div>
                            <div className="mt-4">
                                <label className="block mb-1 text-white">Kurir</label>
                                <select
                                    name="courier"
                                    value={shipment.courier}
                                    onChange={handleInputChange}
                                    className="w-full rounded px-3 py-2 text-black"
                                    disabled={readOnly}
                                >
                                    <option value="">Pilih kurir</option>
                                    {couriers.map(c => (
                                        <option key={c.courier} value={c.courier}>{c.courier.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4">
                                <label className="block mb-1 text-white">Service</label>
                                <select
                                    name="service"
                                    value={shipment.service}
                                    onChange={handleInputChange}
                                    className="w-full rounded px-3 py-2 text-black"
                                    disabled={!shipment.courier || readOnly}
                                >
                                    <option value="">Pilih service</option>
                                    {selectedCourier?.services?.map(s => (
                                        <option key={s.code} value={s.code}>{s.label} — Rp {(s.cost ?? 0).toLocaleString("id-ID")}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4">
                                <label className="block mb-1 text-white">Alamat Pengiriman</label>
                                <input
                                    className="w-full rounded px-3 py-2 text-black"
                                    value={shippingAddress}
                                    onChange={e => setShippingAddress(e.target.value)}
                                    disabled={readOnly}
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block mb-1 text-white">Metode Pembayaran</label>
                                <select
                                    className="w-full rounded px-3 py-2 text-black"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    disabled={prePaymentMethod === "cash" || readOnly}
                                >
                                    <option value="">Pilih metode</option>
                                    <option value="midtrans">Midtrans</option>
                                    <option value="cash">Bayar di tempat / tunai</option>
                                </select>
                            </div>
                        </div>

                        {!readOnly && (
                            <button
                                onClick={handleCheckout}
                                disabled={loadingCheckout}
                                className="mt-4 w-full bg-[#eeb626] text-white py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
                            >
                                {loadingCheckout ? "Memproses..." : "Bayar Sekarang"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
