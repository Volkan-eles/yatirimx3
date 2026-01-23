
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, User, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { toast } from 'react-hot-toast';

interface StockDiscussionProps {
    symbol: string;
}

const StockDiscussion: React.FC<StockDiscussionProps> = ({ symbol }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        checkUser();
        fetchPosts();
    }, [symbol]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles (username, avatar_url),
          comments (count)
        `)
                .eq('category', symbol) // Filtering by Stock Symbol (using category column for efficiency)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        if (!user) {
            toast.error('Yorum yapmak için giriş yapmalısınız');
            navigate('/giris');
            return;
        }

        setSubmitting(true);
        try {
            // Ensure profile exists
            const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
            if (!profile) {
                await supabase.from('profiles').insert([{ id: user.id, email: user.email, username: user.email?.split('@')[0] }]);
            }

            const { error } = await supabase.from('posts').insert([
                {
                    title: `${symbol} Hakkında Yorum`, // Default title for simplicity in this view
                    content: newPostContent,
                    category: symbol,
                    author_id: user.id
                }
            ]);

            if (error) throw error;

            setNewPostContent('');
            toast.success('Yorumunuz paylaşıldı!');
            fetchPosts();
        } catch (error: any) {
            toast.error('Hata: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-white/5 mt-10" id="comments">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    {symbol} Yatırımcı Tartışmaları
                </h3>
                <span className="text-xs font-bold bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full border border-white/5">
                    {posts.length} Yorum
                </span>
            </div>

            {/* Input Area */}
            <div className="mb-8">
                {!user ? (
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 text-center">
                        <Lock className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                        <h4 className="text-zinc-300 font-bold mb-2">Tartışmaya Katılın</h4>
                        <p className="text-zinc-500 text-sm mb-4">Bu hisse hakkında yorum yapmak ve diğer yatırımcılarla fikir alışverişinde bulunmak için giriş yapmalısınız.</p>
                        <Link
                            to="/giris"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
                        >
                            Giriş Yap / Kayıt Ol
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handlePostSubmit} className="relative">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder={`${symbol} hakkında düşünceleriniz neler?`}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 pr-12 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all min-h-[100px] resize-none"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newPostContent.trim()}
                            className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                )}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="bg-[#09090b] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                            <div className="flex bg-transparent items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                                    {post.profiles?.avatar_url ? (
                                        <img src={post.profiles.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-zinc-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-zinc-300 text-sm">{post.profiles?.username || 'Anonim Yatırımcı'}</span>
                                        <span className="text-[10px] text-zinc-500">{formatDate(post.created_at)}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                                        {post.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockDiscussion;
