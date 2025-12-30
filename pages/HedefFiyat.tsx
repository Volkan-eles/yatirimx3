import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, ChevronDown, Download, ArrowRight, Info, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQItem from '../components/FAQItem';
import { slugify } from '../utils/slugify';
import { fixTurkishChars } from '../utils/fixEncoding';

// Halkarz data structure
interface HalkarzTargetPrice {
    bistkodu: string;
    sirket: string;
    link: string;
    analist: string;
    tarih: string;
    tr_class: string;
    hf_desc: string;
    hf_icon: string;
    hf_fiyat: string;
}

// Aggregated stock data for display
interface StockTargetData {
    stockCode: string;
    stockName: string;
    reports: HalkarzTargetPrice[];
    averageTarget: number;
    highestTarget: number;
    lowestTarget: number;
    buyCount: number;
    holdCount: number;
    sellCount: number;
}

const TargetCard: React.FC<{ item: StockTargetData }> = ({ item }) => {
    const totalReports = item.reports.length;
    const latestReport = item.reports[0];

    // Get recommendation badge color
    const getRecommendationColor = (desc: string) => {
        if (desc.includes('Al') || desc.includes('Üstü')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (desc.includes('Tut') || desc.includes('Nötr') || desc.includes('Paralel')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        if (desc.includes('Sat') || desc.includes('Azalt')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    };

    return (
        <div className="glass-panel p-6 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900/60 transition-all duration-300 group relative overflow-hidden">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform">
                        {item.stockCode}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                            {fixTurkishChars(item.stockName)} ({item.stockCode}) Hedef Fiyat 2026
                        </h3>
                        <p className="text-zinc-500 text-xs">{totalReports} Analist Raporu</p>
                    </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-lg border font-medium ${getRecommendationColor(latestReport.hf_desc)}`}>
                    {latestReport.hf_desc}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                    <span className="text-zinc-500 text-[10px] block mb-1">Ortalama</span>
                    <span className="text-white font-mono font-bold text-sm">₺{item.averageTarget.toFixed(2)}</span>
                </div>
                <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                    <span className="text-emerald-300 text-[10px] block mb-1">En Yüksek</span>
                    <span className="text-white font-mono font-bold text-sm">₺{item.highestTarget.toFixed(2)}</span>
                </div>
                <div className="bg-rose-900/20 p-3 rounded-lg border border-rose-500/20">
                    <span className="text-rose-300 text-[10px] block mb-1">En Düşük</span>
                    <span className="text-white font-mono font-bold text-sm">₺{item.lowestTarget.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-2 mb-4 relative z-10">
                <div className="flex justify-between text-xs text-zinc-500">
                    <span>Analist Konsensüsü</span>
                    <span className="text-white">{totalReports} Rapor</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(item.buyCount / totalReports) * 100}%` }} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${(item.holdCount / totalReports) * 100}%` }} className="bg-blue-500 h-full" />
                    <div style={{ width: `${(item.sellCount / totalReports) * 100}%` }} className="bg-rose-500 h-full" />
                </div>
                <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Al ({item.buyCount})</span>
                    <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Tut ({item.holdCount})</span>
                    {item.sellCount > 0 && <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Sat ({item.sellCount})</span>}
                </div>
            </div>

            <div className="text-xs text-zinc-500 mb-3 relative z-10">
                Son Rapor: <span className="text-zinc-400">{latestReport.analist}</span> • {latestReport.tarih}
            </div>

            <Link to={`/hedef-fiyat/${slugify(`${item.stockCode} Hedef Fiyat 2026`)}/`} className="w-full py-2.5 rounded-lg bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-sm font-medium text-zinc-300 transition-all border border-white/5 flex items-center justify-center gap-2 relative z-10">
                Detayları İncele <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

import SEO from '../components/SEO';

const HedefFiyat: React.FC = () => {
    const [data, setData] = useState<StockTargetData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'reports' | 'target'>('reports');

    useEffect(() => {
        // Fetch Halkarz target price data
        fetch('/halkarz_target_prices.json')
            .then(res => res.json())
            .then((jsonData: HalkarzTargetPrice[]) => {
                // Group by stock code
                const stockMap = new Map<string, HalkarzTargetPrice[]>();

                jsonData.forEach(report => {
                    const code = report.bistkodu;
                    if (!stockMap.has(code)) {
                        stockMap.set(code, []);
                    }
                    stockMap.get(code)!.push(report);
                });

                // Transform to aggregated data
                const aggregated: StockTargetData[] = Array.from(stockMap.entries()).map(([code, reports]) => {
                    const prices = reports.map(r => parseFloat(r.hf_fiyat.replace(',', '.')));

                    // Count recommendations
                    let buyCount = 0, holdCount = 0, sellCount = 0;
                    reports.forEach(r => {
                        const desc = r.hf_desc.toLowerCase();
                        if (desc.includes('al') || desc.includes('üstü')) buyCount++;
                        else if (desc.includes('tut') || desc.includes('nötr') || desc.includes('paralel')) holdCount++;
                        else if (desc.includes('sat') || desc.includes('azalt')) sellCount++;
                    });

                    return {
                        stockCode: code,
                        stockName: reports[0].sirket.replace(/^T\.\s*/, ''),
                        reports: reports,
                        averageTarget: prices.reduce((a, b) => a + b, 0) / prices.length,
                        highestTarget: Math.max(...prices),
                        lowestTarget: Math.min(...prices),
                        buyCount,
                        holdCount,
                        sellCount
                    };
                });

                // Sort by number of reports (most analyzed stocks first)
                aggregated.sort((a, b) => b.reports.length - a.reports.length);

                setData(aggregated);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading target prices:", err);
                setIsLoading(false);
            });
    }, []);

    const filteredData = data.filter(item =>
        item.stockCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stockName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'reports') return b.reports.length - a.reports.length;
        if (sortBy === 'target') return b.averageTarget - a.averageTarget;
        return 0;
    });

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Hedef fiyatlar ne kadar güvenilir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hedef fiyatlar, analistlerin mevcut verilere dayalı tahminleridir ve kesin değildir. Piyasa koşulları veya şirket performansındaki değişiklikler hedef fiyatların tutmamasına neden olabilir."
                }
            },
            {
                "@type": "Question",
                "name": "Hedef fiyat yüksekse hemen almalı mıyım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hayır. Yüksek hedef fiyat tek başına alım sinyali değildir. Hissenin mevcut değerlemesi, şirketin temelleri ve genel piyasa koşullarını da değerlendirmelisiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Analist konsensüsü neden önemli?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tek bir analist görüşü öznel olabilir, ancak birden fazla bağımsız analistin ortak görüşü (konsensüs) daha objektif bir perspektif sunar ve yatırım kararlarında daha güvenilir bir referanstır."
                }
            },
            {
                "@type": "Question",
                "name": "Hedef fiyat ne kadar sürede gerçekleşir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Çoğu hedef fiyat tahmini 6-12 aylık bir zaman dilimi için yapılır. Analist raporunda belirtilen vadeye dikkat etmek önemlidir."
                }
            }
        ]
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SEO
                title="Borsa Hedef Fiyatlar 2026 - Hisse Analiz ve Tahminler"
                description="BIST hisse senetleri için güncel hedef fiyat tahminleri, aracı kurum raporları ve 2026 borsa beklentileri. Uzman analist yorumlarını inceleyin."
                canonicalUrl="https://yatirimx.com/hedef-fiyat/"
                keywords="hedef fiyatlar, hisse hedef fiyat 2026, borsa tahminleri, hisse senetleri, analist tavsiyeleri, al sat tut, borsa istanbul"
                schema={faqSchema}
            />


            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        Hedef Fiyatlar
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            Canlı Veri
                        </span>
                    </h1>
                    <p className="text-zinc-400 max-w-xl">
                        Bankalar ve aracı kurumların BIST hisseleri için yayınladığı en güncel hedef fiyat tahminleri ve potansiyel getiri analizleri.
                    </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Hisse ara..."
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500/50 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-zinc-900 border border-white/10 px-3 py-2.5 rounded-lg text-sm text-white focus:border-blue-500/50 outline-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'reports' | 'target')}
                    >
                        <option value="reports">En Çok Analiz</option>
                        <option value="target">Hedef Fiyat</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 mt-4">Hedef fiyatlar yükleniyor...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedData.map((item) => (
                            <TargetCard key={item.stockCode} item={item} />
                        ))}
                    </div>

                    {sortedData.length === 0 && (
                        <div className="text-center py-20 text-zinc-500">
                            Aradığınız kriterlere uygun hisse bulunamadı.
                        </div>
                    )}
                </>
            )}

            {/* Info & FAQ Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" /> Hedef Fiyat Hakkında Bilgiler
                        </h3>
                        <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                            <p>
                                <span className="text-white font-bold">Hedef Fiyat Nedir?</span><br />
                                Hedef fiyat, analistlerin ve aracı kurumların detaylı finansal analizler sonucunda bir hisse senedinin belirli bir zaman diliminde (genellikle 6-12 ay) ulaşabileceğini öngördüğü fiyat seviyesidir. Bu tahminler, şirketin finansal performansı, sektör dinamikleri, makroekonomik faktörler ve piyasa koşulları göz önünde bulundurularak yapılır.
                            </p>
                            <p>
                                <span className="text-white font-bold">Analist Tavsiyeleri (Al/Tut/Sat)</span><br />
                                <span className="text-emerald-400">AL:</span> Analist, hissenin mevcut fiyatının hedef fiyatın altında olduğunu ve yükseliş potansiyeli taşıdığını düşünüyor.<br />
                                <span className="text-blue-400">TUT:</span> Hisse adil değerinde veya yakınında işlem görüyor, önemli bir hareket beklentisi yok.<br />
                                <span className="text-rose-400">SAT:</span> Hisse hedef fiyatın üzerinde, düşüş riski var veya başka fırsatlar daha cazip.
                            </p>
                            <p>
                                <span className="text-white font-bold">Analist Konsensüsü</span><br />
                                Bir hisse için birden fazla analist raporu varsa, bu raporların ortalaması "konsensüs" olarak adlandırılır. Konsensüs, piyasanın genel beklentisini yansıtır ve tek bir analist görüşünden daha güvenilir kabul edilir.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" /> Sıkça Sorulan Sorular
                    </h3>
                    <FAQItem
                        question="Hedef fiyatlar ne kadar güvenilir?"
                        answer="Hedef fiyatlar, analistlerin mevcut verilere dayalı tahminleridir ve kesin değildir. Piyasa koşulları, beklenmedik gelişmeler veya şirket performansındaki değişiklikler hedef fiyatların tutmamasına neden olabilir. Bu nedenle hedef fiyatları tek başına değil, kendi analizinizle birlikte değerlendirmelisiniz."
                    />
                    <FAQItem
                        question="Hedef fiyat yüksekse hemen almalı mıyım?"
                        answer="Hayır. Yüksek hedef fiyat tek başına alım sinyali değildir. Hissenin mevcut değerlemesi, şirketin temelleri, sektör durumu ve genel piyasa koşullarını da değerlendirmelisiniz. Ayrıca, hedef fiyatın hangi zaman dilimi için verildiğini ve analistin geçmiş başarı oranını da göz önünde bulundurmalısınız."
                    />
                    <FAQItem
                        question="Farklı kurumların hedef fiyatları çok farklıysa ne yapmalıyım?"
                        answer="Hedef fiyatlarda büyük farklılıklar olması normaldir, çünkü her analist farklı varsayımlar ve metodolojiler kullanır. Bu durumda ortalama hedef fiyata (konsensüs) bakabilir veya en güvenilir bulduğunuz kurumların raporlarına odaklanabilirsiniz. Geniş bir aralık, hisse hakkında belirsizlik olduğunu gösterebilir."
                    />
                    <FAQItem
                        question="Hedef fiyat ne kadar sürede gerçekleşir?"
                        answer="Çoğu hedef fiyat tahmini 6-12 aylık bir zaman dilimi için yapılır. Ancak bu süre analist raporunda açıkça belirtilmelidir. Bazı hedef fiyatlar daha kısa (3-6 ay) veya daha uzun (12-18 ay) vadeli olabilir. Zaman dilimini bilmeden hedef fiyatı değerlendirmek yanıltıcı olabilir."
                    />
                    <FAQItem
                        question="Analist konsensüsü neden önemli?"
                        answer="Tek bir analist görüşü öznel olabilir, ancak birden fazla bağımsız analistin ortak görüşü (konsensüs) daha objektif bir perspektif sunar. Konsensüs, piyasanın genel beklentisini yansıtır ve yatırım kararlarınızda daha güvenilir bir referans noktası olabilir."
                    />
                    <FAQItem
                        question="'Al' tavsiyesi olan her hisseyi almalı mıyım?"
                        answer="Hayır. 'Al' tavsiyesi, analistin o hissenin yükseliş potansiyeli gördüğü anlamına gelir, ancak bu sizin risk profilinize, portföy stratejinize veya yatırım hedeflerinize uygun olmayabilir. Ayrıca, tavsiyenin verildiği tarih, güncel piyasa fiyatı ve şirketin son durumu da önemlidir. Her zaman kendi araştırmanızı yapın."
                    />
                </div>
            </div>
        </div>
    );
};

export default HedefFiyat;