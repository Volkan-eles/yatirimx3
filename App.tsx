import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

          <Route path="/temettu" element={<Temettu />} />
          <Route path="/temettu/:code" element={<TemettuDetail />} />
          <Route path="/halka-arz" element={<HalkaArz />} />
          <Route path="/halka-arz/:code" element={<HalkaArzDetail />} />
          <Route path="/araci-kurumlar" element={<AraciKurumlar />} />
          <Route path="/araci-kurum/:id" element={<BrokerDetail />} />

          {/* Corporate Pages */}
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/kariyer" element={<Careers />} />
          <Route path="/iletisim" element={<Contact />} />

          {/* Legal Pages */}
          <Route path="/kullanim-kosullari" element={<Terms />} />
          <Route path="/gizlilik-politikasi" element={<Privacy />} />
          <Route path="/cerezler" element={<Cookies />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;