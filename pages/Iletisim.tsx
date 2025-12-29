import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';

const Iletisim: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <SEO
                title="İletişim - Bize Ulaşın | YatırımX"
                description="YatırımX destek ekibi ile iletişime geçin. Görüş, öneri ve sorularınız için iletişim kanallarımız."
                canonicalUrl="https://yatirimx.com/iletisim/"
                keywords="iletişim, bize ulaşın, yatırımx destek, borsa iletişim"
            />

            {/* Hero Section */}
            <div className="text-center mb-12 pt-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    İletişim
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                    Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Intro Card */}
                <div className="glass-panel p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bize Ulaşın</h2>
                    <p className="text-zinc-400">
                        Sorularınız, iş birlikleri veya geri bildirimleriniz için e-posta yoluyla bize ulaşabilirsiniz.
                    </p>
                    <div className="mt-8">
                        <a
                            href="mailto:vlkneles@gmail.com"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all hover:scale-105"
                        >
                            <Mail className="w-5 h-5" />
                            vlkneles@gmail.com
                        </a>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Support Info */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Destek</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-white font-semibold mb-1">Yanıt Süresi</h3>
                                <p className="text-zinc-400 text-sm">
                                    Mesajlarınıza genellikle 24-48 saat içinde yanıt veriyoruz.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Mini */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Merkez</h2>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Büyükdere Cd. No:123<br />
                            Levent, İstanbul<br />
                            Türkiye
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Iletisim;
