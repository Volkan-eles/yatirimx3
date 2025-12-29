import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <SEO
                title="Sayfa Bulunamadı | YatırımX"
                description="Aradığınız sayfa bulunamadı."
            />

            <h1 className="text-6xl font-black text-blue-500 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-white mb-6">Sayfa Bulunamadı</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
                Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
            </p>

            <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
                <Home className="w-5 h-5" />
                Ana Sayfaya Dön
            </Link>
        </div>
    );
};

export default NotFound;
