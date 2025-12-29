import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

interface CapitalIncrease {
  code: string;
  company: string;
  type: string;
  rate: string;
  date: string;
  status: string;
  description: string;
}

const SermayeArtirimi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Bedelsiz' | 'Bedelli' | 'Tahsisli'>('Bedelsiz');
  const [data, setData] = useState<CapitalIncrease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/sermaye_artirimi.json');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => item.type === activeTab);

  const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = '';
    let Icon = Clock;

    if (status.includes('Onay')) {
      colorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      Icon = CheckCircle2;
    } else if (status.includes('SPK')) {
      colorClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      Icon = Clock;
    } else if (status.includes('Taslak')) {
      colorClass = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      Icon = AlertCircle;
    } else {
      colorClass = 'bg-zinc-500/10 text-zinc-400';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SEO
        title="Sermaye Artırımı Takvimi 2026 - Bedelsiz, Bedelli, Tahsisli | YatırımX"
        description="BIST şirketlerinin sermaye artırımı duyuruları, bedelsiz hisse, bedelli hisse ve tahsisli artırım takvimi. Güncel sermaye artırımı haberleri ve detaylı analizler."
        canonicalUrl="https://yatirimx.com/sermaye-artirimi/"
        keywords="sermaye artırımı, bedelsiz hisse, bedelli hisse, tahsisli artırım, sermaye artırımı takvimi, bist sermaye artırımı"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-orange-500" /> Sermaye Artırımları
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Bedelli, bedelsiz ve tahsisli sermaye artırımı kararı alan şirketler, oranlar ve süreç durumları.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5 w-full md:w-fit">
        {(['Bedelsiz', 'Bedelli', 'Tahsisli'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab
              ? 'bg-zinc-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/5 text-zinc-400 border-b border-white/5">
                <th className="px-6 py-4 font-medium">Şirket</th>
                <th className="px-6 py-4 font-medium text-right">Artırım Oranı</th>
                <th className="px-6 py-4 font-medium text-right">Tarih</th>
                <th className="px-6 py-4 font-medium text-left">Durum</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Detay</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      <p>Veriler yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300 border border-white/5">
                          {item.code}
                        </div>
                        <div>
                          <div className="text-white font-bold">{item.company}</div>
                          <div className="text-xs text-zinc-500">{activeTab} Sermaye Artırımı</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-lg font-mono font-bold tabular-nums ${activeTab === 'Bedelsiz' ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                        {item.rate}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 text-right font-mono text-xs">
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs hidden md:table-cell">
                      {item.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/hisse/${slugify(`${item.code} Hisse Senedi Fiyatı Grafiği ${item.code} Yorumu 2026`)}/`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Bu kategoride güncel veri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SermayeArtirimi;