import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Search, Tag } from 'lucide-react';

// Mock Data for Blog Posts
export const BLOG_POSTS = [
    {
        id: 1,
        slug: 'borsada-yatirim-yaparken-dikkat-edilmesi-gerekenler',
        title: 'Borsada Yatırım Yaparken Dikkat Edilmesi Gereken 5 Altın Kural',
        excerpt: 'Borsa İstanbul\'da başarılı bir yatırımcı olmak için bilmeniz gereken temel stratejiler ve risk yönetimi ipuçları.',
        content: '...', // Bu detay sayfasında kullanılacak
        category: 'Yatırım Stratejileri',
        author: 'Volkan Keleş',
        date: '26 Aralık 2025',
        image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop',
        readTime: '5 dk'
    },
    {
        id: 2,
        slug: 'temettu-yatirimciligi-nedir',
        title: 'Temettü Yatırımcılığı: Pasif Gelir Elde Etmenin Yolu',
        excerpt: 'Düzenli temettü ödeyen şirketlere yatırım yaparak finansal özgürlüğe nasıl ulaşabilirsiniz? İşte detaylar.',
        category: 'Temettü',
        author: 'Zeynep Yılmaz',
        date: '24 Aralık 2025',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop',
        readTime: '7 dk'
    },
    {
        id: 3,
        slug: 'halka-arz-furyasi-devam-edecek-mi',
        title: '2026 Yılında Halka Arz Furyası: Beklentiler ve Riskler',
        excerpt: 'Son dönemde artan halka arzların geleceği ne olacak? Yatırımcılar hangi sektörlere odaklanmalı?',
        category: 'Halka Arz',
        author: 'Ahmet Demir',
        date: '20 Aralık 2025',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
        readTime: '4 dk'
    },
    {
        id: 4,
        slug: 'teknik-analiz-mi-temel-analiz-mi',
        title: 'Teknik Analiz mi, Temel Analiz mi? Hangisi Daha Önemli?',
        excerpt: 'Hisse senedi seçerken grafiklere mi bakmalı yoksa bilançolara mı? İki analiz yönteminin karşılaştırması.',
        category: 'Analiz',
        author: 'Mehmet Yılmaz',
        date: '18 Aralık 2025',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        readTime: '6 dk'
    }
];

const Blog: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-4 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-500" /> Finans Blogu
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        Piyasa analizleri, yatırım stratejileri ve finans dünyasından en güncel haberler.
                    </p>
                </div>

                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Yazı ara..."
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 focus:bg-zinc-900 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Featured Post (First one) */}
            <div className="mb-16">
                <Link to={`/blog/${BLOG_POSTS[0].slug}`} className="group relative block overflow-hidden rounded-[2.5rem] border border-white/5">
                    <div className="absolute inset-0">
                        <img
                            src={BLOG_POSTS[0].image}
                            alt={BLOG_POSTS[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className="relative p-8 md:p-12 flex flex-col justify-end h-[500px]">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                                {BLOG_POSTS[0].category}
                            </span>
                            <span className="text-zinc-300 text-xs font-mono font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {BLOG_POSTS[0].date}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                            {BLOG_POSTS[0].title}
                        </h2>

                        <p className="text-zinc-300 text-lg max-w-3xl line-clamp-2 md:line-clamp-none mb-6">
                            {BLOG_POSTS[0].excerpt}
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white font-medium text-sm">{BLOG_POSTS[0].author}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                            <span className="text-zinc-400 text-sm">{BLOG_POSTS[0].readTime} okuma</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Posts Grid */}
            <h3 className="text-2xl font-bold text-white mb-6">Son Yazılar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.slice(1).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col glass-panel rounded-3xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                        <div className="h-56 relative overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-3">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime} okuma</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                {post.title}
                            </h3>

                            <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-zinc-400" />
                                    <span className="text-xs text-zinc-400">{post.author}</span>
                                </div>
                                <span className="flex items-center gap-1 text-sm font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                                    Oku <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default Blog;
