
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Activity,
  Zap,
  Award,
  Calendar,
  PieChart,
  Briefcase,
  Layers,
  Flame,
  Gauge,
  ArrowRight
} from 'lucide-react';
import { MOCK_IPOS } from '../constants';
import { slugify } from '../utils/slugify';

interface StockData {
  code: string;
  name: string;
  price: number;
  changeRate: number;
  volume: string;
  sector: string;
  targetPrice?: number;
  recommendation?: string;
}

import SEO from '../components/SEO';
import MarketHeatmap from '../components/MarketHeatmap';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'Tümü' | 'Yükselenler' | 'Hacim'>('Tümü');
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real-time BIST stock data from Yahoo Finance
    fetch('/bist_live_data.json')
      .then(res => res.json())
      .then(data => {
        // Use real-time BIST data
        const stockData: StockData[] = data.stocks.map((item: any) => ({
          code: item.code,
          name: item.name,
          price: item.price,
          changeRate: item.changeRate,
          volume: item.volume,
          sector: item.sector || 'Diğer',
          targetPrice: 0,
          recommendation: ''
        }));

        setStocks(stockData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading BIST data:', err);
        setLoading(false);
      });
  }, []);

  let displayedStocks = stocks.filter(stock =>
    stock.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filter === 'Yükselenler') {
    displayedStocks = [...displayedStocks].sort((a, b) => b.changeRate - a.changeRate);
  } else if (filter === 'Hacim') {
    displayedStocks = [...displayedStocks].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
  }

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "YatırımX",
        "url": "https://yatirimx.com/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://yatirimx.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "YatırımX",
        "url": "https://yatirimx.com/",
        "logo": "https://yatirimx.com/logo.png",
        "sameAs": [
          "https://twitter.com/yatirimx",
          "https://instagram.com/yatirimx"
        ]
      }
    ]
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto selection:bg-accent selection:text-white">
      <SEO
        title="Borsa İstanbul Canlı Veriler, Hedef Fiyatlar ve Temettü Takvimi | YatırımX"
        description="BIST hisse senedi fiyatlarını canlı takip edin, uzman hedef fiyat tahminlerini, temettü takvimini ve güncel piyasa analizlerini YatırımX ile inceleyin."
        canonicalUrl="https://yatirimx.com/"
        schema={homeSchema}
      />

      {/* Page Header Area */}
      <div className="pt-8 pb-4">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Borsa İstanbul</h1>
        <p className="text-zinc-500 text-sm">Canlı hisse senedi fiyatları ve piyasa verileri</p>
      </div>

      {/* Terminal Container */}
      <div className="glass-panel rounded-3xl border border-white/[0.05] shadow-2xl overflow-hidden bg-[#09090b] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 animate-slide-up [animation-delay:100ms]">

        {/* Table Controls (Search & Filters) */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/[0.03]">
          <div className="relative w-full md:w-[60%] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Hisse kodu veya şirket adı ara..."
              className="w-full bg-[#0c0c0e] border border-white/[0.05] rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-300 focus:border-blue-500/50 outline-none transition-all placeholder-zinc-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilter(filter === 'Yükselenler' ? 'Tümü' : 'Yükselenler')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${filter === 'Yükselenler'
                ? 'bg-blue-600/10 border-blue-600/30 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#121214] border-white/[0.05] text-zinc-400 hover:text-white'
                }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> En Çok Artanlar
            </button>
            <button
              onClick={() => setFilter(filter === 'Hacim' ? 'Tümü' : 'Hacim')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${filter === 'Hacim'
                ? 'bg-blue-600/10 border-blue-600/30 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                : 'bg-[#121214] border-white/[0.05] text-zinc-400 hover:text-white'
                }`}
            >
              <Activity className="w-3.5 h-3.5" /> Hacim Liderleri
            </button>
          </div>
        </div>

        {/* Stock Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500 text-sm">Borsa verileri yükleniyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-zinc-600 uppercase font-bold tracking-wider border-b border-white/[0.03]">
                  <th className="px-8 py-4">Hisse Kodu</th>
                  <th className="px-6 py-4">Fiyat</th>
                  <th className="px-6 py-4">Değişim</th>
                  <th className="px-6 py-4">Hacim</th>
                  <th className="px-6 py-4">Sektör</th>
                  <th className="px-6 py-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {displayedStocks.map((stock) => {
                  const isPositive = stock.changeRate >= 0;
                  return (
                    <tr key={stock.code} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm tracking-wide group-hover:text-blue-400 transition-colors uppercase">
                            {stock.code}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-medium truncate max-w-[150px]">{stock.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-white font-mono font-bold text-sm tabular-nums">
                          ₺{stock.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black w-20 justify-center tabular-nums ${isPositive
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                          }`}>
                          {isPositive ? '↑' : '↓'} %{Math.abs(stock.changeRate).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-zinc-400 text-sm font-medium">{stock.volume}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-zinc-500 text-xs font-medium">{stock.sector}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/hisse/${slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`)}/`} className="p-2 text-zinc-600 hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Heatmap Section */}
      <MarketHeatmap />

      {/* Advanced Insights Section (Placed below for more context) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Sentiment Gauge */}
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-zinc-900/50 to-black relative overflow-hidden animate-slide-up [animation-delay:200ms] group hover:border-blue-500/20 transition-all duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-500" /> Analist Görüşü
              </h3>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md border border-emerald-500/20 uppercase">Pozitif</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-black text-white mb-2 tabular-nums">78</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Piyasa Skoru</div>
          </div>
          <p className="text-zinc-500 text-xs text-center mt-6">Aracı kurumların %65'i piyasa için "AL" yönünde görüş bildiriyor.</p>
        </div>

        {/* IPO Spotlight */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center animate-slide-up [animation-delay:300ms] group hover:border-white/10 transition-all duration-500">
          <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center shrink-0 shadow-2xl">
            <span className="text-black font-black text-xl">{MOCK_IPOS[0].code}</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-blue-400 text-[10px] font-black uppercase mb-2">Gündemdeki Halka Arz</div>
            <h4 className="text-white text-2xl font-bold mb-2">{MOCK_IPOS[0].company}</h4>
            <div className="text-zinc-500 text-sm flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {MOCK_IPOS[0].dates}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {MOCK_IPOS[0].distributionType}</span>
            </div>
          </div>
          <Link to="/halka-arz" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
            İncele <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Quick Access Modules */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up [animation-delay:400ms]">
        {[
          { title: 'Hedef Fiyatlar', icon: Zap, to: '/hedef-fiyat', color: 'emerald' },
          { title: 'Bilanço Takvimi', icon: Activity, to: '/bilanco-takvimi', color: 'blue' },
          { title: 'Temettü Verimi', icon: PieChart, to: '/temettu-takvimi-2026', color: 'purple' },
          { title: 'Model Portföy', icon: Award, to: '/araci-kurumlar', color: 'orange' },
        ].map((item, i) => (
          <Link key={i} to={item.to} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col items-center text-center">
            <div className={`p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all mb-4`}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{item.title}</span>
          </Link>
        ))}
      </section>

    </div>
  );
};

export default Home;
