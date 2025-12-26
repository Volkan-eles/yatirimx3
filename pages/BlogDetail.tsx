import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { BLOG_POSTS } from './Blog';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = BLOG_POSTS.find(p => p.slug === slug);

    useEffect(() => {
        // Update Document Title
        if (post) {
            document.title = `${post.title} | YatırımX Blog`;
        }
        // Scroll to top
        window.scrollTo(0, 0);
    }, [post]);

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

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

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
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all">
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Article Body */}
                <article className="lg:col-span-11 prose prose-invert prose-lg max-w-none">
                    <p className="text-xl text-zinc-300 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 italic">
                        {post.excerpt}
                    </p>

                    <div className="text-zinc-300 space-y-6 leading-relaxed">
                        <p>
                            Borsa İstanbul'da yatırım yapmak, doğru stratejilerle finansal geleceğinizi şekillendirmenin en etkili yollarından biridir. Ancak, piyasaların volatilitesi ve karmaşık yapısı, hazırlıksız yatırımcılar için riskler barındırır. İşte başarılı bir borsa yatırımcısı olmak için dikkat etmeniz gereken temel prensipler.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Uzun Vadeli Düşünün</h2>
                        <p>
                            Borsa bir oyun yeri değil, şirketlere ortak olma platformudur. Warren Buffett'ın da dediği gibi: <span className="text-white font-semibold">"Hisse senedi piyasası, sabırsızlardan sabırlılara para aktaran bir araçtır."</span> Kısa vadeli fiyat hareketlerinden ziyade, şirketin uzun vadeli büyüme potansiyeline odaklanın.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Çeşitlendirme (Sepet) Yapın</h2>
                        <p>
                            "Tüm yumurtaları aynı sepete koymayın" sözü borsada hayati önem taşır. Portföyünüzü farklı sektörlere ve farklı risk gruplarına dağıtarak, olası kayıpları minimize edebilirsiniz. Enerji, bankacılık, sanayi ve teknoloji gibi farklı sektörlerden dengeli bir portföy oluşturun.
                        </p>

                        <div className="my-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                            <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                💡 Profesyonel İpucu
                            </h4>
                            <p className="text-sm m-0">
                                Portföyünüzde en az 5-8 arası farklı hisse bulundurmak, sektörel risklerden korunmanıza yardımcı olur. Tek bir hissenin portföydeki ağırlığı %20'yi geçmemelidir.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Şirketi Tanıyın</h2>
                        <p>
                            Hissesini aldığınız şirketin ne iş yaptığını, rakiplerini, karlılık durumunu ve gelecek planlarını detaylıca araştırın. KAP (Kamuyu Aydınlatma Platformu) bildirimlerini takip edin ve faaliyet raporlarını okuyun. Bilmediğiniz bir işe yatırım yapmak, karanlıkta yürümeye benzer.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Duygularınızı Kontrol Edin</h2>
                        <p>
                            Piyasa coşkuluyken alım yapma (FOMO) veya piyasa düşerken panikle satma (Panic Selling) dürtülerinize engel olun. Yatırım kararlarınızı duygularınızla değil, mantığınızla ve verilerle verin.
                        </p>
                    </div>
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
