import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, User, Eye, ThumbsUp } from 'lucide-react';

interface ForumTopic {
    id: string;
    title: string;
    category: string;
    author_id: string;
    created_at: string;
    likes_count: number;
    views_count: number;
    profiles?: {
        username: string;
        avatar_url: string;
    };
}

interface ForumCardProps {
    topic: ForumTopic;
}

const ForumCard: React.FC<ForumCardProps> = ({ topic }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <Link
            to={`/forum/${topic.id}`}
            className="block group bg-[#18181b] border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-all duration-300 hover:border-blue-500/30"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wider">
                            {topic.category || 'Genel'}
                        </span>
                        <span className="text-zinc-500 text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(topic.created_at)}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                        {topic.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                                {topic.profiles?.avatar_url ? (
                                    <img src={topic.profiles.avatar_url} alt={topic.profiles.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-3 h-3 text-zinc-500" />
                                )}
                            </div>
                            <span className="font-medium text-zinc-300">
                                {topic.profiles?.username || 'Anonim'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-1 text-zinc-400">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-xs font-mono">{topic.views_count || 0}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center gap-1 text-zinc-400">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="text-xs font-mono">{topic.likes_count || 0}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center gap-1 text-zinc-400">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {/* <span className="text-xs font-mono">0</span> */}
                            {/* Comment count would require a join or separate count query */}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ForumCard;
