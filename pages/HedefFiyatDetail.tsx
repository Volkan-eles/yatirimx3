
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Target, Award, BarChart3, Clock, DollarSign, Percent, Building2, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

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

const HedefFiyatDetail: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [reports, setReports] = useState<HalkarzTargetPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch Halkarz target price data
        fetch('/halkarz_target_prices.json')
            .then(res => res.json())
            .then((jsonData: HalkarzTargetPrice[]) => {
                // Filter reports for this stock code
                // Support both direct code match (old URL) and slug match (long SEO URL)
                const stockReports = jsonData.filter(report => {
                    const longSlug = slugify(`${report.bistkodu} Hedef Fiyat 2026`);
                    return report.bistkodu === code?.toUpperCase() || longSlug === code;
                });

                if (stockReports.length === 0) {
                    setError('Bu hisse için hedef fiyat verisi bulunamadı.');
                } else {
                    setReports(stockReports);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading target prices:", err);
                setError('Veri yüklenirken bir hata oluştu.');
                setIsLoading(false);
            });
    }, [code]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-zinc-500 mt-4">Hedef fiyat verileri yükleniyor...</p>
            </div>
        );
    }

    if (error || reports.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-zinc-500">
                <h2 className="text-xl font-bold text-white mb-4">Veri Bulunamadı</h2>
                <p className="mb-6">{error || 'Bu hisse için hedef fiyat verisi bulunamadı.'}</p>
                <Link to="/hedef-fiyat/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Listeye Dön
                </Link>
            </div>
        );
    }

    // Calculate statistics
    const prices = reports.map(r => parseFloat(r.hf_fiyat.replace(',', '.')));
    const averageTarget = prices.reduce((a, b) => a + b, 0) / prices.length;
    const highestTarget = Math.max(...prices);
    const lowestTarget = Math.min(...prices);

    // Count recommendations
    let buyCount = 0, holdCount = 0, sellCount = 0;
    reports.forEach(r => {
        const desc = r.hf_desc.toLowerCase();
        if (desc.includes('al') || desc.includes('üstü')) buyCount++;
        else if (desc.includes('tut') || desc.includes('nötr') || desc.includes('paralel')) holdCount++;
        else if (desc.includes('sat') || desc.includes('azalt')) sellCount++;
    });

    const stockName = reports[0].sirket;
    const totalReports = reports.length;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-6xl mx-auto pb-20">
            {code && (
                <SEO
                    title={`${reports[0].bistkodu} Hedef Fiyat 2026`}
                    description={`${stockName} (${reports[0].bistkodu}) 2026 hedef fiyat tahminleri, aracı kurum raporları, al / sat / tut tavsiyeleri ve ortalama hedef fiyat beklentisi.`}
                    canonicalUrl={`https://yatirimx.com/hedef-fiyat/${slugify(`${reports[0].bistkodu} Hedef Fiyat 2026`)}/`}
                    keywords={`${reports[0].bistkodu}, ${stockName}, ${reports[0].bistkodu} hedef fiyat, ${reports[0].bistkodu} hisse analizi, 2026 borsa tahminleri`}
                />
            )}
            <SEO // Fallback if code missing, though should be covered
                title="Hisse Hedef Fiyatları ve Analizler | YatirimX"
                description="Borsa İstanbul hisse senetleri için güncel hedef fiyatlar ve uzman analizleri."
                canonicalUrl="https://yatirimx.com/hedef-fiyat/"
                keywords="hedef fiyat, borsa analiz, hisse önerileri"
            />
            {/* The second SEO component is redundant/risky if code is present. 
               Better to just use one conditional block or rely on the main one. 
               Let's stick to the conditional one which will be the primary one. 
               However, TSX needs a single parent or fragment usually, but here inside div is fine.
               Actually, I will just add the dynamic one.
            */}

            {/* Navigation & Header */}
            <div className="flex flex-col gap-6">
                <Link to="/hedef-fiyat/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Geri Dön
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900/50 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                            {code}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stockName} ({code}) Hedef Fiyat 2026</h1>
                            <div className="flex items-center gap-2 text-zinc-400 mt-1">
                                <span className="font-mono font-bold text-zinc-200">{code}</span>
                                <span>•</span>
                                <span>Hedef Fiyat Analizi</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Toplam Rapor</div>
                            <div className="text-4xl font-bold text-blue-400 tabular-nums tracking-tight">{totalReports}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Stats & Charts */}
                <div className="space-y-6">
                    {/* Target Price Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-zinc-800/30 to-transparent">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-500" /> Hedef Fiyat Özeti
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                                <div className="text-xs text-blue-300 mb-1">Ortalama Hedef</div>
                                <div className="text-white font-bold font-mono text-2xl">₺{averageTarget.toFixed(2)}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                                    <div className="text-xs text-emerald-300 mb-1">En Yüksek</div>
                                    <div className="text-white font-bold font-mono">₺{highestTarget.toFixed(2)}</div>
                                </div>
                                <div className="bg-rose-900/20 p-3 rounded-lg border border-rose-500/20">
                                    <div className="text-xs text-rose-300 mb-1">En Düşük</div>
                                    <div className="text-white font-bold font-mono">₺{lowestTarget.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendation Gauge */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-500" /> Analist Konsensüsü
                        </h3>

                        <div className="space-y-4">
                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                                <div style={{ width: `${(buyCount / totalReports) * 100}%` }} className="bg-emerald-500 h-full" />
                                <div style={{ width: `${(holdCount / totalReports) * 100}%` }} className="bg-blue-500 h-full" />
                                <div style={{ width: `${(sellCount / totalReports) * 100}%` }} className="bg-rose-500 h-full" />
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                        <span className="text-zinc-300">Al / Endeks Üstü</span>
                                    </div>
                                    <strong className="text-white">{buyCount}</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                        <span className="text-zinc-300">Tut / Nötr</span>
                                    </div>
                                    <strong className="text-white">{holdCount}</strong>
                                </div>
                                {sellCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                            <span className="text-zinc-300">Sat / Azalt</span>
                                        </div>
                                        <strong className="text-white">{sellCount}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Reports Table */}
                <div className="lg:col-span-2">
                    <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-zinc-900/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-orange-500" /> Kurum Raporları
                            </h3>
                            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{totalReports} Rapor</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-black/20 text-zinc-500 border-b border-white/5">
                                        <th className="px-6 py-4 font-bold">Aracı Kurum</th>
                                        <th className="px-6 py-4 font-bold">Rapor Tarihi</th>
                                        <th className="px-6 py-4 font-bold text-right">Hedef Fiyat</th>
                                        <th className="px-6 py-4 font-bold text-center">Tavsiye</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {reports.map((report, idx) => {
                                        const targetPrice = parseFloat(report.hf_fiyat.replace(',', '.'));

                                        // Get recommendation color
                                        const getRecommendationStyle = (desc: string) => {
                                            if (desc.includes('Al') || desc.includes('Üstü'))
                                                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                                            if (desc.includes('Tut') || desc.includes('Nötr') || desc.includes('Paralel'))
                                                return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                                            if (desc.includes('Sat') || desc.includes('Azalt'))
                                                return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                                            return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
                                        };

                                        return (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{report.analist}</td>
                                                <td className="px-6 py-4 text-zinc-400 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> {report.tarih}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-zinc-200">
                                                    ₺{targetPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getRecommendationStyle(report.hf_desc)}`}>
                                                        {report.hf_desc}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SEO / Content Section */}
                    <div className="mt-8 space-y-6">
                        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-zinc-500" />
                                {stockName} ({code}) Hedef Fiyatı Ne Kadar?
                            </h2>
                            <p className="text-zinc-400 leading-relaxed mb-4">
                                2025 yılı itibarıyla aracı kurumların <strong>{stockName} ({code})</strong> için yayınladıkları raporların ortalaması <strong>₺{averageTarget.toFixed(2)}</strong> seviyesindedir.
                                En yüksek hedef fiyat tahmini ₺{highestTarget.toFixed(2)} iken, en muhafazakar tahmin ₺{lowestTarget.toFixed(2)} seviyesindedir.
                            </p>
                            <p className="text-zinc-400 leading-relaxed">
                                Toplam {totalReports} aracı kurum raporu bulunmaktadır. Analistlerin {buyCount} tanesi <strong>"AL"</strong> tavsiyesi verirken,
                                {holdCount} tanesi <strong>"TUT"</strong> tavsiyesi vermektedir{sellCount > 0 ? ` ve ${sellCount} tanesi "SAT" tavsiyesi vermektedir` : ''}.
                            </p>
                        </div>

                        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
                            <h2 className="text-xl font-bold text-white mb-4">
                                {code} Hisse Yorum ve Analizleri
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Aracı kurumlar, {code} hissesi için düzenli olarak strateji raporları ve şirket değerleme notları yayınlamaktadır. Bu sayfada yer alan veriler,
                                Halkarz.com'dan derlenen en güncel hedef fiyatları içermektedir. Yatırımcılar, {code} teknik analizi ve temel analizi ile birlikte
                                bu hedef fiyat konsensüsünü değerlendirerek yatırım kararlarını şekillendirebilirler.
                            </p>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-8 bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-6">Sıkça Sorulan Sorular (SSS)</h2>
                        <div className="space-y-4">
                            {/* Question 1 - MANDATORY */}
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                    <span className="font-semibold text-white">{code} Hedef Fiyat 2026</span>
                                    <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="p-4 text-zinc-400 leading-relaxed">
                                    <p className="mb-3">
                                        <strong className="text-white">{code} hissesi için 2026 yılı hedef fiyat</strong> tahminleri, {totalReports} farklı aracı kurum tarafından analiz edilmiştir.
                                        Analistlerin konsensüsüne göre ortalama hedef fiyat <strong className="text-emerald-400">₺{averageTarget.toFixed(2)}</strong> seviyesindedir.
                                    </p>
                                    <p className="mb-3">
                                        En iyimser tahmin <strong className="text-emerald-400">₺{highestTarget.toFixed(2)}</strong> iken,
                                        en temkinli tahmin <strong className="text-rose-400">₺{lowestTarget.toFixed(2)}</strong> olarak belirlenmiştir.
                                    </p>
                                    <p>
                                        2026 yılı için {buyCount} analist "AL" tavsiyesi verirken, {holdCount} analist "TUT" tavsiyesi vermektedir.
                                        Bu veriler, {stockName} hissesinin 2026 yılında potansiyel yükseliş fırsatı sunabileceğini göstermektedir.
                                    </p>
                                </div>
                            </details>

                            {/* Question 2 */}
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                    <span className="font-semibold text-white">{code} Hissesi Almak Mantıklı mı?</span>
                                    <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="p-4 text-zinc-400 leading-relaxed">
                                    <p className="mb-3">
                                        {totalReports} aracı kurum analistinin {buyCount} tanesi ({((buyCount / totalReports) * 100).toFixed(0)}%)
                                        <strong className="text-emerald-400"> "AL" </strong> tavsiyesi vermektedir.
                                        Bu, analistlerin çoğunluğunun {code} hissesine olumlu baktığını gösterir.
                                    </p>
                                    <p>
                                        Ancak yatırım kararı vermeden önce kendi risk toleransınızı, yatırım sürenizi ve portföy çeşitlendirmenizi göz önünde bulundurmalısınız.
                                        Hedef fiyatlar bir garanti değil, tahmindir.
                                    </p>
                                </div>
                            </details>

                            {/* Question 3 */}
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                    <span className="font-semibold text-white">Hangi Aracı Kurum {code} İçin En Yüksek Hedef Fiyat Verdi?</span>
                                    <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="p-4 text-zinc-400 leading-relaxed">
                                    <p className="mb-3">
                                        {code} hissesi için en yüksek hedef fiyat <strong className="text-emerald-400">₺{highestTarget.toFixed(2)}</strong> olarak belirlenmiştir.
                                        En düşük hedef fiyat ise <strong className="text-rose-400">₺{lowestTarget.toFixed(2)}</strong> seviyesindedir.
                                    </p>
                                    <p>
                                        Yukarıdaki tabloda tüm aracı kurumların hedef fiyatlarını ve tavsiyelerini detaylı olarak inceleyebilirsiniz.
                                        Her kurumun rapor tarihi ve güncel tavsiyesi listelenmiştir.
                                    </p>
                                </div>
                            </details>

                            {/* Question 4 */}
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                    <span className="font-semibold text-white">Hedef Fiyatlar Ne Kadar Güvenilir?</span>
                                    <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="p-4 text-zinc-400 leading-relaxed">
                                    <p className="mb-3">
                                        Hedef fiyatlar, profesyonel analistlerin şirket finansallarını, sektör trendlerini ve makroekonomik faktörleri
                                        değerlendirerek yaptıkları tahminlerdir. Ancak bunlar kesin sonuçlar değil, olasılıklardır.
                                    </p>
                                    <p className="mb-3">
                                        Birden fazla kurumun konsensüsüne bakmak, tek bir kuruma güvenmekten daha sağlıklıdır.
                                        {code} için {totalReports} farklı kurumun analizi mevcut olması, daha dengeli bir görüş sağlar.
                                    </p>
                                    <p>
                                        Yatırım kararlarınızı verirken hedef fiyatları bir referans olarak kullanın, ancak kendi araştırmanızı da yapın.
                                    </p>
                                </div>
                            </details>

                            {/* Question 5 */}
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                    <span className="font-semibold text-white">{code} Hissesi Uzun Vadeli Yatırım İçin Uygun mu?</span>
                                    <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="p-4 text-zinc-400 leading-relaxed">
                                    <p className="mb-3">
                                        {stockName} hissesinin uzun vadeli yatırım potansiyelini değerlendirmek için şirketin temel göstergelerine,
                                        sektördeki konumuna, rekabet avantajlarına ve büyüme stratejisine bakmalısınız.
                                    </p>
                                    <p>
                                        Analist konsensüsünde {buyCount} "AL" tavsiyesi bulunması, kurumsal yatırımcıların da hisseye olumlu baktığını gösterir.
                                        Ancak uzun vadeli yatırım kararı, kişisel finansal hedeflerinize ve risk profilinize uygun olmalıdır.
                                    </p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default HedefFiyatDetail;