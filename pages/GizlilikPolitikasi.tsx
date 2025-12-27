import React from 'react';
import { Shield, Lock, Eye, Database, Cookie, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const GizlilikPolitikasi: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <SEO
                title="Gizlilik Politikası ve KVKK Aydınlatma Metni | YatırımX"
                description="YatırımX gizlilik politikası, veri güvenliği ve KVKK kapsamında kişisel verilerinizin korunması hakkında bilgilendirme."
                canonicalUrl="https://yatirimx.com/gizlilik-politikasi/"
                keywords="gizlilik politikası, kvkk, veri güvenliği, yatırımx yasal"
            />

            <div className="text-center mb-12 pt-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    Gizlilik Politikası
                </h1>
                <p className="text-zinc-400 text-sm">
                    Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            <div className="space-y-6">

                {/* Introduction */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Giriş</h2>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                        YatırımX olarak, kullanıcılarımızın gizliliğine önem veriyoruz. Bu Gizlilik Politikası,
                        web sitemizi ziyaret ettiğinizde toplanan bilgilerin nasıl kullanıldığını ve korunduğunu açıklar.
                    </p>
                </div>

                {/* Data Collection */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Toplanan Bilgiler</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-white font-semibold mb-2">Otomatik Olarak Toplanan Bilgiler</h3>
                            <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>IP adresi ve coğrafi konum bilgileri</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Tarayıcı türü ve versiyonu</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Ziyaret edilen sayfalar ve tıklama verileri</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Cihaz bilgileri (mobil, masaüstü)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-white font-semibold mb-2">İletişim Formları Aracılığıyla Toplanan Bilgiler</h3>
                            <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>İsim ve soyisim</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>E-posta adresi</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Mesaj içeriği</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Data Usage */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-white">Bilgilerin Kullanımı</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">Topladığımız bilgileri şu amaçlarla kullanırız:</p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Web sitesinin işlevselliğini sağlamak ve geliştirmek</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Kullanıcı deneyimini iyileştirmek</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>İstatistiksel analizler yapmak</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Teknik sorunları tespit etmek ve çözmek</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>İletişim taleplerinize yanıt vermek</span>
                        </li>
                    </ul>
                </div>

                {/* Cookies */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Cookie className="w-6 h-6 text-orange-400" />
                        <h2 className="text-2xl font-bold text-white">Çerezler (Cookies)</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">
                        Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanır:
                    </p>

                    <div className="space-y-3">
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-white font-semibold text-sm mb-1">Zorunlu Çerezler</h4>
                            <p className="text-zinc-500 text-xs">Web sitesinin temel işlevlerini sağlar</p>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-white font-semibold text-sm mb-1">Analitik Çerezler</h4>
                            <p className="text-zinc-500 text-xs">Ziyaretçi istatistiklerini toplar (Google Analytics)</p>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-white font-semibold text-sm mb-1">Reklam Çerezleri</h4>
                            <p className="text-zinc-500 text-xs">Kişiselleştirilmiş reklamlar için kullanılır (Google AdSense)</p>
                        </div>
                    </div>
                </div>

                {/* Third Party Services */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Üçüncü Taraf Hizmetler</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">Web sitemizde kullanılan üçüncü taraf hizmetler:</p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Yahoo Finance API:</strong> Hisse senedi verilerini sağlar</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Google Analytics:</strong> Web sitesi trafiğini analiz eder</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Google AdSense:</strong> Reklamları gösterir</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Netlify:</strong> Web sitesi barındırma hizmeti</span>
                        </li>
                    </ul>
                </div>

                {/* Data Security */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-white">Veri Güvenliği</h2>
                    </div>

                    <p className="text-zinc-400 leading-relaxed">
                        Bilgilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri alıyoruz.
                        Web sitemiz HTTPS protokolü ile şifrelenir ve verileriniz güvenli sunucularda saklanır.
                        Ancak, internet üzerinden veri iletiminin %100 güvenli olduğunu garanti edemeyiz.
                    </p>
                </div>

                {/* User Rights */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Kullanıcı Hakları</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>Kişisel verilerinizin düzeltilmesini isteme</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</span>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">İletişim</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">
                        Gizlilik politikamız hakkında sorularınız için:
                    </p>

                    <a
                        href="mailto:vlkneles@gmail.com"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                    >
                        vlkneles@gmail.com
                    </a>
                </div>

                {/* Updates */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                    <h3 className="text-yellow-400 font-bold mb-2">Politika Güncellemeleri</h3>
                    <p className="text-zinc-400 text-sm">
                        Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda
                        bu sayfada duyuru yapılacaktır. Düzenli olarak kontrol etmenizi öneririz.
                    </p>
                </div>

            </div>

        </div>
    );
};

export default GizlilikPolitikasi;
