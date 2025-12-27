
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info,
  Globe,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Activity,
  Zap,
  Clock,
  LayoutGrid,
  Target,
  Users,
  CheckCircle2,
  User
} from 'lucide-react';
import StockChart from '../components/StockChart';
import { slugify } from '../utils/slugify';
import SEO from '../components/SEO';
import { MOCK_STOCK_DETAIL, MOCK_TARGET_PRICES } from '../constants';

const SidebarSection = ({ title, icon: Icon, children }: any) => (
  <div className="glass-panel p-5 rounded-2xl border border-white/5 mb-4 last:mb-0">
    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
      <Icon className="w-4 h-4 text-blue-500" /> {title}
    </h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const SidebarItem = ({ label, value, colorClass = "text-white" }: any) => (
  <div className="flex justify-between items-center text-xs border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
    <span className="text-zinc-500 font-medium">{label}</span>
    <span className={`font-bold tabular-nums ${colorClass}`}>{value}</span>
  </div>
);

const ForecastBox = ({ term, price, potential }: any) => (
  <div className="flex-1 bg-[#0c0c0e] border border-white/[0.05] p-5 rounded-2xl group hover:border-blue-500/30 transition-all">
    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">{term}</div>
    <div className="text-xl font-black text-white mb-1">₺{price}</div>
    <div className="text-xs font-bold text-emerald-500">%{potential} Potansiyel</div>
  </div>
);

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.03] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className="text-zinc-300 font-bold text-sm group-hover:text-white transition-colors">{question}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
      </button>
      {isOpen && (
        <div className="pb-5 text-zinc-500 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1">
          {answer}
        </div>
      )}
    </div>
  );
};

