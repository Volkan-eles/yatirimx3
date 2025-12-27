import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Award, TrendingUp, ChevronRight, Activity, Target, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import SEO from '../components/SEO';
import FAQItem from '../components/FAQItem';

interface Broker {
    name: string;
    url: string;
    total_reports: number;
}

const AraciKurumlar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrokers = async () => {
            try {
                const response = await fetch('/brokers_tefas.json');
                if (response.ok) {
                    const data = await response.json();
                    // Sort by total reports by default to show most active first
                    setBrokers(data.sort((a: Broker, b: Broker) => b.total_reports - a.total_reports));
                }
            } catch (error) {
                console.error('Error fetching brokers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrokers();
    }, []);

    const filteredBrokers = brokers.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <SEO
                title="Aracı Kurum Raporları ve Hedef Fiyatlar 2026 | YatirimX"
                description="2026 yılı aracı kurum hisse önerileri, hedef fiyatlar, model portföyler ve en başarılı aracı kurum analizleri. Borsa İstanbul hisse senedi raporları."
                canonicalUrl="https://yatirimx.com/araci-kurumlar/"
                keywords="aracı kurum raporları, hedef fiyatlar, hisse önerileri, model portföy, borsa istanbul, 2026 hisse senedi"
            />

            {/* Dynamic Header */}
            <div className="relative py-12 px-8 rounded-[2.5rem] bg-gradient-to-br from-blue-900/10 via-zinc-900/40 to-black border border-white/5 overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                            <Award className="w-3 h-3" /> Analist Liderlik Tablosu
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Aracı Kurum <br /> <span className="text-blue-500">Raporları ve Analizler</span></h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Aracı kurumların yayınladığı rapor sayılarına ve analizlerine göre performans takibi.
                        </p>
                    </div>

                    <div className="w-full md:w-80 space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Kurum ismi ara..."
                                className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-blue-500/50 outline-none transition-all shadow-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between items-center px-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                            <span>Toplam {brokers.length} Kurum</span>
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Canlı Veri</span>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                    <p>Aracı kurum verileri yükleniyor...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBrokers.map((broker, idx) => (


                        <Link
                            to={`/araci-kurumlar/${slugify(broker.name)}`}
                            key={idx}
                            className="glass-panel rounded-3xl p-8 hover:border-blue-500/40 hover:bg-zinc-900/60 transition-all duration-500 group relative overflow-hidden flex flex-col"
                        >
                            {/* Rank Badge */}
                            <div className="absolute top-0 right-0 p-4">
                                <div className="text-4xl font-black text-white/5 group-hover:text-blue-500/10 transition-colors italic">
                                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                                </div>
                            </div>

                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                    <Briefcase className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-xl group-hover:text-blue-400 transition-colors mb-1">{broker.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                        <span className="text-xs text-zinc-500 font-bold">Aktif Kurum</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-auto">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Toplam Rapor</div>
                                    <div className="text-2xl font-bold text-white tabular-nums flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-zinc-500" />
                                        {broker.total_reports}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 opacity-50">
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Başarı Puanı</div>
                                    <div className="text-xl font-bold text-zinc-600 tabular-nums">--</div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500 font-medium hover:text-blue-400 transition-colors">Detaylı İncele</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Disclaimer */}
            <div className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 flex items-start gap-4 max-w-4xl mx-auto">
                <Target className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                <div>
                    <h5 className="text-white font-bold mb-1">Veri Kaynağı</h5>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        Bu veriler tefasfon.com üzerinden derlenmiştir. Rapor sayıları ve kurum sıralamaları güncel piyasa verilerine dayanmaktadır.
                    </p>
                </div>
            </div>

            {/* Content / FAQ Section */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    Aracı Kurumlar Hakkında Sıkça Sorulan Sorular (2026)
                </h2>

                <div className="space-y-4">
                    <FAQItem
                        question="Aracı Kurum Hedef Fiyatları 2026 Yılında Nasıl Yorumlanmalı?"
                        answer="2026 yılı için açıklanan hedef fiyatlar, analistlerin şirketlerin gelecek performanslarına dair beklentilerini yansıtır. Bu fiyatlar, enflasyon, faiz oranları ve şirketin büyüme potansiyeli gibi makroekonomik ve spesifik faktörlere göre belirlenir. Yatırım kararı verirken tek bir kurumun değil, birden fazla kurumun raporunu incelemek (konsensüs) daha sağlıklı sonuçlar verir."
                    />
                    <FAQItem
                        question="En Başarılı Aracı Kurum Hangisi?"
                        answer="En başarılı aracı kurum, yatırımcı profiline göre değişmekle birlikte, genellikle isabet oranı yüksek raporlar yayınlayan, geniş bir araştırma ekibine sahip ve 2026 stratejilerini şeffaf bir şekilde paylaşan kurumlar (örn. İş Yatırım, Yapı Kredi Yatırım, HSBC vb.) öne çıkmaktadır. Sitemizdeki 'Analist Liderlik Tablosu' üzerinden kurumların rapor sayılarını ve performanslarını takip edebilirsiniz."
                    />
                    <FAQItem
                        question="Hedef Fiyat (Target Price) Nedir?"
                        answer="Hedef fiyat, bir hisse senedinin temel analiz yöntemleri (İNA, Piyasa Çarpanları vb.) kullanılarak hesaplanan 'olması gereken' değeridir. Analistler, hissenin 12 ay içinde (örneğin 2026 sonuna kadar) bu fiyata ulaşmasını bekler."
                    />
                    <FAQItem
                        question="Aracı Kurum Raporlarına Nasıl Ulaşabilirim?"
                        answer="YatirimX üzerinden aracı kurumların yayınladığı en güncel hisse önerilerine, model portföylerine ve şirket raporlarına ücretsiz olarak ulaşabilirsiniz. Kurum detay sayfalarında ilgili kurumun tüm önerilerini listeleyebilirsiniz."
                    />
                    <FAQItem
                        question="Model Portföy Nedir ve 2026 Beklentileri Neler?"
                        answer="Model portföy, aracı kurumların en çok güvendikleri ve yüksek getiri bekledikleri hisselerden oluşturdukları sanal bir sepettir. 2026 model portföylerinde genellikle büyüme potansiyeli yüksek, döviz geliri olan ve temettü verimliliği yüksek şirketlerin öne çıkması beklenmektedir."
                    />
                </div>
            </div>
        </div>
    );
};

export default AraciKurumlar;