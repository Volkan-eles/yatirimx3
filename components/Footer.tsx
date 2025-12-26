import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Shield, FileText } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#09090b] border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black text-white">YatırımX</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                            Türkiye'nin en kapsamlı borsa ve hisse senedi analiz platformu.
                            507 BIST hissesi için gerçek zamanlı veriler, teknik analizler ve uzman görüşleri.
                        </p>
                        <div className="flex items-center gap-2 text-zinc-600 text-xs">
                            <Shield className="w-4 h-4" />
                            <span>Veriler Yahoo Finance API'den sağlanmaktadır</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Hızlı Erişim</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link to="/piyasa" className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Borsa
                                </Link>
                            </li>
                            <li>
                                <Link to="/hedef-fiyat" className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Hedef Fiyatlar
                                </Link>
                            </li>
                            <li>
                                <Link to="/temettu" className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Temettü Takvimi
                                </Link>
                            </li>
                            <li>
                                <Link to="/halka-arz" className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Halka Arzlar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Info */}
                    <div>
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Kurumsal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/hakkimizda" className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link to="/iletisim" className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link to="/gizlilik-politikasi" className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Gizlilik Politikası
                                </Link>
                            </li>
                            <li>
                                <Link to="/kullanim-kosullari" className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    Kullanım Koşulları
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Disclaimer */}
                <div className="border-t border-white/5 pt-6 mb-6">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-yellow-400 text-xs font-semibold mb-1">⚠️ Önemli Uyarı</p>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            Bu platformda sunulan bilgiler yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımamaktadır.
                            Hisse senedi yatırımları yüksek risk içerir. Yatırım kararlarınızı vermeden önce profesyonel bir finansal danışmana danışmanız önerilir.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs">
                        © {currentYear} YatırımX. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                        <a href="mailto:vlkneles@gmail.com" className="hover:text-white transition-colors">
                            vlkneles@gmail.com
                        </a>
                        <span>•</span>
                        <span>v1.0.0</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
