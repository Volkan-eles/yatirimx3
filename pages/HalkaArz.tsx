import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, BarChart, Info, Clock, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

interface IPOItem {
    code: string;
    company: string;
    dates: string;
    status: string;
    price: number | string;
    lotCount: string;
    distributionType: string;
    url?: string;
    link?: string;
    logo?: string;
    slug?: string;
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left group"
            >
                <span className="text-zinc-200 font-bold text-sm group-hover:text-white transition-colors flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isOpen ? 'bg-blue-500 text-white border-blue-500' : 'bg-zinc-800 border-white/5 text-zinc-500 group-hover:bg-zinc-700'}`}>
                        ?
                    </span>
                    {question}
                </span>
                {isOpen ? <div className="text-blue-500">-</div> : <div className="text-zinc-500">+</div>}
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

const IPOCard: React.FC<{ ipo: IPOItem; isDraft?: boolean }> = ({ ipo, isDraft }) => {
    const formatPrice = (p: string | number) => {
        if (!p) return 'Belirlenmedi';
        if (typeof p === 'number') return `₺${p.toFixed(2)}`;
        // If string and looks like number
        const num = parseFloat(p);
        if (!isNaN(num)) return `₺${num.toFixed(2)}`;
        return p; // Return as is if string like "50-60 TL"
    };

    return (
        <div className={`glass-panel p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-blue-500/30 ${isDraft ? 'border-dashed' : ''}`}>
            {!isDraft && (ipo.status === 'Talep Toplanıyor' || (ipo.status === 'Yeni' && /\d/.test(ipo.dates))) && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                    TALEP TOPLANIYOR
                </div>
            )}

            {!isDraft && ipo.status === 'Yeni' && !/\d/.test(ipo.dates) && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg animate-pulse">
                    YENİ
                </div>
            )}

            {!isDraft && ipo.status === 'Onaylı' && (
                <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                    ONAYLANDI - TARİH BEKLENİYOR
                </div>
            )}

            {isDraft && (
                <div className="absolute top-0 right-0 bg-zinc-700 text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    TASLAK AŞAMASINDA
                </div>
            )}

            {!isDraft && ipo.status.includes('Tamamlandı') && (
                <div className="absolute top-0 right-0 bg-blue-600/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-blue-500/20">
                    TAMAMLANDI
                </div>
            )}

