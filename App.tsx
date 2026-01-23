import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';

import { lazyWithRetry } from './utils/lazyWithRetry';

// Lazy Load Pages for Performance
const Home = lazyWithRetry(() => import('./pages/Home'));
const Borsa = lazyWithRetry(() => import('./pages/Borsa'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const StockDetail = lazyWithRetry(() => import('./pages/StockDetail'));
const HedefFiyat = lazyWithRetry(() => import('./pages/HedefFiyat'));
const HedefFiyatDetail = lazyWithRetry(() => import('./pages/HedefFiyatDetail'));
const Temettu = lazyWithRetry(() => import('./pages/Temettu'));
const TemettuDetail = lazyWithRetry(() => import('./pages/TemettuDetail'));
const HalkaArz = lazyWithRetry(() => import('./pages/HalkaArz'));
const HalkaArzDetail = lazyWithRetry(() => import('./pages/HalkaArzDetail'));
const AraciKurumlar = lazyWithRetry(() => import('./pages/AraciKurumlar'));
const BrokerDetail = lazyWithRetry(() => import('./pages/BrokerDetail'));
const SermayeArtirimi = lazyWithRetry(() => import('./pages/SermayeArtirimi'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const BlogDetail = lazyWithRetry(() => import('./pages/BlogDetail'));
const Watchlist = lazyWithRetry(() => import('./pages/Watchlist'));
const MarketHeatmapPage = lazyWithRetry(() => import('./pages/MarketHeatmapPage'));
const Emtia = lazyWithRetry(() => import('./pages/Emtia'));
const EmtiaDetail = lazyWithRetry(() => import('./pages/EmtiaDetail'));

// Auth
const Login = lazyWithRetry(() => import('./pages/Login'));
const ResetPassword = lazyWithRetry(() => import('./pages/ResetPassword'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));
const Portfolio = lazyWithRetry(() => import('./pages/Portfolio'));
const Comparison = lazyWithRetry(() => import('./pages/Comparison'));

// Legal and Corporate Pages - Lazy Loaded
const Hakkimizda = lazyWithRetry(() => import('./pages/Hakkimizda'));
const Iletisim = lazyWithRetry(() => import('./pages/Iletisim'));
const GizlilikPolitikasi = lazyWithRetry(() => import('./pages/GizlilikPolitikasi'));
const KullanimKosullari = lazyWithRetry(() => import('./pages/KullanimKosullari'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/piyasa" element={<Borsa />} />
            <Route path="/izleme-listesi" element={<Watchlist />} />
            <Route path="/hisse/:symbol" element={<StockDetail />} />
            <Route path="/hedef-fiyat" element={<HedefFiyat />} />
            <Route path="/hedef-fiyat/:code" element={<HedefFiyatDetail />} />
            <Route path="/sermaye-artirimi" element={<SermayeArtirimi />} />

            {/* Auth Routes */}
            <Route path="/giris" element={<Login />} />
            <Route path="/reset-sifre" element={<ResetPassword />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/portfoy" element={<Portfolio />} />
            <Route path="/karsilastir" element={<Comparison />} />

            {/* Forum Routes Removed - Replaced by Stock Specific Discussions */}

            <Route path="/temettu-takvimi-2026" element={<Temettu />} />
            <Route path="/temettu/:code" element={<TemettuDetail />} />
            {/* Redirect old route */}
            <Route path="/temettu" element={<Navigate to="/temettu-takvimi-2026" replace />} />

            {/* Watchlist route already defined at line 65 */}
            {/* Removed duplicate Reference */}
            <Route path="/piyasa-haritasi" element={<MarketHeatmapPage />} />
            <Route path="/emtia" element={<Emtia />} />
            <Route path="/emtia/:slug" element={<EmtiaDetail />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/halka-arz" element={<HalkaArz />} />
            <Route path="/halka-arz/:code" element={<HalkaArzDetail />} />
            <Route path="/araci-kurumlar" element={<AraciKurumlar />} />
            <Route path="/araci-kurumlar/:id" element={<BrokerDetail />} />

            {/* Corporate Pages */}
            <Route path="/hakkimizda" element={<Hakkimizda />} />
            <Route path="/iletisim" element={<Iletisim />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />

            {/* Legal Pages */}
            <Route path="/kullanim-kosullari" element={<KullanimKosullari />} />
            <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </Router>
  );
}

export default App;