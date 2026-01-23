
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';

const CreateTopic = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Genel Sohbet'
    });

    const categories = ['Hisse Senetleri', 'Kripto Para', 'Altın & Döviz', 'Genel Sohbet', 'Yatırım Stratejileri'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Simple auth check workaround since we haven't built full login page yet
                // In reality, this should redirect to login. 
                // For now we might just allow guest posting or fail gracefully if strict RLS is on.
                // Assuming user might be anon or we need a quick login modal later.
                // Let's prompt for login if no user.
                toast.error('Konu açmak için giriş yapmalısınız.');
                // TODO: Redirect to login or show login modal
                // For now, let's assume if Supabase is setup, we might have an auto-anon session or need sign in.
                setLoading(false);
                return;
            }

            // Check for profile
            const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();

            if (!profile) {
                // Auto-create profile if missing (fallback)
                await supabase.from('profiles').insert([{ id: user.id, email: user.email, username: user.email?.split('@')[0] }]);
            }

            const { error } = await supabase.from('posts').insert([
                {
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                    author_id: user.id
                }
            ]);

            if (error) throw error;

            toast.success('Konu başarıyla oluşturuldu!');
            setTimeout(() => {
                navigate('/forum');
            }, 1500);

        } catch (error: any) {
            console.error('Error creating topic:', error);
            toast.error('Konu oluşturulurken bir hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Foruma Dön
            </button>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Yeni Konu Oluştur</h1>

                <form onSubmit={handleSubmit} className="bg-[#18181b] p-6 rounded-xl border border-white/5 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Başlık</label>
                        <input
                            type="text"
                            required
                            maxLength={100}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Konu başlığı (Örn: Sasa hissesi hakkında düşünceleriniz)"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Kategori</label>
                        <select
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">İçerik</label>
                        <textarea
                            required
                            rows={8}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Düşüncelerinizi paylaşın..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Konuyu Yayınla
                            </>
                        )}
                    </button>

                </form>
            </div>
            <Toaster position="bottom-right" theme="dark" />
        </div>
    );
};

export default CreateTopic;