            <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden ${isDraft ? 'bg-zinc-800 border border-white/5' : 'bg-white'}`}>
                    {ipo.logo ? (
                        <img src={ipo.logo} alt={ipo.code} className="w-full h-full object-contain p-1" />
                    ) : (
                        <span className={`${isDraft ? 'text-zinc-500' : 'text-black'} font-bold text-sm tracking-tighter`}>
                            {ipo.code || ipo.company.substring(0, 2).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate" title={ipo.company}>{ipo.company}</h3>
                    <div className="text-zinc-500 text-sm flex items-center gap-2">
                        {isDraft ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                        {ipo.dates || 'Tarih Bekleniyor'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5">
                    <div className="text-zinc-500 text-xs mb-1">Arz Fiyatı</div>
                    <div className="text-white font-mono font-bold">
                        {formatPrice(ipo.price)}
                    </div>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5">
                    <div className="text-zinc-500 text-xs mb-1">Dağıtım</div>
                    <div className="text-white font-medium text-sm truncate" title={ipo.distributionType}>{ipo.distributionType || 'Belirtilmedi'}</div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
                <div className="flex items-center gap-1.5">
                    <BarChart className="w-3 h-3" />
                    {ipo.lotCount || 'Lot Bilgisi Yok'}
                </div>
                <Link to={`/halka-arz/${(ipo.slug || (ipo.link ? ipo.link.match(/halkarz\.com\/([^\/]+)\/?$/)?.[1] : null) || (ipo.url ? ipo.url.match(/halkarz\.com\/([^\/]+)\/?$/)?.[1] : null) || slugify(ipo.company))}-halka-arzi-hakkinda-bilmeniz-gerekenler-2026/`} className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors">
                    Detayları İncele <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>
            </div>
        </div>
    );
};

const HalkaArz: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Halka Arzlar' | 'Taslak Arzlar'>('Halka Arzlar');
    const [ipos, setIpos] = useState<IPOItem[]>([]);
    const [draftIpos, setDraftIpos] = useState<IPOItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching IPO data...");
                const response = await fetch(`/halkarz_ipos.json?v=${new Date().getTime()}`);
                if (!response.ok) throw new Error('Data fetch failed');
                const data = await response.json();
                console.log("Fetched data:", data);

                // Manual override for missing items to ensure they show up
                const hardcodedNewItems: IPOItem[] = [
                    {
                        code: "KOD_YOK",
                        company: "Akhan Un Fabrikası ve Tarım Ürünleri Gıda Sanayi Tic. A.Ş.",
                        dates: "Hazırlanıyor...",
                        status: "Yeni!",
                        logo: "https://halkarz.com/wp-content/uploads/2024/07/AKHANUN.jpg",
                        url: "https://halkarz.com/akhan-un-fabrikasi-ve-tarim-urunleri-gida-sanayi-tic-a-s/",
                        price: "21,50 TL",
                        lotCount: "54.7 Milyon",
                        distributionType: "Eşit Dağıtım",
                        // @ts-ignore
                        market: "Ana Pazar",
                        // @ts-ignore
                        floatingRate: "%20,01",
                        // @ts-ignore
                        totalSize: "1,1 Milyar TL",
                        slug: "akhan-un-fabrikasi-ve-tarim-urunleri-gida-sanayi-tic-a-s"
                    },
                    {
                        code: "KOD_YOK",
                        company: "Netcad Yazılım A.Ş.",
                        dates: "Hazırlanıyor...",
                        status: "Yeni!",
                        logo: "https://halkarz.com/wp-content/uploads/2022/03/NETCD-2.jpg",
                        url: "https://halkarz.com/netcad-yazilim-a-s/",
                        price: "46,00 TL",
                        lotCount: "36.5 Milyon",
                        distributionType: "Eşit Dağıtım",
                        // @ts-ignore
                        market: "Ana Pazar",
                        // @ts-ignore
                        floatingRate: "%27,61",
                        slug: "netcad-yazilim-a-s"
                    }
                ];

                // Filter duplicates
                const existing = data.active_ipos || [];
                const filtered = existing.filter((x: IPOItem) =>
                    !x.company.includes("Akhan Un") && !x.company.includes("Netcad")
                );

                setIpos([...hardcodedNewItems, ...filtered]);
                setDraftIpos(data.draft_ipos || []);
            } catch (error) {
                console.error("Failed to fetch IPO data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Halka Arz Çeşitleri Nelerdir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Halka arzlar genellikle dağıtım yöntemine göre ikiye ayrılır: Eşit Dağıtım ve Oransal Dağıtım. Ayrıca fiyat belirleme yöntemine göre 'Sabit Fiyatla Talep Toplama' ve 'Fiyat Aralığı ile Talep Toplama' olarak da sınıflandırılabilir."
                }
            },
            {
                "@type": "Question",
                "name": "Halka Arzda Oransal Dağıtım Nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oransal dağıtımda, yatırımcılara talep ettikleri pay miktarıyla orantılı olarak hisse verilir. Yani, ne kadar çok talep girerseniz ve toplam talep ne kadar azsa, o kadar çok hisse alırsınız."
                }
            },
            {
                "@type": "Question",
                "name": "Halka Arzda Eşit Dağıtım Nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Eşit dağıtımda, halka arza katılan tüm yatırımcılara, talep miktarına bakılmaksızın eşit sayıda lot verilir. Küçük yatırımcı dostu bir yöntemdir."
                }
            },
            {
                "@type": "Question",
                "name": "Borsa Market’ten Halka Arzlara Katılabilir miyim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet, hesabınızın bulunduğu aracı kurum veya bankanın mobil uygulaması üzerinden 'Halka Arz' menüsünü kullanarak talep toplama tarihlerinde emir girebilirsiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Halka Arz Hisseleri Borsada Ne Zaman İşlem Görmeye Başlar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Talep toplama süreci tamamlandıktan genellikle 3 ila 7 iş günü içerisinde 'Gong Töreni' yapılır ve hisseler Borsa İstanbul'da işlem görmeye başlar."
                }
            }
        ]
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SEO
                title="Halka Arz Takvimi 2026 | YatirimX"
                description="2026 yılı güncel halka arz takvimi, SPK onaylı yeni halka arzlar, talep toplama tarihleri, dağıtım oranları ve şirket analizleri YatirimX'te."
                canonicalUrl="https://yatirimx.com/halka-arz/"
                keywords="halka arz, halka arz takvimi, 2026 halka arz, yeni halka arzlar, spk bülteni, borsa istanbul"
                schema={faqSchema}
            />

            {/* Page Header */}
            <div className="relative py-16 px-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/20 via-zinc-900/50 to-black border border-white/5 overflow-hidden shadow-2xl">
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Calendar className="w-3 h-3" /> Yatırım Fırsatları
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Halka Arz Takvimi</h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Borsa İstanbul'da işlem görmeye başlayacak şirketlerin halka arz süreçlerini, tarihlerini ve izahnamelerini anlık olarak takip edin.
                    </p>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center">
                <div className="bg-zinc-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl flex relative">
                    <button
                        onClick={() => setActiveTab('Halka Arzlar')}
                        className={`relative z-10 px-10 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'Halka Arzlar' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <CheckCircle2 className={`w-4 h-4 transition-transform duration-500 ${activeTab === 'Halka Arzlar' ? 'scale-100' : 'scale-0'}`} />
                        Halka Arzlar
                    </button>
                    <button
                        onClick={() => setActiveTab('Taslak Arzlar')}
                        className={`relative z-10 px-10 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'Taslak Arzlar' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Clock className={`w-4 h-4 transition-transform duration-500 ${activeTab === 'Taslak Arzlar' ? 'scale-100' : 'scale-0'}`} />
                        Taslak Arzlar
                    </button>

                    {/* Animated Slider Background */}
                    <div
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-xl border border-white/5 shadow-lg transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${activeTab === 'Taslak Arzlar' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
                            }`}
                    />
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-zinc-500">Veriler Yükleniyor...</div>
                ) : activeTab === 'Halka Arzlar' ? (
                    ipos.length > 0 ? (
                        ipos.map((ipo, idx) => (
                            <IPOCard key={ipo.code + idx} ipo={ipo} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-zinc-500">Aktif halka arz bulunamadı.</div>
                    )
                ) : (
                    draftIpos.length > 0 ? (
                        draftIpos.map((ipo, idx) => (
                            <IPOCard key={ipo.code + idx} ipo={ipo} isDraft />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-zinc-500">Geçmiş halka arz bulunamadı.</div>
                    )
                )}
            </div>

            {/* Empty State / Legend */}
            <div className="mt-12 p-8 rounded-3xl bg-zinc-900/30 border border-white/5 text-center mb-12">
                <p className="text-zinc-500 text-sm max-w-2xl mx-auto italic">
                    * Geçmiş arzlar tamamlanmış veya iptal edilmiş halka arz süreçlerini kapsamaktadır. Bilgiler arşiv amaçlıdır.
                </p>
            </div>

            {/* Informational Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" /> Halka Arz Nedir?
                    </h2>
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-4 text-zinc-400 leading-relaxed">
                        <p>
                            <strong className="text-white">Halka arz</strong>, şirketlerin kaynak ihtiyaçlarını karşılamak, büyümek veya kurumsallaşmak amacıyla hisselerini Borsa İstanbul'da işlem görmek üzere yatırımcılara açması sürecidir.
                        </p>
                        <p>
                            Bu süreçte şirketler, sahip oldukları payları belirli bir fiyat veya fiyat aralığından halka satışa sunarlar. Yatırımcılar, ilan edilen <strong>talep toplama tarihlerinde</strong> aracı kurumlar veya bankalar üzerinden ilgili hisseye alım emri girerek halka arza katılabilirler.
                        </p>
                        <p>
                            Halka arz sūreci, yatırımcılar için potansiyel değeri yüksek şirketlere erken aşamada ortak olma fırsatı sunarken, şirketler için de faizsiz finansman kaynağına erişim sağlar.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Halka Arz Süreci Nasıl İşler?
                    </h2>
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <ul className="space-y-4">
                            {[
                                "Şirket, Borsa İstanbul ve Sermaye Piyasası Kurulu'na (SPK) halka arz başvurusu yapar.",
                                "SPK ve Borsa İstanbul uzmanları şirketi detaylıca inceler ve denetler.",
                                "Şirketin hazırladığı 'Halka Arz İzahnamesi' SPK tarafından onaylanır.",
                                "Halka arz fiyatı ve talep toplama tarihleri Kamuyu Aydınlatma Platformu'nda (KAP) ilan edilir.",
                                "Yatırımcılar belirlenen tarihlerde hisse senedi alım taleplerini iletir.",
                                "Talep toplama süreci bittikten sonra, dağıtım sonuçları açıklanır ve hisseler hesaplara geçer.",
                                "Şirket hisseleri, Borsa İstanbul'da işlem görmeye başlar (Gong Töreni)."
                            ].map((step, idx) => (
                                <li key={idx} className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <span className="text-zinc-400 text-sm leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8 max-w-4xl mx-auto pb-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Sıkça Sorulan Sorular</h2>
                    <p className="text-zinc-500">Halka arz süreçleri hakkında merak edilenler</p>
                </div>

                <div className="grid gap-4">
                    <FAQItem
                        question="Halka Arz Çeşitleri Nelerdir?"
                        answer="Halka arzlar genellikle dağıtım yöntemine göre ikiye ayrılır: Eşit Dağıtım ve Oransal Dağıtım. Ayrıca fiyat belirleme yöntemine göre 'Sabit Fiyatla Talep Toplama' ve 'Fiyat Aralığı ile Talep Toplama' olarak da sınıflandırılabilir."
                    />
                    <FAQItem
                        question="Halka Arzda Oransal Dağıtım Nedir?"
                        answer="Oransal dağıtımda, yatırımcılara talep ettikleri pay miktarıyla orantılı olarak hisse verilir. Yani, ne kadar çok talep girerseniz ve toplam talep ne kadar azsa, o kadar çok hisse alırsınız. Genellikle yüksek sermayeli yatırımcılar için avantajlıdır."
                    />
                    <FAQItem
                        question="Halka Arzda Eşit Dağıtım Nedir?"
                        answer="Eşit dağıtımda, halka arza katılan tüm yatırımcılara, talep miktarına bakılmaksızın (talep edilen miktar yeterliyse) eşit sayıda lot verilir. Toplam satılacak lot sayısı, katılımcı sayısına bölünür. Küçük yatırımcı dostu bir yöntemdir."
                    />
                    <FAQItem
                        question="Borsa Market’ten Halka Arzlara Katılabilir miyim?"
                        answer="Evet, hesabınızın bulunduğu aracı kurum veya bankanın mobil uygulaması (Borsa Market vb.) üzerinden, 'Halka Arz' menüsünü kullanarak veya ilgili hisse kodunu (örn. ARFYE.HE) aratarak talep toplama tarihlerinde emir girebilirsiniz."
                    />
                    <FAQItem
                        question="Halka Arz Talebim Portföyde Görünmüyor, Ne Yapmalıyım?"
                        answer="Talep girişinizden sonra hisseler hemen portföyünüze geçmez. Talep toplama süreci tamamlanıp dağıtım listeleri kesinleştikten sonra (genellikle 1-2 iş günü içinde) hisseler portföyünüze yansır. Emirlerim menüsünden talebinizin durumunu (İletildi/Gerçekleşti) kontrol edebilirsiniz."
                    />
                    <FAQItem
                        question="Neden Talep Ettiğimden Daha Az Hisse Geldi?"
                        answer="Eşit dağıtım yönteminde veya arzın çok üzerinde talep (over-subscription) gelmesi durumunda, herkese talep ettiğinden daha az hisse düşebilir. Örneğin, 100 lot talep ettiniz ancak o arza 3 milyon kişi katıldıysa, kişi başı sadece 10 lot düşebilir. Kalan tutar hesabınıza iade edilir."
                    />
                    <FAQItem
                        question="Halka Arza Katılmanın Avantajları Nelerdir?"
                        answer="Halka arzlar, şirketlerin büyüme potansiyeline erken aşamada ortak olma fırsatı sunar. Genellikle halka arz fiyatı, piyasa değerine göre iskontolu belirlenir, bu da kısa vadede getiri potansiyeli yaratabilir."
                    />
                    <FAQItem
                        question="Halka Arzdan Hisse Almak İçin Ne Yapmam Gerekir?"
                        answer="Bir banka veya aracı kurumda yatırım hesabınızın olması yeterlidir. Mobil bankacılık veya yatırım uygulaması üzerinden 'Halka Arz' menüsüne girerek veya ilgili hisse kodunu aratarak talep toplama tarihlerinde adet belirterek başvuruda bulunabilirsiniz."
                    />
                    <FAQItem
                        question="Halka Arz Hisseleri Borsada Ne Zaman İşlem Görmeye Başlar?"
                        answer="Talep toplama süreci tamamlandıktan ve sonuçlar açıklandıktan sonra genellikle 3 ila 7 iş günü içerisinde 'Gong Töreni' yapılır ve hisseler Borsa İstanbul'da işlem görmeye başlar."
                    />
                    <FAQItem
                        question="Halka Arz İçin Hangi Evraklar Gerekiyor?"
                        answer="Mevcut bir yatırım hesabınız varsa herhangi bir fiziki evrak gerekmez. Başvuru sırasında dijital ortamda İzahname ve Risk Bildirim Formu'nu onaylamanız yeterlidir."
                    />
                    <FAQItem
                        question="Halka Arz Hisselerimi Ne Zaman Satabilirim?"
                        answer="Hisseler, Borsa İstanbul'da işlem görmeye başladığı andan itibaren (ilk işlem günü) dilediğiniz zaman piyasa fiyatından satış emri verebilirsiniz."
                    />
                    <FAQItem
                        question="Mevcut Hissemi Satıp Neden Hemen Halka Arza Katılamıyorum? (Yetersiz Bakiye Uyarısı)"
                        answer="Borsa İstanbul'da hisse satışından gelen para (T+2) kuralı gereği 2 iş günü sonra nakde dönüşür. Bazı halka arzlarda (genellikle oransal dağıtımda) bu T1/T2 bakiyesi kullanılabilirken, bazılarında sadece kullanılabilir nakit veya fon blokesi gereklidir. Bu nedenle satış yaptığınız gün para henüz hesabınıza geçmemiş sayılabilir."
                    />
                    <FAQItem
                        question="Halka Arz Hisseleri Kâr Getirir mi?"
                        answer="Halka arzlar genellikle iskontolu fiyatla sunulduğu için kazanç potansiyeli taşır, ancak garanti değildir. Piyasa koşulları, şirketin performansı ve yatırımcı ilgisi fiyatı etkiler. Her yatırım risk taşır."
                    />
                    <FAQItem
                        question="Halka Arz Başvurusu Yaptıktan Sonra Ne Olur?"
                        answer="Başvurunuz aracı kurum tarafından Borsa İstanbul'a iletilir. Talep toplama bittiğinde dağıtım hesaplanır. Hak kazandığınız hisseler portföyünüze eklenir, kullanılmayan bakiye (iade) hesabınıza geri yatar."
                    />
                    <FAQItem
                        question="Halka Arza Katılmanın Riskleri Nelerdir?"
                        answer="Hisse fiyatının halka arz fiyatının altına düşmesi, işlem hacminin düşük olması (likidite riski) veya şirketin beklenen performansı gösterememesi gibi riskler bulunur. İzahnameyi incelemek önemlidir."
                    />
                    <FAQItem
                        question="Hangi Tarihlerde Halka Arz Hisselerine Katılabilirim?"
                        answer="Her şirketin talep toplama tarihleri farklıdır ve SPK onayından sonra ilan edilir. Bu tarihleri sitemizdeki Halka Arz Takvimi üzerinden takip edebilirsiniz."
                    />
                    <FAQItem
                        question="Katılım Endeksine Uygun Halka Arzları Nasıl Anlarım?"
                        answer="Şirketin İzahnamesinde veya sitemizdeki detay sayfalarında 'Katılım Endeksine Uygun' ibaresi yer alır. Bu, şirketin faiz hassasiyeti ve faaliyet alanları açısından katılım bankacılığı prensiplerine uygun olduğunu gösterir."
                    />
                    <FAQItem
                        question="Bireysel Yatırımcılar Nelere Dikkat Etmeli?"
                        answer="Şirketin finansal durumu, halka arz gelirini nerede kullanacağı, ortakların satmama taahhüdü verip vermediği ve fiyat istikrarı fonu olup olmadığı gibi kriterlere dikkat edilmelidir."
                    />
                </div>
            </div>

        </div>
    );
};

export default HalkaArz;
