import React, { useContext, useState, useEffect } from "react";
import { Car, FileText } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import CarForm from "../components/CarForm";
import CarList from "../components/CarList";

export default function SellerDashboard() {
  const { user, api } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("inventory");
  const [refresh, setRefresh] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState({ totalRevenue: 0, totalSales: 0, weeklyData: [] });
  const [loading, setLoading] = useState(false);

  // Edit Car State
  const [editingCar, setEditingCar] = useState(null);

  // Sales Order Modal State
  const [selectedCar, setSelectedCar] = useState(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  // Document Metadata State
  const [showDocModal, setShowDocModal] = useState(null); // orderId
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");

  useEffect(() => {
    if (activeTab === "leads") fetchInquiries();
    if (activeTab === "sales") fetchOrders();
    if (activeTab === "reports") fetchReports();
  }, [activeTab, refresh]);

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      const order = orders.find(o => o.id === showDocModal);
      const newDocs = [...(order.documents || []), { name: docName, url: docUrl, uploadedAt: new Date() }];
      await api.patch(`/seller/orders/${showDocModal}`, { documents: newDocs });
      alert("Document added successfully!");
      setShowDocModal(null);
      setDocName("");
      setDocUrl("");
      setRefresh(r => r + 1);
    } catch (err) { alert("Failed to add document"); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/seller/inventory/${id}/status`, { status });
      setRefresh(r => r + 1);
    } catch (err) { alert("Status update failed"); }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsProcessingSale(true);
    try {
      await api.post("/seller/orders", {
        carId: selectedCar.id,
        buyerId: Number(buyerId) || 1, // Defaulting for mock
        finalPrice: Number(sellingPrice)
      });
      // Move to completed automatically if seller marks as sold
      // Actually we'll just draft it or complete it? 
      // The requirement says "Create sales orders", and "Mark cars as sold".
      // I'll make it create a completed order and update car status.
      // Wait, there's a separate "Finalize Sale" in the UI. 
      // I'll adjust to create a draft order.
      alert("Sales order created in draft. Go to Sales tab to finalize!");
      setSelectedCar(null);
      setRefresh(r => r + 1);
    } catch (err) { alert("Failed to create order"); }
    setIsProcessingSale(false);
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/inquiries");
      setInquiries(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/orders");
      setOrders(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/reports");
      setReports(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUpdateInquiry = async (id, status) => {
    try {
      await api.patch(`/seller/inquiries/${id}`, { status });
      setRefresh(r => r + 1);
    } catch (err) { alert("Update failed"); }
  };

  const handleUpdateOrder = async (id, status) => {
    try {
      await api.patch(`/seller/orders/${id}`, { status });
      setRefresh(r => r + 1);
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div className="container py-12 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-indigo-600 border border-white/50">
            <Car size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Seller <span className="text-indigo-600">Portal</span></h2>
            <p className="text-slate-500 mt-1 italic">Professional Marketplace Management</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {["inventory", "leads", "sales", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                ? "bg-white text-indigo-600 shadow-md scale-105"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-panel p-8 sticky top-32">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Create New Listing</h3>
              <CarForm onCreated={() => setRefresh((r) => r + 1)} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="glass-panel p-0 overflow-hidden">
              <div className="p-8 border-b border-slate-100/50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Active Inventory</h3>
              </div>
              <div className="p-4">
                <CarList
                  sellerId={user?.id}
                  refreshTrigger={refresh}
                  onStatusUpdate={handleStatusUpdate}
                  onSell={(car) => { setSelectedCar(car); setSellingPrice(car.price); }}
                  onEdit={(car) => setEditingCar(car)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CAR MODAL */}
      {editingCar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel p-10 max-w-2xl w-full animate-scale-up shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Edit Listing</h3>
            <p className="text-slate-500 text-sm mb-8 italic">Update details for {editingCar.title}</p>
            <CarForm
              existingCar={editingCar}
              onCreated={() => { setEditingCar(null); setRefresh(r => r + 1); }}
              onCancel={() => setEditingCar(null)}
            />
          </div>
        </div>
      )}

      {/* SALES ORDER MODAL */}
      {selectedCar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel p-10 max-w-md w-full animate-scale-up shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Process Car Sale</h3>
            <p className="text-slate-500 text-sm mb-8 italic">Create a sales order for {selectedCar.title}</p>
            <form onSubmit={handleCreateOrder} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Agreed Selling Price ($)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Buyer ID Reference</label>
                <input
                  type="number"
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setSelectedCar(null)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                <button type="submit" disabled={isProcessingSale} className="flex-[2] btn-premium">
                  {isProcessingSale ? "Processing..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-panel p-10 max-w-md w-full animate-scale-up shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Add Document</h3>
            <p className="text-slate-500 text-sm mb-8 italic">Attach registration or sales records.</p>
            <form onSubmit={handleAddDocument} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Document Name</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Bill of Sale"
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Document URL/Path</label>
                <input
                  type="text"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="e.g. /docs/rec-01.pdf"
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowDocModal(null)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                <button type="submit" className="flex-[2] btn-premium">Add Metadata</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {activeTab === "leads" && (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {inquiries.map(i => (
                <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900">User #{i.userId}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black">Ref: Car #{i.carId}</div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600 max-w-md">{i.message}</p>
                    {i.requestedDate && <div className="mt-2 text-[10px] font-bold text-indigo-600 uppercase">Requested: {new Date(i.requestedDate).toLocaleDateString()}</div>}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${i.type === 'test_drive' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      {i.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right space-x-3">
                    {i.status === 'open' ? (
                      <button onClick={() => handleUpdateInquiry(i.id, 'responded')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">Respond</button>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{i.status}</span>
                    )}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && !loading && (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">No customer inquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "sales" && (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900">Order #{o.id}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black">Car #{o.carId} • {new Date(o.createdAt).toLocaleDateString()}</div>
                    {o.documents?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {o.documents.map((d, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                            <FileText size={10} /> {d.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black text-indigo-600">${o.finalPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${o.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      o.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right space-x-3">
                    {o.status === 'draft' && (
                      <button onClick={() => handleUpdateOrder(o.id, 'completed')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800">Finalize Sale</button>
                    )}
                    <button onClick={() => setShowDocModal(o.id)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">Add Doc</button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">No sales processed yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Monthly Revenue</span>
              <span className="text-4xl font-black text-indigo-600">${reports.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="glass-panel p-8 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cars Sold This Month</span>
              <span className="text-4xl font-black text-slate-900">{reports.totalSales}</span>
            </div>
          </div>
          <div className="glass-panel p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sales Distribution</h3>
            <div className="h-64 flex items-end justify-around gap-4">
              {(reports.weeklyData || [30, 45, 25, 60, 80, 55, 90]).map((item, i) => {
                const h = typeof item === 'number' ? item : (item.sales * 40 || 10);
                return (
                  <div key={i} className="flex-1 max-w-[40px] bg-indigo-600/10 rounded-t-xl relative group transition-all hover:bg-indigo-600/30" style={{ height: `${h}%` }}>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">{item.week || `W${i + 1}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
