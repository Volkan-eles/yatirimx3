import React from 'react';
import { FileText, AlertTriangle, Shield, Ban } from 'lucide-react';

const KullanimKosullari: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">

            <div className="text-center mb-12 pt-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    Kullanım Koşulları
                </h1>
                <p className="text-zinc-400 text-sm">
                    Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            <div className="space-y-6">

                {/* Acceptance */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Kabul ve Onay</h2>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                        YatırımX web sitesini kullanarak, bu Kullanım Koşullarını okuduğunuzu, anladığınızı ve
                        kabul ettiğinizi beyan edersiniz. Bu koşulları kabul etmiyorsanız, lütfen web sitemizi kullanmayınız.
                    </p>
                </div>

                {/* Service Description */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-white">Hizmet Tanımı</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">
                        YatırımX, Borsa İstanbul (BIST) hisse senetleri hakkında bilgi sağlayan bir platformdur:
                    </p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Gerçek zamanlı hisse senedi fiyatları ve verileri</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Teknik analizler ve finansal metrikler</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Analist hedef fiyatları ve tavsiyeleri</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>Piyasa analizleri ve eğitim içerikleri</span>
                        </li>
                    </ul>
                </div>

                {/* Disclaimer */}
                <div className="glass-panel p-8 rounded-3xl border-2 border-yellow-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-2xl font-bold text-white">Önemli Uyarı ve Sorumluluk Reddi</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-yellow-500/10 p-4 rounded-xl">
                            <h3 className="text-yellow-400 font-bold mb-2">Yatırım Tavsiyesi Değildir</h3>
                            <p className="text-zinc-400 text-sm">
                                YatırımX platformunda sunulan tüm bilgiler <strong>yalnızca bilgilendirme amaçlıdır</strong> ve
                                <strong> yatırım tavsiyesi niteliği taşımamaktadır</strong>. Hiçbir içerik, hisse senedi alım
                                veya satım önerisi olarak yorumlanmamalıdır.
                            </p>
                        </div>

                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            <h3 className="text-red-400 font-bold mb-2">Risk Uyarısı</h3>
                            <p className="text-zinc-400 text-sm">
                                Hisse senedi yatırımları <strong>yüksek risk</strong> içerir ve sermaye kaybına yol açabilir.
                                Geçmiş performans, gelecekteki sonuçların garantisi değildir. Yatırım kararlarınızı vermeden önce
                                <strong> profesyonel bir finansal danışmana</strong> danışmanız şiddetle tavsiye edilir.
                            </p>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold mb-2">Kendi Araştırmanızı Yapın</h3>
                            <p className="text-zinc-400 text-sm">
                                Platformumuzda sunulan bilgiler, kendi araştırmanızı yapmanız için bir başlangıç noktası olarak
                                kullanılmalıdır. Yatırım kararlarınızın sorumluluğu tamamen size aittir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Data Accuracy */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Veri Doğruluğu</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">
                        Verilerimiz Yahoo Finance API ve diğer güvenilir kaynaklardan sağlanmaktadır. Ancak:
                    </p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Verilerin doğruluğunu garanti edemeyiz</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Veriler gecikmeli olabilir (her 30 dakikada güncellenir)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Teknik hatalar veya kesintiler oluşabilir</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Üçüncü taraf kaynaklardaki hatalardan sorumlu değiliz</span>
                        </li>
                    </ul>
                </div>

                {/* User Responsibilities */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Kullanıcı Sorumlulukları</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">Web sitemizi kullanırken:</p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">✓</span>
                            <span>Yasalara ve düzenlemelere uygun hareket etmelisiniz</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">✓</span>
                            <span>Başkalarının haklarına saygı göstermelisiniz</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">✓</span>
                            <span>Doğru ve güncel bilgiler sağlamalısınız</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">✓</span>
                            <span>Sistemi kötüye kullanmamalısınız</span>
                        </li>
                    </ul>
                </div>

                {/* Prohibited Activities */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Ban className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">Yasaklanan Faaliyetler</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">Aşağıdaki faaliyetler kesinlikle yasaktır:</p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Web sitesini otomatik araçlarla (bot, scraper) taramak</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Verileri izinsiz kopyalamak veya dağıtmak</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Sisteme zarar vermek veya güvenliği tehlikeye atmak</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Yanıltıcı veya sahte bilgiler paylaşmak</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Spam veya istenmeyen içerik göndermek</span>
                        </li>
                    </ul>
                </div>

                {/* Intellectual Property */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-white">Fikri Mülkiyet Hakları</h2>
                    </div>

                    <p className="text-zinc-400 leading-relaxed">
                        Web sitesindeki tüm içerik, tasarım, logo, grafik ve yazılımlar YatırımX'in mülkiyetindedir
                        ve telif hakkı yasaları ile korunmaktadır. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
                    </p>
                </div>

                {/* Limitation of Liability */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                        <h2 className="text-2xl font-bold text-white">Sorumluluk Sınırlaması</h2>
                    </div>

                    <p className="text-zinc-400 leading-relaxed mb-4">
                        YatırımX, aşağıdaki durumlardan sorumlu tutulamaz:
                    </p>

                    <ul className="text-zinc-400 text-sm space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>Platformumuzda sunulan bilgilere dayanarak yapılan yatırımlardan kaynaklanan kayıplar</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>Veri hatalarından veya gecikmelerden kaynaklanan zararlar</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>Teknik arızalar veya hizmet kesintileri</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>Üçüncü taraf web sitelerine bağlantılardan kaynaklanan sorunlar</span>
                        </li>
                    </ul>
                </div>

                {/* Changes to Terms */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Değişiklikler</h2>
                    </div>

                    <p className="text-zinc-400 leading-relaxed">
                        Bu Kullanım Koşullarını herhangi bir zamanda değiştirme hakkını saklı tutarız.
                        Önemli değişiklikler web sitesinde duyurulacaktır. Değişikliklerden sonra siteyi
                        kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
                    </p>
                </div>

                {/* Contact */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">İletişim</h2>
                    </div>

                    <p className="text-zinc-400 mb-4">
                        Kullanım koşulları hakkında sorularınız için:
                    </p>

                    <a
                        href="mailto:vlkneles@gmail.com"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                    >
                        vlkneles@gmail.com
                    </a>
                </div>

            </div>

        </div>
    );
};

export default KullanimKosullari;
