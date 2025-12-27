import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Shield, Zap, BarChart3, Globe } from 'lucide-react';
import SEO from '../components/SEO';

const Hakkimizda: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <SEO
                title="Hakkımızda - Borsa ve Finans Analiz Platformu | YatırımX"
                description="YatırımX, Borsa İstanbul (BIST) hisse senetleri için canlı veriler, teknik analizler, hedef fiyatlar ve temettü bilgileri sunan kapsamlı finans platformudur."
                canonicalUrl="https://yatirimx.com/hakkimizda/"
                keywords="hakkımızda, yatırımx kimdir, borsa analiz platformu, finansal veriler"
            />

            {/* Hero Section */}
            <div className="text-center mb-16 pt-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    YatırımX Hakkında
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                    Türkiye'nin en kapsamlı borsa ve hisse senedi analiz platformu
                </p>
            </div>

            {/* Mission Section */}
            <div className="glass-panel p-8 rounded-3xl mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Misyonumuz</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-4">
                    YatırımX, Türkiye'deki bireysel yatırımcılara BIST (Borsa İstanbul) hisse senetleri hakkında
                    güncel, doğru ve kapsamlı bilgi sağlamayı amaçlayan bir finans platformudur.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    Amacımız, yatırımcıların bilinçli kararlar almasına yardımcı olmak için gerçek zamanlı veriler,
                    teknik analizler ve uzman görüşlerini tek bir platformda sunmaktır.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Gerçek Zamanlı Veriler</h3>
                    <p className="text-zinc-500 text-sm">
                        507 BIST hissesi için Yahoo Finance API üzerinden her 30 dakikada güncellenen canlı veriler.
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Güvenilir Analizler</h3>
                    <p className="text-zinc-500 text-sm">
                        Profesyonel finansal metrikler, teknik göstergeler ve analist hedef fiyatları.
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
                        <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Hızlı ve Kolay</h3>
                    <p className="text-zinc-500 text-sm">
                        Kullanıcı dostu arayüz ile hisse senedi bilgilerine anında erişim.
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <div className="w-10 h-10 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center mb-4">
                        <Globe className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Kapsamlı Kapsam</h3>
                    <p className="text-zinc-500 text-sm">
                        50+ veri noktası ile her hisse için detaylı finansal bilgiler ve analizler.
                    </p>
                </div>
            </div>

            {/* What We Offer */}
            <div className="glass-panel p-8 rounded-3xl mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Neler Sunuyoruz?</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-400 text-xs">✓</span>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-1">Canlı Hisse Fiyatları</h4>
                            <p className="text-zinc-500 text-sm">507 BIST hissesi için anlık fiyat, değişim ve hacim bilgileri</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-400 text-xs">✓</span>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-1">Teknik Analizler</h4>
                            <p className="text-zinc-500 text-sm">50/200 günlük hareketli ortalamalar, RSI, MACD ve daha fazlası</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-400 text-xs">✓</span>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-1">Finansal Metrikler</h4>
                            <p className="text-zinc-500 text-sm">F/K, PD/DD, ROE, ROA, kar marjları ve borç oranları</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-400 text-xs">✓</span>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-1">Analist Hedef Fiyatları</h4>
                            <p className="text-zinc-500 text-sm">Profesyonel analistlerin hedef fiyat tahminleri ve tavsiyeleri</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-400 text-xs">✓</span>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-1">Tarihsel Grafikler</h4>
                            <p className="text-zinc-500 text-sm">30 günlük gerçek fiyat hareketleri ve interaktif grafikler</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Önemli Uyarı
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    YatırımX platformunda sunulan bilgiler yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi
                    niteliği taşımamaktadır. Yatırım kararlarınızı vermeden önce profesyonel bir finansal danışmana
                    danışmanız önerilir. Geçmiş performans, gelecekteki sonuçların garantisi değildir.
                </p>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                    <TrendingUp className="w-5 h-5" />
                    Hisse Senetlerini İncele
                </Link>
            </div>

        </div>
    );
};

export default Hakkimizda;
