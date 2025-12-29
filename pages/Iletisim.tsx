import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { ContactForm } from '../components/ContactForm';

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

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Contact Form */}
                <div className="glass-panel p-8 rounded-3xl md:row-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Bize Ulaşın</h2>
                            <p className="text-zinc-500 text-sm">Formu doldurun, en kısa sürede dönüş yapalım.</p>
                        </div>
                    </div>

                    <ContactForm />
                </div>

                {/* Additional Contact Info (Right Side) */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-zinc-400" /> Merkez Ofis
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Büyükdere Cd. No:123<br />
                            Levent, İstanbul<br />
                            Türkiye
                        </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                        <h3 className="text-blue-400 font-bold mb-2">💡 İpucu</h3>
                        <p className="text-zinc-400 text-sm">
                            Teknik sorunlar için lütfen kullandığınız tarayıcı ve cihaz bilgilerini belirtin.
                            Hisse senedi ile ilgili sorularınızda hisse kodunu (örn: GARAN) eklemeyi unutmayın.
                        </p>
                    </div>

                    {/* Additional Contact Cards */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Destek</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Yanıt Süresi</h3>
                                <p className="text-zinc-400 text-sm">
                                    Mesajlarınıza genellikle 24-48 saat içinde yanıt veriyoruz.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <h3 className="text-white font-semibold mb-2">Hızlı İletişim</h3>
                                <p className="text-zinc-400 text-sm mb-3">
                                    Acil durumlar için doğrudan e-posta gönderin:
                                </p>
                                <a
                                    href="mailto:vlkneles@gmail.com"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    E-posta Gönder
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl">
                        <h3 className="text-white font-bold text-lg mb-4">Sık Sorulan Sorular</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-zinc-400">
                                    <span className="text-white font-semibold">Veri ne sıklıkla güncellenir?</span>
                                    <br />
                                    Hisse verileri gerçek zamanlı olarak güncellenir.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-zinc-400">
                                    <span className="text-white font-semibold">Ücretsiz mi?</span>
                                    <br />
                                    Evet, tüm özellikler tamamen ücretsizdir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Iletisim;