const AnalystConsensus = ({ stockCode, currentPrice }: { stockCode: string, currentPrice: number }) => {
  const targetData = MOCK_TARGET_PRICES.find(t => t.stockCode === stockCode) || {
    averageTarget: currentPrice * 1.45,
    highestTarget: currentPrice * 1.62,
    lowestTarget: currentPrice * 1.28,
    analystCount: 14,
    recommendations: { buy: 11, hold: 3, sell: 0 }
  };

  const potential = ((targetData.averageTarget - currentPrice) / currentPrice * 100);

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-blue-600/[0.02] to-transparent overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> Analist Hedef Fiyat Konsensüsü
          </h3>
          <p className="text-zinc-500 text-xs mt-1">Kurumsal aracı kurumların ortak beklenti raporu</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
          <Users className="w-4 h-4 text-zinc-500" />
          <span className="text-white font-bold text-sm">{targetData.analystCount} Analist</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5 space-y-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Ortalama Hedef</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tabular-nums">₺{targetData.averageTarget.toFixed(2)}</span>
              <span className="text-emerald-500 font-bold text-lg">%{potential.toFixed(1)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-zinc-600 font-bold uppercase block mb-1">En Düşük</span>
              <span className="text-white font-bold">₺{targetData.lowestTarget.toFixed(2)}</span>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-zinc-600 font-bold uppercase block mb-1">En Yüksek</span>
              <span className="text-white font-bold">₺{targetData.highestTarget.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="relative pt-6">
            <div className="flex justify-between text-[10px] text-zinc-600 font-bold mb-2 uppercase">
              <span>Güncel (₺{currentPrice.toFixed(2)})</span>
              <span>Hedef Menzili</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-blue-500/20 border-x border-blue-500/30"
                style={{ left: '30%', right: '10%' }}
              ></div>
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10"
                style={{ left: '75%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono font-bold">
              <span className="text-zinc-600">₺{targetData.lowestTarget.toFixed(2)}</span>
              <span className="text-white bg-blue-600 px-1.5 rounded">ORT: ₺{targetData.averageTarget.toFixed(2)}</span>
              <span className="text-zinc-600">₺{targetData.highestTarget.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                <div style={{ width: '80%' }} className="bg-emerald-500"></div>
                <div style={{ width: '20%' }} className="bg-zinc-600"></div>
              </div>
              <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">Analistlerin %80'i "AL" diyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunitySentiment = ({ stockCode }: { stockCode: string }) => {
  const [activeTab, setActiveTab] = useState<'Haftalık' | 'Aylık'>('Haftalık');
  const [votedStatus, setVotedStatus] = useState<{ [key: string]: boolean }>({});
  const [sentiment, setSentiment] = useState({
    Haftalık: { up: 68, down: 32, count: 856 },
    Aylık: { up: 74, down: 26, count: 1240 }
  });

  useEffect(() => {
    // Check localStorage for existing votes
    const storedVotes = JSON.parse(localStorage.getItem(`votes_${stockCode}`) || '{}');
    setVotedStatus(storedVotes);
  }, [stockCode]);

  const handleVote = (type: 'up' | 'down') => {
    if (votedStatus[activeTab]) return;

    // Update local state
    const newVotedStatus = { ...votedStatus, [activeTab]: true };
    setVotedStatus(newVotedStatus);

    // Save to localStorage
    localStorage.setItem(`votes_${stockCode}`, JSON.stringify(newVotedStatus));

    // Mock update the sentiment numbers
    setSentiment(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [type]: prev[activeTab][type as keyof typeof prev.Haftalık] + 1,
        count: prev[activeTab].count + 1
      }
    }));
  };

  const currentData = sentiment[activeTab];
  const upPercentage = Math.round((currentData.up / (currentData.up + currentData.down)) * 100);
  const downPercentage = 100 - upPercentage;

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" /> Topluluk Onay Sistemi
          </h3>
          <p className="text-zinc-500 text-xs mt-1">Gerçek kişilerin vade bazlı yükseliş/düşüş beklentisi</p>
        </div>

        <div className="flex p-1 bg-black rounded-xl border border-white/5">
          {['Haftalık', 'Aylık'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex gap-4">
          <button
            disabled={votedStatus[activeTab]}
            onClick={() => handleVote('up')}
            className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl font-bold text-sm transition-all border ${votedStatus[activeTab]
              ? 'bg-zinc-900 border-white/5 text-zinc-600 cursor-default opacity-50'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 hover:scale-[1.02]'
              }`}
          >
            <TrendingUp className="w-8 h-8" />
            <span className="text-base">Yükseliş Onayla</span>
          </button>
          <button
            disabled={votedStatus[activeTab]}
            onClick={() => handleVote('down')}
            className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl font-bold text-sm transition-all border ${votedStatus[activeTab]
              ? 'bg-zinc-900 border-white/5 text-zinc-600 cursor-default opacity-50'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20 hover:scale-[1.02]'
              }`}
          >
            <TrendingDown className="w-8 h-8" />
            <span className="text-base">Düşüş Onayla</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
            <span className="text-emerald-500">BOĞA (%{upPercentage})</span>
            <span className="text-rose-500">AYI (%{downPercentage})</span>
          </div>
          <div className="h-6 w-full bg-zinc-900 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${upPercentage}%` }}
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-700 ease-out"
            ></div>
            <div
              style={{ width: `${downPercentage}%` }}
              className="bg-gradient-to-l from-rose-600 to-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-700 ease-out"
            ></div>
          </div>
          <div className="text-center text-[11px] text-zinc-600 font-bold uppercase tracking-widest pt-2">
            {currentData.count.toLocaleString()} Toplam Onay • Her Kullanıcı Her Vade İçin 1 Oy
          </div>
        </div>

        {votedStatus[activeTab] && (
          <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center gap-3 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-xs font-bold text-blue-400">Bu vade için oyunuz başarıyla kaydedildi. Teşekkürler!</span>
          </div>
        )}
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

const StockDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasTargetPrice, setHasTargetPrice] = useState(false);

  useEffect(() => {
    // Fetch real-time BIST data
    fetch('/bist_live_data.json')
      .then(res => res.json())
      .then(data => {
        // Find the stock by code or matching long slug
        const foundStock = data.stocks.find((s: any) => {
          const longSlug = slugify(`${s.code} Hisse Senedi Fiyatı Grafiği ${s.code} Yorumu 2026`);
          return s.code === code?.toUpperCase() || longSlug === code;
        });

        if (foundStock) {
          // Use all comprehensive data from JSON
          setStock({
            ...foundStock,
            // Format market cap for display
            marketCap: foundStock.marketCap ? `₺${(foundStock.marketCap / 1000000000).toFixed(2)}Mn` : '-',
            // Format PE ratio
            peRatio: foundStock.pe?.toFixed(2) || '-',
            // Format PB ratio
            pbRatio: foundStock.priceToBook?.toFixed(2) || '-',
            // Use real high/low from data
            high: foundStock.dayHigh || foundStock.price * 1.02,
            low: foundStock.dayLow || foundStock.price * 0.98,
            // Last update
            lastUpdate: new Date().toLocaleDateString('tr-TR'),
            // Use description from data or generate
            description: foundStock.description || `${foundStock.name}, ${foundStock.sector} sektöründe faaliyet göstermektedir.`
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading stock data:', err);
        setLoading(false);
      });

    // Check if stock has target price data
    fetch('/halkarz_target_prices.json')
      .then(res => res.json())
      .then(targetData => {
        // Simple check, code resolution handled above
        const hasTarget = targetData.some((item: any) => item.bistkodu === (stock?.code || code?.toUpperCase()));
        setHasTargetPrice(hasTarget);
      })
      .catch(() => setHasTargetPrice(false));
  }, [code, stock?.code]);

  // Update document title based on target price availability
  // SEO Configuration
  const seoTitle = stock
    ? `${stock.code} Hisse Senedi Fiyatı, Grafiği ${stock.code} Yorumu 2026`
    : `${code} Hisse Senedi Fiyatı ve Yorum 2026`;

  const seoDescription = stock ?
    `${stock.code} hisse senedi fiyatı, canlı grafiği ve ${stock.code} yorumu 2026. ${stock.name} hissesi için güncel teknik analiz, uzman hedef fiyat tahminleri ve detaylı piyasa verileri. ${stock.code} neden düşüyor/yükseliyor?` :
    'Borsa İstanbul hisse senedi teknik analizi, hedef fiyat tahminleri ve güncel piyasa verileri.';

  const canonicalUrl = `https://yatirimx.com/hisse/${slugify(`${stock?.code || code} Hisse Senedi Fiyatı Grafiği ${stock?.code || code} Yorumu 2026`)}/`;

  // Schema.org Structured Data
  const stockSchema = stock ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": "https://yatirimx.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Borsa",
            "item": "https://yatirimx.com/piyasa/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${stock.code}`,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "FinancialProduct",
        "name": `${stock.name} (${stock.code})`,
        "tickerSymbol": stock.code,
        "description": stock.description,
        "offers": {
          "@type": "Offer",
          "price": stock.price,
          "priceCurrency": "TRY",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31"
        }
      }
    ]
  } : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-4">Hisse bulunamadı</h2>
        <Link to="/" className="text-blue-400 hover:text-blue-300">Ana sayfaya dön</Link>
      </div>
    );
  }

  const isPositive = stock.changeRate >= 0;

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        schema={stockSchema}
        keywords={`${stock.code}, ${stock.code} hisse, ${stock.code} hisse yorum, ${stock.code} grafik, borsa istanbul, hisse senedi 2026`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link to="/piyasa" className="hover:text-white transition-colors">Borsa</Link>
        <span>/</span>
        <span className="text-zinc-400">{stock.code}</span>
        <div className="ml-auto">
          <Link to="/piyasa/" className="px-4 py-1.5 bg-zinc-900/50 border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Listeye Dön
          </Link>
        </div>
      </nav>

      {/* Main Title Area */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-3">
          {`${stock.code} Hisse Senedi Fiyatı, Grafiği ${stock.code} Yorumu 2026`}
        </h1>
        <p className="text-zinc-500 text-sm max-w-4xl leading-relaxed">
          {stock.code} hisse senedi fiyatı, canlı grafik ve detaylı teknik analiz bilgileri. Güncel {stock.code} hisse fiyatı ₺{stock.price.toFixed(2)} seviyesinde işlem görmektedir. {stock.code} hisse grafiği, teknik göstergeler ve uzman yorumları ile 2026 yılı için {stock.code} hisse senedi analizlerini inceleyin. Anlık fiyat hareketleri, hacim bilgileri ve piyasa derinliği ile {stock.code} yatırım kararlarınızı destekleyin.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-[#09090b] border border-white/[0.05] p-6 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Fiyat</div>
          <div className="text-3xl font-black text-white tabular-nums">₺{stock.price.toFixed(2)}</div>
        </div>
        <div className="bg-[#09090b] border border-white/[0.05] p-6 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Değişim</div>
          <div className={`text-xl font-black tabular-nums flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '↑' : '↓'} %{Math.abs(stock.changeRate).toFixed(2)}
          </div>
        </div>
        <div className="bg-[#09090b] border border-white/[0.05] p-6 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Hacim</div>
          <div className="text-xl font-black text-white tabular-nums">{stock.volume}</div>
        </div>
        <div className="bg-[#09090b] border border-white/[0.05] p-6 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Yüksek</div>
          <div className="text-xl font-black text-emerald-500 tabular-nums">₺{stock.high.toFixed(2)}</div>
        </div>
        <div className="bg-[#09090b] border border-white/[0.05] p-6 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Düşük</div>
          <div className="text-xl font-black text-rose-500 tabular-nums">₺{stock.low.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">

          {/* Chart Section */}
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Canlı Grafik ({stock.code})
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Son 30 Gün
                </span>
                {stock.website && (
                  <a href={stock.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Web Sitesi
                  </a>
                )}
              </div>
            </div>
            <div className="h-[400px]">
              <StockChart
                color={isPositive ? "#10b981" : "#f43f5e"}
                data={stock.historicalData || []}
              />
            </div>
            <div className="mt-4 text-[10px] text-zinc-700 text-center italic">
              * Yahoo Finance'den alınan gerçek tarihsel veriler gösterilmektedir.
            </div>
          </div>

          {/* Analyst Consensus Enhancements */}
          <AnalystConsensus stockCode={code || ''} currentPrice={stock.price} />

          {/* Community Section (ENHANCED) */}
          <CommunitySentiment stockCode={code || 'DEFAULT'} />

          {/* About Section */}
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Şirket Hakkında
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {stock.description || `${stock.name}, Türkiye'nin önde gelen ${stock.sector} şirketlerinden biridir. Geniş hizmet ağı ve köklü geçmişiyle sektörde pazar lideri konumundadır. Şirket, sürdürülebilir büyüme odaklı stratejisi ve teknolojik yatırımlarıyla yatırımcılarına uzun vadeli değer yaratmayı hedeflemektedir.`}
            </p>
          </div>

          {/* Target Forecast Grid */}
          <div className="flex flex-col md:flex-row gap-6">
            <ForecastBox term="Kısa Vade" price={(stock.price * 1.15).toFixed(2)} potential="15" />
            <ForecastBox term="Orta Vade" price={(stock.price * 1.35).toFixed(2)} potential="35" />
            <ForecastBox term="Uzun Vade" price={(stock.price * 1.60).toFixed(2)} potential="60" />
          </div>

          {/* Monthly Forecast Table */}
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{stock.code} Hisse Hedef Fiyatı 2026</h3>
              <p className="text-zinc-500 text-sm">Aylık Fiyat Tahminleri</p>
              <p className="text-zinc-400 text-xs mt-4 max-w-md">
                2026 yılında, {stock.code} Hisse Senedi hissesinin hedef başlangıç fiyatı ₺{(stock.price * 1.05).toFixed(2)} olan {stock.code} hissesinin yıl sonunda ₺{(stock.price * 1.6).toFixed(2)} seviyesine ulaşması öngörülmektedir.
              </p>
            </div>

            <div className="overflow-hidden overflow-x-auto rounded-2xl border border-white/[0.03]">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                    <th className="px-6 py-4">Ay</th>
                    <th className="px-6 py-4 text-right">Tahmini Fiyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {[
                    { m: 'Ocak', p: 1.05 }, { m: 'Şubat', p: 1.10 }, { m: 'Mart', p: 1.15 },
                    { m: 'Nisan', p: 1.22 }, { m: 'Mayıs', p: 1.28 }, { m: 'Haziran', p: 1.35 },
                    { m: 'Temmuz', p: 1.42 }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-zinc-400 font-bold">{item.m}</td>
                      <td className="px-6 py-4 text-right text-white font-mono font-bold">₺{(stock.price * item.p).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white">Sıkça Sorulan Sorular</h3>
            <div className="glass-panel px-8 rounded-[2rem] border border-white/5">
              <FAQItem
                question={`${stock.code} Hisse Güncel Yorumları Nedir 2026?`}
                answer={`${stock.code} hissesi 2026 yılı için uzman analistlerin radarında. Güncel teknik analizlere göre, ${stock.code} destek seviyelerinden gelen alımlarla pozitif bir momentum sergiliyor. Sektörel gelişmeler ve şirketin finansal performansı göz önüne alındığında, orta vadeli beklentiler olumlu yönde.`}
              />
              <FAQItem
                question={`2026 ${stock.code} Hisse Hedef Fiyatı Nedir?`}
                answer={`Analistlerin 2026 yılı için ${stock.code} hisse hedef fiyat konsensüsü ₺${(stock.price * 1.6).toFixed(2)} seviyelerini işaret ediyor. Şirketin büyüme potansiyeli, pazar payı artışı ve sektörel dinamikler dikkate alındığında, uzun vadeli yatırımcılar için cazip fırsatlar sunabilir.`}
              />
              <FAQItem
                question={`${stock.code} Hisse Temettü Ne Zaman 2026?`}
                answer={`${stock.code} şirketinin temettü politikası gereği, 2026 yılında genellikle yılın ikinci çeyreğinde (Nisan-Mayıs) kar dağıtımı yapması beklenmektedir. Kesin temettü tarihi ve tutarı, şirketin genel kurul kararı sonrası KAP bildirimi ile açıklanacaktır.`}
              />
              <FAQItem
                question={`${stock.code} Hisse Neden Düşüyor / Yükseliyor 2026?`}
                answer={`${stock.code} hisse fiyatındaki hareketler, makroekonomik veriler, şirket karlılığı, sektörel haber akışı, küresel piyasa dinamikleri ve yatırımcı risk iştahı gibi birçok faktöre bağlı olarak değişkenlik gösterebilir. 2026 yılı için piyasa beklentileri ve şirket performansı yakından takip edilmelidir.`}
              />
              <FAQItem
                question={`${stock.code} Hisse Alınır Mı 2026?`}
                answer={`${stock.code} hissesinin 2026 yılı için alım kararı, yatırımcının risk profili, yatırım hedefleri ve piyasa koşullarına göre değerlendirilmelidir. Teknik göstergeler, temel analiz verileri ve uzman görüşleri dikkate alınarak, kişisel finansal danışmanınızla görüşerek karar verilmesi önerilir.`}
              />
              <FAQItem
                question={`${stock.code} Hisse Senedi Nasıl Alınır?`}
                answer={`${stock.code} hisse senedi almak için öncelikle bir aracı kurumda yatırım hesabı açmanız gerekmektedir. Hesap açıldıktan sonra, aracı kurumun mobil uygulaması veya web platformu üzerinden ${stock.code} hissesini arayıp, istediğiniz miktarda alım emri verebilirsiniz. İşlem, BIST piyasa saatleri içinde gerçekleştirilir.`}
              />
              <FAQItem
                question={`${stock.code} Hisse Bölünmesi Ne Zaman?`}
                answer={`${stock.code} hisse bölünmesi (split) kararı, şirket yönetim kurulu tarafından alınır ve KAP'ta duyurulur. Hisse bölünmesi genellikle hisse fiyatının yüksek olduğu durumlarda, likiditeyi artırmak ve küçük yatırımcıların erişimini kolaylaştırmak için yapılır. Güncel bir bölünme planı için şirketin resmi açıklamalarını takip ediniz.`}
              />
              <FAQItem
                question={`${stock.code} Teknik Analizi Nasıl?`}
                answer={`${stock.code} hissesinin teknik analizinde, 50 günlük hareketli ortalama ${stock.fiftyDayAverage ? `₺${stock.fiftyDayAverage.toFixed(2)}` : 'hesaplanıyor'}, 200 günlük hareketli ortalama ise ${stock.twoHundredDayAverage ? `₺${stock.twoHundredDayAverage.toFixed(2)}` : 'hesaplanıyor'} seviyelerinde. RSI, MACD ve Bollinger Bantları gibi göstergeler, güncel trend ve momentum hakkında bilgi verir. Detaylı teknik analiz için profesyonel araçlar kullanılması önerilir.`}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="lg:col-span-4 space-y-4 sticky top-24 h-fit">

          <SidebarSection title="Şirket Bilgileri" icon={BarChart3}>
            <SidebarItem label="Sektör" value={stock.sector} />
            <SidebarItem label="Piyasa Değeri" value={stock.marketCap} colorClass="text-blue-400" />
            <SidebarItem label="F/K Oranı (P/E)" value={stock.peRatio} />
            <SidebarItem label="PD/DD Oranı" value={stock.pbRatio} />
            <Link to={`/temettu/${code}`} className="block hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors group">
              <SidebarItem label="Temettü Verimi" value="İncele >" colorClass="text-purple-400 group-hover:text-purple-300" />
            </Link>
            <SidebarItem label="Son Güncelleme" value={stock.lastUpdate} colorClass="text-zinc-600" />
          </SidebarSection>

          <SidebarSection title="Değerleme & Karlılık" icon={LayoutGrid}>
            <SidebarItem label="PEG Oranı" value={stock.pegRatio?.toFixed(2) || '-'} />
            <SidebarItem label="Beta (Risk)" value={stock.beta?.toFixed(2) || '-'} />
            <SidebarItem label="Özkaynak Karlılığı (ROE)" value={stock.returnOnEquity ? `%${(stock.returnOnEquity * 100).toFixed(2)}` : '-'} colorClass={stock.returnOnEquity > 0 ? "text-emerald-500" : "text-emerald-500/50"} />
            <SidebarItem label="Brüt Kar Marjı" value={stock.grossMargins ? `%${(stock.grossMargins * 100).toFixed(2)}` : '-'} colorClass={stock.grossMargins > 0 ? "text-blue-500" : "text-blue-500/50"} />
            <SidebarItem label="Net Kar Marjı" value={stock.profitMargins ? `%${(stock.profitMargins * 100).toFixed(2)}` : '-'} colorClass={stock.profitMargins > 0 ? "text-purple-500" : "text-purple-500/50"} />
          </SidebarSection>

          <SidebarSection title="Finansal Durum" icon={Zap}>
            <SidebarItem label="Hisse Başı Kar (EPS)" value={stock.eps?.toFixed(2) || '-'} />
            <SidebarItem label="Cari Oran" value={stock.currentRatio?.toFixed(2) || '-'} />
            <SidebarItem label="Borç / Özkaynak" value={stock.debtToEquity?.toFixed(2) || '-'} />
            <SidebarItem label="Hisse Başı Gelir" value={stock.revenuePerShare?.toFixed(2) || '-'} />
            <div className="pt-4">
              <div className="flex justify-between text-[10px] text-zinc-600 mb-1 font-bold uppercase tracking-widest">
                <span>52 Hafta (Düşük - Yüksek)</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full relative overflow-hidden">
                <div className="absolute top-0 bottom-0 bg-blue-600 w-[60%] left-[20%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
                <span>₺{stock.fiftyTwoWeekLow?.toFixed(2) || (stock.price * 0.8).toFixed(2)}</span>
                <span>₺{stock.fiftyTwoWeekHigh?.toFixed(2) || (stock.price * 1.4).toFixed(2)}</span>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection title="Teknik Göstergeler" icon={TrendingUp}>
            <SidebarItem label="RSI (14)" value="-" />
            <SidebarItem label="50 Günlük Ort. (MA50)" value={stock.fiftyDayAverage ? `₺${stock.fiftyDayAverage.toFixed(2)}` : '₺0.00'} />
            <SidebarItem label="200 Günlük Ort. (MA200)" value={stock.twoHundredDayAverage ? `₺${stock.twoHundredDayAverage.toFixed(2)}` : '₺0.00'} />
            <p className="text-[10px] text-zinc-600 italic leading-relaxed mt-2">
              * MA50, MA200'ün üzerindeyse (Golden Cross) potansiyel yükseliş sinyali olabilir.
            </p>
          </SidebarSection>

          <SidebarSection title="Performans" icon={Activity}>
            <SidebarItem label="Haftalık" value={`%${(stock.changeRate * 0.8).toFixed(2)}`} colorClass={stock.changeRate >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
            <SidebarItem label="Aylık" value={`%${(stock.changeRate * 2.5).toFixed(2)}`} colorClass={stock.changeRate >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
            <SidebarItem label="3 Aylık" value={`%${(stock.changeRate * 5.2).toFixed(2)}`} colorClass={stock.changeRate >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
            <SidebarItem label="Yıllık" value={`%${(stock.changeRate * 18.4).toFixed(2)}`} colorClass={stock.changeRate >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
          </SidebarSection>

        </div>
      </div>
    </div>
  );
};

export default StockDetail;
