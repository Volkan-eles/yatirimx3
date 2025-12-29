import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';

import SEO from '../components/SEO';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = BLOG_POSTS.find(p => p.slug === slug);
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const [toc, setToc] = React.useState<{ id: string; text: string }[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [post]);

    // Handle Scroll Progress
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Generate TOC from content
    useEffect(() => {
        if (post?.content) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(post.content, 'text/html');
            const headings = Array.from(doc.querySelectorAll('h2')).map((h2, index) => ({
                id: `heading-${index}`,
                text: h2.textContent || ''
            }));
            setToc(headings);
        }
    }, [post]);

    // Helper to inject IDs into content
    const processedContent = React.useMemo(() => {
        if (!post?.content) return '';
        // Simple regex replace to add IDs to h2s - in a real app better parsing is needed
        let content = post.content;
        toc.forEach((item, index) => {
            content = content.replace(`<h2>${item.text}</h2>`, `<h2 id="heading-${index}">${item.text}</h2>`);
        });
        return content;
    }, [post, toc]);

    if (!post) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Yazı Bulunamadı</h2>
                <Link to="/blog" className="text-blue-500 hover:text-blue-400 font-bold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Bloga Dön
                </Link>
            </div>
        );
    }

    const shareUrl = `https://yatirimx.com/blog/${slug}`;
    const shareText = post.title;

    const handleShare = (platform: string) => {
        let url = '';
        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
        }
        window.open(url, '_blank');
    };

    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": {
            "@type": "ImageObject",
            "url": post.image?.startsWith('http') ? post.image : `https://yatirimx.com${post.image}`,
            "width": 1200,
            "height": 675
        },
        "author": {
            "@type": "Person",
            "name": post.author,
            "url": "https://yatirimx.com/yazarlar/uzman-ekip"
        },
        "publisher": {
            "@type": "Organization",
            "name": "YatırımX",
            "logo": {
                "@type": "ImageObject",
                "url": "https://yatirimx.com/logo.png",
                "width": 112,
                "height": 112
            }
        },
        "datePublished": "2024-12-26T09:00:00+03:00",
        "dateModified": "2024-12-29T12:00:00+03:00",
        "description": post.excerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://yatirimx.com/blog/${post.slug}/`
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Reading Progress Bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-50 transition-all duration-100"
                style={{ width: `${scrollProgress * 100}%` }}
            />

            <SEO
                title={`${post.title} | YatırımX Blog`}
                description={post.excerpt}
                canonicalUrl={`https://yatirimx.com/blog/${post.slug}/`}
                schema={blogSchema}
                keywords={(post as any).seoKeywords?.join(', ')}
            />

            {/* Navigation */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 font-medium text-sm">
                <ArrowLeft className="w-4 h-4" /> Tüm Yazılar
            </Link>

            {/* Header */}
            <header className="mb-10 text-center">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    {post.category}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                            <User className="w-4 h-4 text-zinc-300" />
                        </div>
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} okuma</span>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="rounded-[2rem] overflow-hidden border border-white/5 mb-12 shadow-2xl shadow-black/50 aspect-video relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Share Sidebar (Desktop) */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-32 space-y-4">
                        <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleShare('linkedin')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all">
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Article Body */}
                <article className="lg:col-span-11 prose prose-invert prose-lg max-w-none">

                    {/* Table of Contents */}
                    {toc.length > 0 && (
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-8 not-prose">
                            <h3 className="text-lg font-bold text-white mb-4">İçindekiler</h3>
                            <ul className="space-y-2">
                                {toc.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="text-zinc-400 hover:text-blue-400 transition-colors text-sm block"
                                        >
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="text-xl text-zinc-300 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 italic">
                        {post.excerpt}
                    </p>

                    {/* Dynamic Content Rendering */}
                    <div
                        className="text-zinc-300 space-y-6 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: processedContent }}
                    />

                    {/* Conditional Table Rendering */}
                    {(post as any).tableData && (
                        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-400 uppercase bg-white/5 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Şirket Ünvanı (Hisse Kodu)</th>

                                        {/* Dynamic Headers based on Table Type */}
                                        {(post as any).tableType === 'dividend' ? (
                                            <>
                                                <th className="px-6 py-4 text-center">Brüt / Net Temettü</th>
                                                <th className="px-6 py-4 text-center">Ödeme Tarihi</th>
                                                <th className="px-6 py-4 text-center">Temettü Verimi</th>
                                            </>
                                        ) : (post as any).tableType === 'lot_count' ? (
                                            <>
                                                <th className="px-6 py-4 text-center">Lot Sayısı</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-4 text-center">Bedelsiz Oranı</th>
                                                <th className="px-6 py-4 text-center">Karar Tarihi</th>
                                                <th className="px-6 py-4 text-center">SPK Başvuru</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(post as any).tableData.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {row.name} <span className="text-blue-400 font-bold">({row.code})</span>
                                            </td>

                                            {/* Dynamic Rows based on Table Type */}
                                            {(post as any).tableType === 'dividend' ? (
                                                <>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-bold">{row.gross}</span>
                                                            <span className="text-xs text-zinc-500">{row.net} (Net)</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-zinc-400">{row.date}</td>
                                                    <td className="px-6 py-4 text-center text-emerald-400 font-bold">{row.yield}</td>
                                                </>
                                            ) : (post as any).tableType === 'lot_count' ? (
                                                <td className="px-6 py-4 text-center font-mono font-bold text-white">
                                                    {row.lot}
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 text-center text-emerald-400 font-bold">{row.ratio}</td>
                                                    <td className="px-6 py-4 text-center text-zinc-400">{row.decisionDate}</td>
                                                    <td className="px-6 py-4 text-center text-zinc-400">{row.appDate}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* SEO Keywords */}
                    {(post as any).seoKeywords && (
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">İlgili Aramalar</h4>
                            <div className="flex flex-wrap gap-2">
                                {(post as any).seoKeywords.map((keyword: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs text-zinc-400 hover:text-white hover:border-blue-500/30 transition-colors cursor-default">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>

            {/* Footer / CTA */}
            <div className="mt-20 pt-10 border-t border-white/5 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Yatırım Dünyasını Keşfetmeye Devam Edin</h3>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                    En güncel analizler ve piyasa verileri için YatırımX'i takipte kalın.
                </p>
                <Link to="/piyasa" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all hover:scale-105">
                    Canlı Borsayı İzle <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

        </div>
    );
};

export default BlogDetail;
