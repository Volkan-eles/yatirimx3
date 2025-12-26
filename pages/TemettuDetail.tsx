import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PieChart, Calendar, Wallet, TrendingUp, Info, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import FAQItem from '../components/FAQItem';

interface Dividend {
    t_bistkod: string;
    t_sirket: string;
    t_temt_net: string;
    t_yuzde: string;
    t_tarih: string;
    t_link: string;
    t_ok: string;
}

const TemettuDetail: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [dividend, setDividend] = useState<Dividend | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDividend = async () => {
            try {
                const response = await fetch('/temettu.json');
                if (response.ok) {
                    const data: Dividend[] = await response.json();
                    const found = data.find(d => d.t_bistkod === code);
                    setDividend(found || null);
                }
            } catch (error) {
                console.error("Error fetching dividend detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDividend();
    }, [code]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
                <p>Veriler yükleniyor...</p>
            </div>
        );
    }

    if (!dividend) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500">
                <div className="p-4 bg-zinc-900 rounded-full mb-4">
                    <Info className="w-12 h-12 text-zinc-700" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Temettü Verisi Bulunamadı</h2>
                <Link to="/temettu" className="text-purple-400 hover:underline">Listeye Dön</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
            <SEO
                title={`${dividend.t_sirket} (${dividend.t_bistkod}) Temettü Tarihi 2026 - Ne Kadar Verecek? | YatirimX`}
                description={`${dividend.t_sirket} (${dividend.t_bistkod}) 2026 temettü tarihi, hisse başı net temettü miktarı (${dividend.t_temt_net} TL), dağıtım oranı ve ödeme tarihi. ${dividend.t_bistkod} temettü verimliliği.`}
                keywords={`${dividend.t_bistkod}, ${dividend.t_sirket}, ${dividend.t_bistkod} temettü tarihi 2026, ${dividend.t_bistkod} ne kadar temettü verecek, temettü hesaplama`}
            />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/temettu" className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-lg text-white border border-white/10 shadow-lg">
                            {dividend.t_bistkod}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white leading-tight">{dividend.t_sirket}</h1>
                            <p className="text-zinc-500 text-sm">2026 Temettü Analizi ve Tahminleri</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-purple-900/10 to-zinc-900/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-purple-500" /> Pay Başına Net
                        </div>
                        <div className="text-4xl font-mono font-bold text-white tabular-nums">
                            {dividend.t_temt_net} <span className="text-lg text-zinc-500">TL</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:border-l md:border-white/5 md:pl-8">
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" /> Temettü Verimliliği
                        </div>
                        <div className="text-4xl font-bold text-emerald-400 tabular-nums">
                            %{dividend.t_yuzde}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 md:border-l md:border-white/5 md:pl-8">
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-500" /> Ödeme Tarihi
                        </div>
                        <div className="text-2xl font-bold text-white tabular-nums mt-1">
                            {dividend.t_tarih}
                        </div>
                        <div className="text-xs text-zinc-500">(Hak Kullanım)</div>
                    </div>
                </div>
            </div>

            {/* Content & FAQ */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <PieChart className="w-6 h-6 text-purple-500" />
                    {dividend.t_sirket} Temettü SSS (2026)
                </h2>

                <div className="space-y-4">
                    <FAQItem
                        question={`${dividend.t_sirket} (${dividend.t_bistkod}) temettü tarihi 2026 ne zaman?`}
                        answer={`${dividend.t_sirket} tarafından açıklanan kar dağıtım programına göre, 2026 yılı için temettü dağıtım tarihi (Hak Kullanım Tarihi) ${dividend.t_tarih} olarak belirlenmiştir. Yatırımcıların bu tarihten en az bir gün önce hisseye sahip olmaları gerekmektedir.`}
                    />
                    <FAQItem
                        question={`${dividend.t_sirket} 2026'da ne kadar temettü verecek?`}
                        answer={`${dividend.t_sirket}, hisse başına net ${dividend.t_temt_net} TL nakit kar payı ödemesi yapacaktır. Bu tutar, %10 stopaj kesintisi düşüldükten sonra yatırımcıların hesabına geçecek olan net miktardır.`}
                    />
                    <FAQItem
                        question={`${dividend.t_bistkod} temettü verimliliği ne kadar?`}
                        answer={`${dividend.t_sirket} hissesinin temettü verimliliği, açıklanan dağıtım tutarı ve dönemin hisse fiyatı baz alındığında yaklaşık %${dividend.t_yuzde} seviyesindedir. Temettü verimliliği, hisse fiyatındaki değişimlere göre güncellenebilir.`}
                    />
                    <FAQItem
                        question={`${dividend.t_sirket} temettü ödemesi ne zaman hesaba geçer?`}
                        answer={`Temettü ödemeleri, hak kullanım tarihi olan ${dividend.t_tarih} tarihinden 2 iş günü sonra (T+2) yatırım hesaplarına nakit olarak aktarılır. Ödemeler otomatik olarak gerçekleşir, herhangi bir işlem yapmanıza gerek yoktur.`}
                    />
                </div>
            </div>

        </div>
    );
};

export default TemettuDetail;
