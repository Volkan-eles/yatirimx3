import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, TrendingUp, Menu, X, BarChart3, PieChart, Calendar, Briefcase, ChevronRight, Layers, Settings, Command, Home as HomeIcon, LineChart, Building2, BookOpen, Star } from 'lucide-react';
import Footer from './Footer';
import { slugify } from '../utils/slugify';

// Market Status Helper
const getMarketStatus = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const min = now.getMinutes();
  const time = hour * 60 + min;

  // Weekend
  if (day === 0 || day === 6) return { isOpen: false, text: 'KAPALI (HAFTA SONU)', nextOpen: 'Pazartesi 10:00' };

  // Weekday Market Hours (10:00 - 18:00)
  const marketOpen = 10 * 60;
  const marketClose = 18 * 60;

  if (time >= marketOpen && time < marketClose) return { isOpen: true, text: 'PİYASALAR AÇIK', nextOpen: null };
  if (time < marketOpen) return { isOpen: false, text: 'KAPALI', nextOpen: 'Bugün 10:00' };
  return { isOpen: false, text: 'KAPALI', nextOpen: 'Yarın 10:00' };
};

const marketStatus = getMarketStatus();

// Ticker Items (Mock Data for Ticker)
const tickerItems = [
  { symbol: 'XU100', value: '8,790.25', change: 1.25 },
  { symbol: 'USD/TRY', value: '32.15', change: 0.12 },
  { symbol: 'EUR/TRY', value: '35.40', change: -0.05 },
  { symbol: 'GAU/TRY', value: '2,450', change: 0.8 },
  { symbol: 'BRENT', value: '85.40', change: 1.1 },
  { symbol: 'BTC/USD', value: '64,200', change: 2.5 },
];

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: any;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon: Icon, active }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 group whitespace-nowrap ${active
      ? 'text-white'
      : 'text-zinc-400 hover:text-white'
      }`}
  >
    {active && (
      <>
        <span className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"></span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
      </>
    )}
    <Icon className={`w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
    <span className="relative z-10">{children}</span>
  </Link>
);

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [allStocks, setAllStocks] = useState<any[]>([]);

  // Fetch stocks for search
  useEffect(() => {
    fetch('/bist_live_data.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.stocks) {
          setAllStocks(data.stocks);
        }
      })
      .catch(err => console.error('Error loading stocks for search:', err));
  }, []);

  // Filter stocks based on search query
  const filteredStocks = allStocks.filter(stock =>
    stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 results

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowResults(false); // Close search results on navigation
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const desktopLinks = [
    { name: 'Ana Sayfa', path: '/', icon: HomeIcon },
    { name: 'İzleme Listesi', path: '/izleme-listesi', icon: Star },
    { name: 'Hedef Fiyat', path: '/hedef-fiyat', icon: TrendingUp },

    { name: 'Sermaye', path: '/sermaye-artirimi', icon: Layers },
    { name: 'Temettü', path: '/temettu-takvimi-2026', icon: PieChart },
    { name: 'Halka Arz', path: '/halka-arz', icon: Calendar },
    { name: 'Kurumlar', path: '/araci-kurumlar', icon: Briefcase },
    { name: 'Blog', path: '/blog', icon: BookOpen },
  ];

  const mobileMenuGroups = [
    {
      title: "Genel Bakış",
      items: [
        { name: 'Ana Sayfa', path: '/', icon: HomeIcon },
        { name: 'İzleme Listesi', path: '/izleme-listesi', icon: Star },
        { name: 'Blog', path: '/blog', icon: BookOpen }
      ]
    },
    {
      title: "Analiz Araçları",
      items: [
        { name: 'Hedef Fiyatlar', path: '/hedef-fiyat', icon: LineChart },

        { name: 'Aracı Kurumlar', path: '/araci-kurumlar', icon: Building2 },
      ]
    },
    {
      title: "Şirket Verileri",
      items: [
        { name: 'Halka Arz Takvimi', path: '/halka-arz', icon: Calendar },
        { name: 'Temettü Dağıtımları', path: '/temettu-takvimi-2026', icon: PieChart },
        { name: 'Sermaye Artırımları', path: '/sermaye-artirimi', icon: Layers },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
      {/* Ticker Tape */}
      <div className="bg-black border-b border-white/5 h-8 overflow-hidden relative flex items-center">
        <div className="absolute left-0 top-0 bottom-0 bg-black z-20 px-3 flex items-center border-r border-white/10">
          <div className={`w-2 h-2 rounded-full mr-2 ${marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className={`text-[10px] font-bold tracking-wider ${marketStatus.isOpen ? 'text-emerald-500' : 'text-zinc-500'}`}>
            {marketStatus.text}
          </span>
        </div>

        <div className="animate-[scroll_30s_linear_infinite] flex items-center gap-8 whitespace-nowrap pl-32">
          {/* Duplicate content for seamless loop */}
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="font-bold text-zinc-300">{item.symbol}</span>
              <span className="text-white">{item.value}</span>
              <span className={item.change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                {item.change >= 0 ? '+' : ''}%{item.change}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Navbar */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-4 h-4 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none tracking-tight text-white font-display">YatirimX</span>
              <span className="text-[9px] text-zinc-500 font-medium tracking-[0.2em] uppercase mt-0.5">Terminal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-900/40 backdrop-blur-md p-1 rounded-xl border border-white/5 shadow-xl shadow-black/20 ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300">
            {desktopLinks.map((link) => (
              <NavLink key={link.path} to={link.path} icon={link.icon} active={location.pathname === link.path}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-zinc-900/50 border border-white/10 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-40 lg:w-48 group cursor-text relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Hisse Ara..."
                className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-600 w-full ml-2 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
              <div className="hidden group-focus-within:flex items-center gap-1">
                <Command className="w-3 h-3 text-zinc-600" />
                <span className="text-[10px] text-zinc-600 font-bold">K</span>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchQuery.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map(stock => (
                      <Link
                        key={stock.code}
                        to={`/hisse/${slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`)}`}
                        className="flex items-center justify-between p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group"
                        onClick={() => {
                          setSearchQuery('');
                          setShowResults(false);
                        }}
                      >
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-blue-400 transition-colors">{stock.code}</div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">{stock.name}</div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{stock.price}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-zinc-500">Sonuç bulunamadı.</div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button Mask (invisible overlay to close search) */}
            {showResults && (
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowResults(false)}></div>
            )}

            <div className="h-6 w-px bg-white/10 hidden md:block mx-1"></div>

            {/* Mobile Menu Button - Show on LG screens and below now */}
            <button
              className="xl:hidden p-2 text-zinc-400 hover:text-white relative z-50 hover:bg-white/5 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-500 xl:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 bg-[#09090b]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) xl:hidden transform flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <span className="font-bold text-lg text-white">Menü</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {mobileMenuGroups.map((group, idx) => (
            <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                {group.title}
                <div className="h-px bg-zinc-800 flex-1"></div>
              </h4>
              <div className="space-y-1">
                {group.items.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all group ${location.pathname === link.path
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${location.pathname === link.path ? 'bg-blue-500/20' : 'bg-zinc-800'}`}>
                        <link.icon className={`w-4 h-4 ${location.pathname === link.path ? 'text-blue-400' : 'text-zinc-400'}`} />
                      </div>
                      <span className="font-medium text-sm">{link.name}</span>
                    </div>
                    {location.pathname === link.path && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Uygulama Ayarları</span>
          </button>
          <div className="mt-4 text-center text-[10px] text-zinc-600">
            YatirimX Mobile v2.0.4
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}