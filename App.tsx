import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home'; // New Home page
import Borsa from './pages/Borsa';
import StockDetail from './pages/StockDetail';
import HedefFiyat from './pages/HedefFiyat';
import HedefFiyatDetail from './pages/HedefFiyatDetail';
import Temettu from './pages/Temettu';
import TemettuDetail from './pages/TemettuDetail';
import HalkaArz from './pages/HalkaArz';
import HalkaArzDetail from './pages/HalkaArzDetail';
import AraciKurumlar from './pages/AraciKurumlar';
import BrokerDetail from './pages/BrokerDetail';
import SermayeArtirimi from './pages/SermayeArtirimi';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

// Legal and Corporate Pages
import Hakkimizda from './pages/Hakkimizda';
import Iletisim from './pages/Iletisim';
import GizlilikPolitikasi from './pages/GizlilikPolitikasi';
import KullanimKosullari from './pages/KullanimKosullari';

import { About, Careers, Contact } from './pages/Corporate';
import { Terms, Privacy, Cookies } from './pages/Legal';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Set Home as root */}
          <Route path="/piyasa" element={<Borsa />} /> {/* Move Borsa to sub-route if needed, or remove */}
          <Route path="/hisse/:code" element={<StockDetail />} />
          <Route path="/hedef-fiyat" element={<HedefFiyat />} />
          <Route path="/hedef-fiyat/:code" element={<HedefFiyatDetail />} />
          <Route path="/sermaye-artirimi" element={<SermayeArtirimi />} />

          <Route path="/temettu-takvimi-2026" element={<Temettu />} />
          {/* Redirect old route to new SEO-friendly route */}
          <Route path="/temettu" element={<Navigate to="/temettu-takvimi-2026" replace />} />

          <Route path="/temettu/:code" element={<TemettuDetail />} />
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
      </Layout>
    </Router>
  );
}

export default App;