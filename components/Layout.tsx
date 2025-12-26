import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, TrendingUp, Menu, X, BarChart3, PieChart, Calendar, Briefcase, ChevronRight, Layers, Bell, Settings, Command, Home as HomeIcon, LineChart, Building2 } from 'lucide-react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: any;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon: Icon, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${active
      ? 'text-white'
      : 'text-zinc-400 hover:text-zinc-100'
      }`}
  >
    {active && (
      <span className="absolute inset-0 bg-white/5 rounded-lg border border-white/5 shadow-sm"></span>
    )}
    <Icon className={`w-4 h-4 relative z-10 ${active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
    <span className="relative z-10">{children}</span>
  </Link>
);

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
    { name: 'Hedef Fiyat', path: '/hedef-fiyat', icon: TrendingUp },

    { name: 'Sermaye', path: '/sermaye-artirimi', icon: Layers },
    { name: 'Temettü', path: '/temettu', icon: PieChart },
    { name: 'Halka Arz', path: '/halka-arz', icon: Calendar },
    { name: 'Kurumlar', path: '/araci-kurumlar', icon: Briefcase },
  ];

  const mobileMenuGroups = [
    {
      title: "Genel Bakış",
      items: [
        { name: 'Ana Sayfa', path: '/', icon: HomeIcon }
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
        { name: 'Temettü Dağıtımları', path: '/temettu', icon: PieChart },
        { name: 'Sermaye Artırımları', path: '/sermaye-artirimi', icon: Layers },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-white font-display">YatirimX</span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase mt-1">Terminal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 shadow-inner shadow-black/20">
            {desktopLinks.map((link) => (
              <NavLink key={link.path} to={link.path} icon={link.icon} active={location.pathname === link.path}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-56 group cursor-text">
              <Search className="w-3.5 h-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Hızlı Arama..."
                className="bg-transparent border-none outline-none text-xs text-zinc-200 placeholder-zinc-600 w-full ml-2 font-medium"
              />
              <div className="hidden group-focus-within:flex items-center gap-1">
                <Command className="w-3 h-3 text-zinc-600" />
                <span className="text-[10px] text-zinc-600 font-bold">K</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden md:block mx-1"></div>

            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-black"></span>
            </button>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden md:block">
              <Settings className="w-5 h-5" />
            </button>

            <button
              className="lg:hidden p-2 text-zinc-400 hover:text-white relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 bg-zinc-950 border-l border-white/10 shadow-2xl transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) lg:hidden transform flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${location.pathname === link.path
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm shadow-blue-900/10'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
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
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-1.5">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-bold text-xl text-white tracking-tight">YatirimX</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Yapay zeka destekli algoritmalar ve gerçek zamanlı veri akışı ile finansal özgürlüğünüze giden yolda en güçlü partneriniz.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm w-full md:w-auto">
              <div>
                <h4 className="text-white font-bold mb-4">Platform</h4>
                <ul className="space-y-3 text-zinc-500">
                  <li><Link to="/" className="hover:text-blue-400 transition-colors">Ana Sayfa</Link></li>
                  <li><Link to="/hedef-fiyat" className="hover:text-blue-400 transition-colors">Hedef Fiyatlar</Link></li>
                  <li><Link to="/temettu" className="hover:text-blue-400 transition-colors">Temettü Takvimi</Link></li>
                  <li><Link to="/halka-arz" className="hover:text-blue-400 transition-colors">Halka Arzlar</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Kurumsal</h4>
                <ul className="space-y-3 text-zinc-500">
                  <li><Link to="/hakkimizda" className="hover:text-blue-400 transition-colors">Hakkımızda</Link></li>
                  <li><Link to="/iletisim" className="hover:text-blue-400 transition-colors">İletişim</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Yasal</h4>
                <ul className="space-y-3 text-zinc-500">
                  <li><Link to="/kullanim-kosullari" className="hover:text-blue-400 transition-colors">Kullanım Koşulları</Link></li>
                  <li><Link to="/gizlilik-politikasi" className="hover:text-blue-400 transition-colors">Gizlilik Politikası</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 gap-4">
            <p>&copy; 2024 YatirimX Teknoloji A.Ş. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sistemler Operasyonel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}