import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Search, Tag } from 'lucide-react';
import { DIVIDEND_DATA } from '../data/dividendData';

import { BlogFilter } from '../components/BlogFilter';
import { BLOG_POSTS } from '../data/blogPosts';

import SEO from '../components/SEO';

const Blog: React.FC = () => {
    const [activeCategory, setActiveCategory] = React.useState('Tümü');
    const [searchQuery, setSearchQuery] = React.useState('');

    // Extract unique categories
    const categories = Array.from(new Set(BLOG_POSTS.map(post => post.category)));

    // Filter posts
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = activeCategory === 'Tümü' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            <SEO
                title="Finans Blogu - Piyasa Analizleri ve Yatırım Stratejileri | YatırımX"
                description="Borsa İstanbul piyasa analizleri, 2026 yatırım stratejileri, bedelsiz sermaye artırımı takvimi, temettü tahminleri ve eğitici finans içerikleri."
                canonicalUrl="https://yatirimx.com/blog/"
                keywords="borsa blog, finans analizleri, yatırım stratejileri, hisse senedi yorumları, borsa eğitim"
            />

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Bar */}
            <BlogFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            {/* Featured Post (First of filtered results if available, else first overall) */}
            {filteredPosts.length > 0 && (
                <div className="mb-16">
                    <Link to={`/blog/${filteredPosts[0].slug}`} className="group relative block overflow-hidden rounded-[2.5rem] border border-white/5">
                        <div className="absolute inset-0">
                            <img
                                src={filteredPosts[0].image}
                                alt={filteredPosts[0].title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                        </div>

                        <div className="relative p-8 md:p-12 flex flex-col justify-end h-[500px]">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                                    {filteredPosts[0].category}
                                </span>
                                <span className="text-zinc-300 text-xs font-mono font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {filteredPosts[0].date}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                                {filteredPosts[0].title}
                            </h2>

                            <p className="text-zinc-300 text-lg max-w-3xl line-clamp-2 md:line-clamp-none mb-6">
                                {filteredPosts[0].excerpt}
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-white font-medium text-sm">{filteredPosts[0].author}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                                <span className="text-zinc-400 text-sm">{filteredPosts[0].readTime} okuma</span>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Recent Posts Grid (Skipping the first one as it's featured) */}
            {filteredPosts.length > 1 ? (
                <>
                    <h3 className="text-2xl font-bold text-white mb-6">Diğer Yazılar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.slice(1).map((post) => (
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
                </>
            ) : filteredPosts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-zinc-500">Aradığınız kriterlere uygun yazı bulunamadı.</p>
                </div>
            )}

        </div>
    );
};

export default Blog;
