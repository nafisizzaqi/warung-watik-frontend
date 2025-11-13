import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function OrderDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(false);

    // Shipment
    const [shipment, setShipment] = useState({ courier: "", service: "" });

    // Opsi kurir & service
    const [couriers, setCouriers] = useState([]);

    useEffect(() => {
        if (order?.id) {
            api.get(`/customer/orders/${order.id}`)
                .then(res => setOrder(res.data.data))
                .catch(err => console.error("Gagal memuat order:", err));
        }

        // Fetch kurir & service
        api.get("/customer/shipments/couriers")
            .then(res => setCouriers(res.data))
            .catch(err => console.error("Gagal memuat opsi kurir:", err));
    }, [order?.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShipment(prev => ({ ...prev, [name]: value }));

        // Reset service jika kurir berubah
        if (name === "courier") setShipment(prev => ({ ...prev, service: "" }));
    };

    const handlePayWithMidtrans = async () => {
        if (!order?.id) return;
        if (!shipment.courier || !shipment.service) {
            alert("Mohon isi data pengiriman terlebih dahulu!");
            return;
        }

        try {
            setLoading(true);

            // Simpan shipment dulu
            await api.post(`/customer/orders/${order.id}/shipment`, shipment);

            // Generate Snap Token
            const res = await api.post(`/customer/orders/${order.id}/midtrans/snap-token`);
            const snapToken = res.data.snap_token;

            window.snap.pay(snapToken, {
                onSuccess: async (result) => {
                    alert("Pembayaran berhasil!");
                    const orderRes = await api.get(`/customer/orders/${order.id}`);
                    setOrder(orderRes.data.data);
                    navigate("/order-success", { state: { order: orderRes.data.data } });
                },
                onPending: (result) => alert("Menunggu konfirmasi pembayaran..."),
                onError: (result) => alert("Terjadi kesalahan pembayaran."),
                onClose: () => console.log("popup ditutup"),
            });
        } catch (err) {
            console.error("Gagal memproses pembayaran:", err);
            alert("Gagal memproses pembayaran");
        } finally {
            setLoading(false);
        }
    };

    if (!order) return <div>Memuat...</div>;
    const firstItem = order.items?.[0] || [];
    const selectedCourier = couriers.find(c => c.courier === shipment.courier);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#730302] text-white p-6">
            <div className="bg-gray-50/10 backdrop-blur-md rounded-3xl w-full max-w-6xl text-center shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-[#eeb626] px-4 py-3">
                    <button onClick={() => navigate(-1)} className="text-white bg-[#eeb626] hover:text-black transition-colors">
                        ←
                    </button>
                    <h2 className="text-xl font-bold text-white flex-1 text-center">Detail Pesanan</h2>
                    <div className="w-8"></div>
                </div>

                <div className="flex">
                    {firstItem.product && (
                        <div className="p-6 text-left">
                            <h3 className="text-xl font-bold mb-4">Detail Produk</h3>
                            <img
                                src={`http://localhost:8000/storage/${firstItem.product.image}`}
                                alt={firstItem.product.name || "Produk"}
                                className="w-40 h-40 object-cover rounded-lg mb-4"
                            />
                            <p>Nama: {firstItem.product.name}</p>
                            <p>Kategori: {firstItem.product.category}</p>
                            <p>Deskripsi: {firstItem.product.description}</p>
                            <p>Jumlah: {firstItem.quantity || 0}</p>
                            <p>Subtotal: Rp {parseFloat(firstItem.subtotal || 0).toLocaleString("id-ID")}</p>
                        </div>
                    )}

                    <div className="p-6 text-left">
                        <p>Nomor Antrean: <b>#{order.queue_number}</b></p>
                        <p>Total: Rp {parseFloat(order.grand_total || 0).toLocaleString("id-ID")}</p>
                        <p>Metode Pembayaran: {order.payment_method}</p>

                        {/* Form Shipment */}
                        <div className="mb-4">
                            <label className="block mb-1">Kurir</label>
                            <select
                                name="courier"
                                value={shipment.courier}
                                onChange={handleInputChange}
                                className="w-full rounded px-3 py-2 text-black"
                            >
                                <option value="">Pilih kurir</option>
                                {couriers.map(c => (
                                    <option key={c.courier} value={c.courier}>{c.courier.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Service</label>
                            <select
                                name="service"
                                value={shipment.service}
                                onChange={handleInputChange}
                                className="w-full rounded px-3 py-2 text-black"
                                disabled={!shipment.courier}
                            >
                                <option value="">Pilih service</option>
                                {selectedCourier?.services?.map(s => (
                                    <option key={s?.code} value={s?.code}>
                                        {s?.label} — Rp {(s?.cost ?? 0).toLocaleString("id-ID")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {order.payment_method === "midtrans" && (
                    <div className="p-6">
                        <button
                            onClick={handlePayWithMidtrans}
                            disabled={loading}
                            className="w-full bg-[#eeb626] text-white py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
                        >
                            {loading ? "Memproses..." : "Bayar Sekarang"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
