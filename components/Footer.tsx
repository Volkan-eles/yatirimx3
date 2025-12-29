import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Shield, FileText, ArrowRight, Lock, Activity, Globe, Send } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black/80 border-t border-white/5 mt-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand & Newsletter Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <Link to="/" className="flex items-center gap-3 mb-4 group">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-300">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl leading-none tracking-tight text-white font-display">YatirimX</span>
                                    <span className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase mt-0.5">Terminal</span>
                                </div>
                            </Link>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                Finansal özgürlük yolculuğunuzda size rehberlik eden yeni nesil analiz platformu.
                                Yapay zeka destekli verilerle piyasanın bir adım önünde olun.
                            </p>
                        </div>

                        {/* Newsletter */}
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-400" /> Bültene Abone Olun
                            </h3>
                            <p className="text-zinc-500 text-xs mb-4">Piyasa analizleri ve önemli gelişmeler her sabah e-postanızda.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-600"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">

                        {/* Column 1 */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" /> Platform
                            </h3>
                            <ul className="space-y-3">
                                <li><Link to="/hedef-fiyat" className="text-zinc-400 hover:text-white text-sm transition-colors">Hedef Fiyatlar</Link></li>
                                <li><Link to="/temettu-takvimi-2026" className="text-zinc-400 hover:text-white text-sm transition-colors">Temettü Takvimi</Link></li>
                                <li><Link to="/halka-arz" className="text-zinc-400 hover:text-white text-sm transition-colors">Halka Arzlar</Link></li>
                                <li><Link to="/araci-kurumlar" className="text-zinc-400 hover:text-white text-sm transition-colors">Aracı Kurumlar</Link></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                                <Globe className="w-4 h-4 text-purple-500" /> Kurumsal
                            </h3>
                            <ul className="space-y-3">
                                <li><Link to="/hakkimizda" className="text-zinc-400 hover:text-white text-sm transition-colors">Hakkımızda</Link></li>
                                <li><Link to="/blog" className="text-zinc-400 hover:text-white text-sm transition-colors">Blog & Analiz</Link></li>
                                <li><Link to="/iletisim" className="text-zinc-400 hover:text-white text-sm transition-colors">İletişim</Link></li>
                                <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Kariyer</a></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" /> Yasal
                            </h3>
                            <ul className="space-y-3">
                                <li><Link to="/kullanim-kosullari" className="text-zinc-400 hover:text-white text-sm transition-colors">Kullanım Koşulları</Link></li>
                                <li><Link to="/gizlilik-politikasi" className="text-zinc-400 hover:text-white text-sm transition-colors">Gizlilik Politikası</Link></li>
                                <li><Link to="/cerez-politikasi" className="text-zinc-400 hover:text-white text-sm transition-colors">Çerez Politikası</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Trust Badges & Bottom */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/5">
                                <Lock className="w-3 h-3 text-emerald-500" />
                                <span>256-bit SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/5">
                                <Activity className="w-3 h-3 text-blue-500" />
                                <span>Canlı BIST Verisi</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-zinc-600">
                            <span>© {currentYear} YatırımX Teknoloji A.Ş.</span>
                            <div className="flex items-center gap-4">
                                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                                <a href="#" className="hover:text-white transition-colors">Linkedin</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
