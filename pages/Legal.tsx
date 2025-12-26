import React from 'react';
import { ScrollText, ShieldCheck, Cookie } from 'lucide-react';

const LegalLayout: React.FC<{ title: string; icon: any; children: React.ReactNode; lastUpdate: string }> = ({ title, icon: Icon, children, lastUpdate }) => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-zinc-800 rounded-lg">
                    <Icon className="w-6 h-6 text-zinc-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">{title}</h1>
            </div>
            <p className="text-zinc-500 text-sm">Son Güncelleme: {lastUpdate}</p>
        </div>
        <div className="space-y-8 text-zinc-300 leading-relaxed font-light">
            {children}
        </div>
    </div>
);

export const Terms: React.FC = () => {
    return (
        <LegalLayout title="Kullanım Koşulları" icon={ScrollText} lastUpdate="1 Ocak 2025">
            <section>
                <h3 className="text-xl font-bold text-white mb-3">1. Kabul Edilen Şartlar</h3>
                <p>YatirimX platformuna erişerek veya kullanarak, bu Kullanım Koşulları'na yasal olarak bağlı kalmayı kabul etmiş olursunuz. Bu koşulları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayınız.</p>
            </section>
            
            <section>
                <h3 className="text-xl font-bold text-white mb-3">2. Hizmet Tanımı ve Risk Bildirimi</h3>
                <p className="mb-4">YatirimX, finansal veriler, analiz araçları ve piyasa haberleri sunan bir bilgilendirme platformudur. Platformda yer alan hiçbir içerik, "yatırım tavsiyesi" niteliği taşımaz.</p>
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-200 text-sm">
                    <strong>Önemli Uyarı:</strong> Sermaye piyasası işlemleri yüksek risk içerir. Yatırım kararlarınızı, kendi mali durumunuz ve risk/getiri tercihlerinize göre vermeniz gerekmektedir. YatirimX, kullanıcıların platformdaki verilere dayanarak yaptığı işlemlerden doğabilecek zararlardan sorumlu tutulamaz.
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">3. Fikri Mülkiyet Hakları</h3>
                <p>Platform üzerindeki tüm grafikler, yazılımlar, algoritmalar ve içerikler YatirimX Teknoloji A.Ş. mülkiyetindedir. İzinsiz kopyalanması, dağıtılması veya tersine mühendislik işlemlerine tabi tutulması yasaktır.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">4. Hesap Güvenliği</h3>
                <p>Kullanıcı hesabınızın güvenliğini sağlamak sizin sorumluluğunuzdadır. Şifrenizi kimseyle paylaşmayınız. Şüpheli bir aktivite fark ettiğinizde derhal destek ekibimizle iletişime geçiniz.</p>
            </section>
        </LegalLayout>
    );
};

export const Privacy: React.FC = () => {
    return (
        <LegalLayout title="Gizlilik Politikası" icon={ShieldCheck} lastUpdate="15 Aralık 2024">
            <section>
                <p className="text-lg text-zinc-400 mb-6">YatirimX olarak gizliliğinize büyük önem veriyoruz. Bu politika, kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.</p>
                
                <h3 className="text-xl font-bold text-white mb-3">1. Toplanan Veriler</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-blue-500">
                    <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi.</li>
                    <li><strong>İşlem Bilgileri:</strong> Platform içi aramalar, izleme listeleri, favoriler.</li>
                    <li><strong>Teknik Veriler:</strong> IP adresi, cihaz bilgisi, tarayıcı tipi.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">2. Verilerin Kullanımı</h3>
                <p>Toplanan veriler; hizmetlerimizin sunulması, kişiselleştirilmiş analizlerin oluşturulması, hesap güvenliğinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">3. KVKK Aydınlatma Metni</h3>
                <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla YatirimX, kişisel verilerinizi mevzuata uygun olarak işlemektedir. Verileriniz, açık rızanız olmaksızın üçüncü taraflarla (yasal zorunluluklar hariç) paylaşılmamaktadır.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">4. Veri Güvenliği</h3>
                <p>Verileriniz, endüstri standardı şifreleme yöntemleri (SSL/TLS) ile korunmaktadır. Sunucularımız düzenli olarak güvenlik testlerine tabi tutulmaktadır.</p>
            </section>
        </LegalLayout>
    );
};

export const Cookies: React.FC = () => {
    return (
        <LegalLayout title="Çerez (Cookie) Politikası" icon={Cookie} lastUpdate="10 Kasım 2024">
             <section>
                <p className="mb-6">YatirimX platformunda kullanıcı deneyimini iyileştirmek ve sitenin verimli çalışmasını sağlamak amacıyla çerezler kullanılmaktadır.</p>
                
                <h3 className="text-xl font-bold text-white mb-3">1. Çerez Nedir?</h3>
                <p>Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınız aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalaridır.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">2. Kullanılan Çerez Türleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                        <div className="font-bold text-white mb-2 text-sm">Zorunlu Çerezler</div>
                        <p className="text-xs text-zinc-400">Web sitesinin temel fonksiyonlarının çalışması için gereklidir. Bu çerezler kapatılamaz.</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                        <div className="font-bold text-white mb-2 text-sm">Analitik Çerezler</div>
                        <p className="text-xs text-zinc-400">Ziyaretçilerin siteyi nasıl kullandığını analiz ederek performans iyileştirmeleri yapmamızı sağlar.</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                        <div className="font-bold text-white mb-2 text-sm">İşlevsellik Çerezleri</div>
                        <p className="text-xs text-zinc-400">Kullanıcı tercihlerinin (dil, tema vb.) hatırlanmasını sağlar.</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                        <div className="font-bold text-white mb-2 text-sm">Pazarlama Çerezleri</div>
                        <p className="text-xs text-zinc-400">İlgi alanlarınıza uygun içerik ve reklamlar sunmak için kullanılır.</p>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-bold text-white mb-3">3. Çerez Yönetimi</h3>
                <p>Tarayıcı ayarlarınızı değiştirerek çerez tercihlerinizi kişiselleştirebilirsiniz. Ancak zorunlu çerezlerin devre dışı bırakılması, platformun bazı özelliklerinin çalışmamasına neden olabilir.</p>
            </section>
        </LegalLayout>
    );
};