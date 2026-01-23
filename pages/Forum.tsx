
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MessageSquare, TrendingUp, Filter } from 'lucide-react';
import { supabase } from '../utils/supabase';
import ForumCard from '../components/ForumCard';
import { Toaster, toast } from 'react-hot-toast';

const Forum = () => {
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');

    const categories = ['Tümü', 'Hisse Senetleri', 'Kripto Para', 'Altın & Döviz', 'Genel Sohbet', 'Yatırım Stratejileri'];

    useEffect(() => {
        fetchTopics();
    }, [selectedCategory]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select(`
          *,
          profiles (username, avatar_url)
        `)
                .order('created_at', { ascending: false });

            if (selectedCategory !== 'Tümü') {
                query = query.eq('category', selectedCategory);
            }

            const { data, error } = await query;

            if (error) throw error;
            setTopics(data || []);
        } catch (error) {
            console.error('Error fetching topics:', error);
            // Don't show toast on initial load if empty, might be just empty DB
        } finally {
            setLoading(false);
        }
    };

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative border-b border-white/5 bg-[#09090b]">
                <div className="absolute inset-0 bg-blue-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 py-12 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                            Yatırımcı Forumu
                        </h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Piyasalar hakkında fikir alışverişi yapın, analizlerinizi paylaşın ve diğer yatırımcılarla tartışın.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <Link
                            to="/forum/yeni"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Yeni Konu Aç
                        </Link>

                        <div className="bg-[#18181b] rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 font-bold text-zinc-100 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-zinc-500" />
                                Kategoriler
                            </div>
                            <div className="p-2 space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Search Bar */}
                        <div className="bg-[#18181b] p-2 rounded-xl border border-white/5 flex items-center gap-3 focus-within:border-blue-500/30 transition-colors">
                            <Search className="w-5 h-5 text-zinc-500 ml-2" />
                            <input
                                type="text"
                                placeholder="Konularda ara..."
                                className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-500 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20">
                                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-zinc-500">Konular yükleniyor...</p>
                                </div>
                            ) : filteredTopics.length > 0 ? (
                                filteredTopics.map((topic) => (
                                    <ForumCard key={topic.id} topic={topic} />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-[#18181b] rounded-xl border border-white/5 border-dashed">
                                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-zinc-300 mb-2">Henüz konu yok</h3>
                                    <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                                        Bu kategoride henüz bir tartışma başlatılmamış. İlk konuyu sen aç!
                                    </p>
                                    <Link
                                        to="/forum/yeni"
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Konu Başlat
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" theme="dark" />
        </div>
    );
};

export default Forum;
