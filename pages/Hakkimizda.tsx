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
                    <h2 className="text-2xl font-bold text-white">Hakkımda</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-4">
                    Merhaba, ben Volkan. Lefke Avrupa Üniversitesi (LAÜ) Hukuk Fakültesi öğrencisiyim. Yatırım dünyasına ilgi duyan herkes için sade, güvenilir ve erişilebilir bir kaynak oluşturmak amacıyla yatirimx.com’u hayata geçirdim.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                    Bu siteyi 2024 yılının Ekim ayında faaliyete geçirdim. Amacım, yatırımcıların bilinçli kararlar almasına yardımcı olmaktır.
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

            {/* Company Timeline */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Yolculuğumuz</h2>
                    <p className="text-zinc-400">YatırımX'in kuruluşundan bugüne uzanan başarı hikayesi.</p>
                </div>

                <div className="relative border-l border-white/10 ml-4 md:ml-1/2 md:-translate-x-[0.5px] space-y-12">
                    {/* 2023 */}
                    <div className="relative md:flex items-center justify-between group">
                        <div className="absolute left-[-5px] top-6 md:left-1/2 md:-ml-[5px] w-[11px] h-[11px] rounded-full bg-zinc-800 border-2 border-blue-500 z-10 group-hover:bg-blue-500 transition-colors"></div>
                        <div className="pl-8 md:pl-0 md:w-[45%] md:text-right">
                            <span className="text-blue-500 font-bold font-mono text-sm">2023 4. Çeyrek</span>
                            <h3 className="text-xl font-bold text-white mt-1 mb-2">Fikir ve Başlangıç</h3>
                            <p className="text-zinc-400 text-sm">Yatırımcıların doğru veriye ulaşma sorununu çözmek için ilk kod satırları yazıldı ve proje başladı.</p>
                        </div>
                        <div className="hidden md:block md:w-[45%]"></div>
                    </div>

                    {/* 2024 Q1 */}
                    <div className="relative md:flex items-center justify-between group">
                        <div className="absolute left-[-5px] top-6 md:left-1/2 md:-ml-[5px] w-[11px] h-[11px] rounded-full bg-zinc-800 border-2 border-purple-500 z-10 group-hover:bg-purple-500 transition-colors"></div>
                        <div className="hidden md:block md:w-[45%]"></div>
                        <div className="pl-8 md:pl-0 md:w-[45%]">
                            <span className="text-purple-500 font-bold font-mono text-sm">2024 1. Çeyrek</span>
                            <h3 className="text-xl font-bold text-white mt-1 mb-2">Beta Lansmanı</h3>
                            <p className="text-zinc-400 text-sm">İlk kapalı beta sürümü 500+ seçkin yatırımcı ile paylaşıldı ve geri bildirimler toplandı.</p>
                        </div>
                    </div>

                    {/* 2024 Q3 */}
                    <div className="relative md:flex items-center justify-between group">
                        <div className="absolute left-[-5px] top-6 md:left-1/2 md:-ml-[5px] w-[11px] h-[11px] rounded-full bg-zinc-800 border-2 border-emerald-500 z-10 group-hover:bg-emerald-500 transition-colors"></div>
                        <div className="pl-8 md:pl-0 md:w-[45%] md:text-right">
                            <span className="text-emerald-500 font-bold font-mono text-sm">2024 3. Çeyrek</span>
                            <h3 className="text-xl font-bold text-white mt-1 mb-2">Yapay Zeka Entegrasyonu</h3>
                            <p className="text-zinc-400 text-sm">Hisse analizlerine AI tabanlı öngörüler ve "Akıllı Skor" sistemi entegre edildi.</p>
                        </div>
                        <div className="hidden md:block md:w-[45%]"></div>
                    </div>

                    {/* 2025 (Future) */}
                    <div className="relative md:flex items-center justify-between group">
                        <div className="absolute left-[-5px] top-6 md:left-1/2 md:-ml-[5px] w-[11px] h-[11px] rounded-full bg-zinc-800 border-2 border-white/20 z-10 group-hover:border-white transition-colors"></div>
                        <div className="hidden md:block md:w-[45%]"></div>
                        <div className="pl-8 md:pl-0 md:w-[45%]">
                            <span className="text-zinc-500 font-bold font-mono text-sm">2025 Hedefi</span>
                            <h3 className="text-white font-bold mt-1 mb-2">Global Pazarlar & Mobil App</h3>
                            <p className="text-zinc-400 text-sm">ABD borsaları (NASDAQ/NYSE) verilerinin eklenmesi ve yerel mobil uygulama lansmanı.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Kurucu</h2>
                </div>

                <div className="flex justify-center">
                    {/* Founder */}
                    <div className="glass-panel p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300 max-w-sm w-full">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 p-1">
                            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden">
                                <Users className="w-10 h-10 text-white/20" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Volkan Eles</h3>
                        <p className="text-blue-400 text-sm font-medium mb-4">Kurucu</p>
                    </div>
                </div>
            </div>

            {/* What We Offer (Existing, kept but moved down or integrated) */}
            <div className="glass-panel p-8 rounded-3xl mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Platform Özellikleri</h2>
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
