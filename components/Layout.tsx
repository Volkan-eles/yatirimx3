import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, TrendingUp, Menu, X, BarChart3, PieChart, Calendar, Briefcase, ChevronRight, Layers, Settings, Command, Home as HomeIcon, LineChart, Building2, BookOpen, Star, Coins, MessageSquare } from 'lucide-react';
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

interface NavDropdownProps {
  title: string;
  icon: any;
  active: boolean;
  items: { name: string; path: string; icon: any }[];
}

const NavDropdown: React.FC<NavDropdownProps> = ({ title, icon: Icon, active, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap ${active || isOpen ? 'text-white' : 'text-zinc-400 hover:text-white'
          }`}
      >
        {active && (
          <>
            <span className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"></span>
          </>
        )}
        <Icon className={`w-3.5 h-3.5 relative z-10 ${active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
        <span className="relative z-10">{title}</span>
        <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0 text-zinc-600'}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 mt-2 w-48 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl p-1 z-[100] transition-all duration-200 origin-top-left ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
        }`}>
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <item.icon className="w-4 h-4 text-zinc-500" />
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Keyboard Shortcut (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on '/' press
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Close on Esc
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setShowResults(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile menu groups
  const mobileMenuGroups = [
    {
      title: 'Ana Sayfa',
      items: [
        { name: 'Ana Sayfa', path: '/', icon: HomeIcon },
        { name: 'Canlı Borsa', path: '/piyasa', icon: TrendingUp },
      ]
    },
    {
      title: 'Piyasalar',
      items: [
        {
          name: 'Hisse Karşılaştır', path: '/karsilastir', icon: BarChart3
        },
        {
          name: 'Piyasa Haritası', path: '/', icon: PieChart
        },
        {
          name: 'Emtia', path: '/emtia', icon: Coins
        },
      ]
    },
    {
      title: 'Takvimler',
      items: [
        { name: 'Temettü Takvimi', path: '/temettu-takvimi-2026', icon: Calendar },
        { name: 'Halka Arz', path: '/halka-arz', icon: Briefcase },
        { name: 'Sermaye Artırımı', path: '/sermaye-artirimi', icon: Layers },
      ]
    },
    {
      title: 'Analiz',
      items: [
        { name: 'Hedef Fiyat', path: '/hedef-fiyat', icon: LineChart },
        { name: 'Aracı Kurumlar', path: '/araci-kurumlar', icon: Building2 },
      ]
    },
    {
      title: 'Diğer',
      items: [
        { name: 'Blog', path: '/blog', icon: BookOpen },
        { name: 'Forum', path: '/forum', icon: MessageSquare },
        { name: 'Favorilerim', path: '/izleme-listesi', icon: Star },
      ]
    }
  ];

  // Navigation links for desktop
  const navLinks = [
    { name: 'Ana Sayfa', path: '/', icon: HomeIcon },
    { name: 'Piyasa Haritası', path: '/piyasa-haritasi', icon: PieChart },
    { name: 'Emtia', path: '/emtia', icon: Coins },
    { name: 'İzleme Listesi', path: '/izleme-listesi', icon: Star },
    { name: 'Hisse Karşılaştır', path: '/karsilastir', icon: BarChart3 },
    { name: 'Temettü', path: '/temettu-takvimi-2026', icon: Calendar },
    { name: 'Halka Arz', path: '/halka-arz', icon: Briefcase },
    { name: 'Sermaye Artırımı', path: '/sermaye-artirimi', icon: Layers },
    { name: 'Hedef Fiyat', path: '/hedef-fiyat', icon: LineChart },
    { name: 'Aracı Kurumlar', path: '/araci-kurumlar', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all group-hover:scale-105">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                YatırımX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              <NavLink to="/" icon={HomeIcon} active={location.pathname === '/'}>
                Ana Sayfa
              </NavLink>

              {/* Piyasalar Dropdown */}
              <NavDropdown
                title="Piyasalar"
                icon={BarChart3}
                active={['/piyasa', '/piyasa-haritasi', '/emtia', '/karsilastir'].includes(location.pathname)}
                items={[
                  { name: 'Canlı Borsa', path: '/piyasa', icon: TrendingUp },
                  { name: 'Piyasa Haritası', path: '/piyasa-haritasi', icon: PieChart },
                  { name: 'Emtia', path: '/emtia', icon: Coins },
                  { name: 'Hisse Karşılaştır', path: '/karsilastir', icon: BarChart3 },
                ]}
              />

              {/* Takvimler Dropdown */}
              <NavDropdown
                title="Takvimler"
                icon={Calendar}
                active={['/temettu-takvimi-2026', '/halka-arz', '/sermaye-artirimi'].some(p => location.pathname.startsWith(p))}
                items={[
                  { name: 'Temettü Takvimi', path: '/temettu-takvimi-2026', icon: Calendar },
                  { name: 'Halka Arz', path: '/halka-arz', icon: Briefcase },
                  { name: 'Sermaye Artırımı', path: '/sermaye-artirimi', icon: Layers },
                ]}
              />

              {/* Analiz Dropdown */}
              <NavDropdown
                title="Analiz"
                icon={LineChart}
                active={['/hedef-fiyat', '/araci-kurumlar'].some(p => location.pathname.startsWith(p))}
                items={[
                  { name: 'Hedef Fiyat', path: '/hedef-fiyat', icon: LineChart },
                  { name: 'Aracı Kurumlar', path: '/araci-kurumlar', icon: Building2 },
                ]}
              />

              <NavLink to="/forum" icon={MessageSquare} active={location.pathname.startsWith('/forum')}>
                Forum
              </NavLink>

              <NavLink to="/izleme-listesi" icon={Star} active={location.pathname === '/izleme-listesi'}>
                İzleme Listesi
              </NavLink>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center bg-zinc-900/50 border border-white/10 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-40 lg:w-48 group cursor-text relative" onClick={() => searchInputRef.current?.focus()}>
                <Search className="w-3.5 h-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Hisse Ara..."
                  className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-600 w-full ml-2 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowResults(true)}
               <NavLink to="/forum" icon={MessageSquare} active={location.pathname.startsWith('/forum')}>
                  Forum
                </NavLink>
                <div className="hidden md:flex group-focus-within:hidden items-center gap-1 border border-white/10 rounded px-1.5 py-0.5 bg-white/5">
                  <span className="text-[9px] text-zinc-500 font-bold font-mono">/</span>
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
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-500 xl:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 bg-[#09090b]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) xl:hidden transform flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
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