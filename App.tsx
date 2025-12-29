import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy Load Pages for Performance
const Home = lazy(() => import('./pages/Home'));
const Borsa = lazy(() => import('./pages/Borsa'));
// Watchlist imported at line 23
const ComparePage = React.lazy(() => import('./pages/ComparePage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const StockDetail = lazy(() => import('./pages/StockDetail'));
const HedefFiyat = lazy(() => import('./pages/HedefFiyat'));
const HedefFiyatDetail = lazy(() => import('./pages/HedefFiyatDetail'));
const Temettu = lazy(() => import('./pages/Temettu'));
const TemettuDetail = lazy(() => import('./pages/TemettuDetail'));
const HalkaArz = lazy(() => import('./pages/HalkaArz'));
const HalkaArzDetail = lazy(() => import('./pages/HalkaArzDetail'));
const AraciKurumlar = lazy(() => import('./pages/AraciKurumlar'));
const BrokerDetail = lazy(() => import('./pages/BrokerDetail'));
const SermayeArtirimi = lazy(() => import('./pages/SermayeArtirimi'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Watchlist = lazy(() => import('./pages/Watchlist'));

// Legal and Corporate Pages - Lazy Loaded
const Hakkimizda = lazy(() => import('./pages/Hakkimizda'));
const Iletisim = lazy(() => import('./pages/Iletisim'));
const GizlilikPolitikasi = lazy(() => import('./pages/GizlilikPolitikasi'));
const KullanimKosullari = lazy(() => import('./pages/KullanimKosullari'));

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

            <Route path="/temettu-takvimi-2026" element={<Temettu />} />
            {/* Redirect old route */}
            <Route path="/temettu" element={<Navigate to="/temettu-takvimi-2026" replace />} />

            <Route path="/temettu/:code" element={<TemettuDetail />} />
            {/* Watchlist route already defined at line 55 */}
            <Route path="/karsilastir" element={<ComparePage />} />
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
    </Router>
  );
}

export default App;