
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Heart, MessageSquare, Send, Share2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';

const ForumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTopicDetail();
            incrementViewCount();
        }
    }, [id]);

    const incrementViewCount = async () => {
        // Fire and forget view count increment
        await supabase.rpc('increment_view_count', { row_id: id });
    };

    const fetchTopicDetail = async () => {
        setLoading(true);
        try {
            // Fetch topic
            const { data: topicData, error: topicError } = await supabase
                .from('posts')
                .select(`*, profiles (username, avatar_url)`)
                .eq('id', id)
                .single();

            if (topicError) throw topicError;
            setTopic(topicData);

            // Fetch comments
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select(`*, profiles (username, avatar_url)`)
                .eq('post_id', id)
                .order('created_at', { ascending: true });

            if (commentsError) throw commentsError;
            setComments(commentsData || []);

        } catch (error: any) {
            console.error('Error fetching details:', error);
            toast.error('Konu yüklenirken hata oluştu.');
            navigate('/forum');
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Yorum yapmak için giriş yapmalısınız.');
                return;
            }

            const { error } = await supabase.from('comments').insert([
                {
                    post_id: id,
                    author_id: user.id,
                    content: commentContent
                }
            ]);

            if (error) throw error;

            setCommentContent('');
            toast.success('Yorum gönderildi!');
            fetchTopicDetail(); // Refresh to see new comment

        } catch (error: any) {
            toast.error('Hata: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 max-w-4xl">
            <button
                onClick={() => navigate('/forum')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Foruma Dön
            </button>

            {/* Main Topic Post */}
            <article className="bg-[#18181b] border border-white/5 rounded-xl overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-500/20 uppercase tracking-wider">
                            {topic.category || 'Genel'}
                        </span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(topic.created_at)}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                        {topic.title}
                    </h1>

                    <div className="prose prose-invert prose-blue max-w-none mb-8 text-zinc-300">
                        {topic.content.split('\n').map((line: string, i: number) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                                {topic.profiles?.avatar_url ? (
                                    <img src={topic.profiles.avatar_url} alt={topic.profiles.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-zinc-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-zinc-200">{topic.profiles?.username || 'Anonim'}</div>
                                <div className="text-xs text-zinc-500">Yazar</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* <button className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">{topic.likes_count}</span>
              </button> */}
                            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Paylaş</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Yorumlar ({comments.length})
            </h3>

            <div className="space-y-4 mb-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-[#18181b] border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                                    {comment.profiles?.avatar_url ? (
                                        <img src={comment.profiles.avatar_url} alt={comment.profiles.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-4 h-4 text-zinc-500" />
                                    )}
                                </div>
                                <span className="font-bold text-sm text-zinc-300">{comment.profiles?.username || 'Anonim'}</span>
                            </div>
                            <span className="text-xs text-zinc-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                            {comment.content}
                        </p>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-8 bg-[#18181b] rounded-xl border border-white/5 border-dashed text-zinc-500 text-sm">
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                    </div>
                )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-[#18181b] p-6 rounded-xl border border-white/5 sticky bottom-4 shadow-2xl">
                <h4 className="font-bold text-zinc-200 mb-4 text-sm">Yorum Yap</h4>
                <textarea
                    rows={3}
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
                    placeholder="Bu konu hakkında ne düşünüyorsun?"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm"
                    >
                        {submitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Gönder
                            </>
                        )}
                    </button>
                </div>
            </form>

            <Toaster position="bottom-right" theme="dark" />
        </div>
    );
};

export default ForumDetail;
