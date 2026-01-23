
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PortfolioService, PortfolioItem } from '../services/portfolioService';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, TrendingUp, TrendingDown, PieChart, Wallet, Loader2, ArrowRight } from 'lucide-react';

// Mock Price Fetcher - In real app, this would use the existing live data context or API
const getCurrentPrice = (code: string) => {
    // Simulating random price around 100-500 for demo if not found
    // Ideally import ALL_STOCKS or similar lookup
    return Math.random() * 400 + 100;
};

const Portfolio = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Dashboard Stats
    const [totalValue, setTotalValue] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    // Form
    const [formData, setFormData] = useState({ code: '', quantity: '', cost: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) navigate('/giris');
        if (user) fetchPortfolio();
    }, [user, authLoading]);

    const fetchPortfolio = async () => {
        try {
            const data = await PortfolioService.getPortfolio(user.id);

            // Enrich with current prices
            let totalV = 0;
            let totalC = 0;

            const enriched = data.map((item: any) => {
                const currentPrice = getCurrentPrice(item.code); // Replace with real fetch
                const value = item.quantity * currentPrice;
                const cost = item.quantity * item.average_cost;

                totalV += value;
                totalC += cost;

                return { ...item, current_price: currentPrice };
            });

            setItems(enriched);
            setTotalValue(totalV);
            setTotalCost(totalC);

        } catch (error) {
            console.error(error);
            toast.error('Portföy yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await PortfolioService.addAsset(
                user.id,
                formData.code,
                Number(formData.quantity),
                Number(formData.cost)
            );
            toast.success('Hisse eklendi');
            setModalOpen(false);
            setFormData({ code: '', quantity: '', cost: '' });
            fetchPortfolio();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu hisseyi portföyden silmek istediğinize emin misiniz?')) return;
        try {
            await PortfolioService.deleteAsset(id);
            toast.success('Silindi');
            fetchPortfolio();
        } catch (error) {
            toast.error('Silinemedi');
        }
    };

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

    const totalPL = totalValue - totalCost;
    const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-20">

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-blue-200 font-bold mb-1 flex items-center gap-2"><Wallet className="w-4 h-4" /> Toplam Varlık</div>
                        <div className="text-4xl font-black text-white">₺{totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</div>
                    </div>
                    <PieChart className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                </div>

                <div className="bg-[#09090b] rounded-3xl p-8 border border-white/5">
                    <div className="text-zinc-500 font-bold mb-1 uppercase text-xs tracking-wider">Toplam Kar / Zarar</div>
                    <div className={`text-3xl font-black flex items-center gap-2 ${totalPL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {totalPL >= 0 ? '+' : ''}₺{totalPL.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        <span className={`text-sm px-2 py-1 rounded-lg bg-white/5 ${totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            %{totalPLPercent.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="bg-[#09090b] rounded-3xl p-8 border border-white/5 flex items-center justify-center">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="w-full h-full min-h-[50px] border-2 border-dashed border-zinc-700 hover:border-blue-500 hover:bg-blue-500/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-blue-500 transition-all group"
                    >
                        <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Yeni Varlık Ekle</span>
                    </button>
                </div>
            </div>

            {/* Asset Table */}
            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-zinc-500 text-xs uppercase font-bold tracking-wider">
                                <th className="p-6">Hisse</th>
                                <th className="p-6">Adet</th>
                                <th className="p-6">Ort. Maliyet</th>
                                <th className="p-6">Anlık Fiyat (Tahmini)</th>
                                <th className="p-6">Değer</th>
                                <th className="p-6">Kar / Zarar</th>
                                <th className="p-6 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.length > 0 ? items.map((item) => {
                                const currentVal = item.quantity * (item.current_price || 0);
                                const costVal = item.quantity * item.average_cost;
                                const pl = currentVal - costVal;
                                const plP = (pl / costVal) * 100;

                                return (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6 font-black text-white">{item.code}</td>
                                        <td className="p-6 text-zinc-300 font-bold">{item.quantity}</td>
                                        <td className="p-6 text-zinc-300">₺{item.average_cost.toFixed(2)}</td>
                                        <td className="p-6 text-zinc-300">₺{item.current_price?.toFixed(2)}</td>
                                        <td className="p-6 font-bold text-white">₺{currentVal.toLocaleString()}</td>
                                        <td className="p-6">
                                            <div className={`flex items-center gap-1 font-bold ${pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {pl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                %{plP.toFixed(2)}
                                            </div>
                                            <div className={`text-xs ${pl >= 0 ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                                                ₺{pl.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-zinc-500">
                                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        Henüz portföyünüzde hisse yok. "Yeni Varlık Ekle" butonunu kullanarak başlayın.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Asset Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-black text-white mb-6">Portföye Ekle</h2>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Hisse Kodu</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    placeholder="Örn: THYAO"
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none uppercase"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Adet</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Maliyet (Adet Başı)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                        value={formData.cost}
                                        onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kaydet'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Toaster position="bottom-center" theme="dark" />
        </div>
    );
};

export default Portfolio;
