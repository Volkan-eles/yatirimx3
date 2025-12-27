import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, PieChart, ArrowUpRight, Loader2, Info, BookOpen, ChevronRight } from 'lucide-react';
import { slugify } from '../utils/slugify';
import SEO from '../components/SEO';
import FAQItem from '../components/FAQItem';

interface Dividend {
   t_bistkod: string;
   t_sirket: string;
   t_temt_net: string;
   t_yuzde: string;
   t_tarih: string;
   t_link: string;
   t_ok: string;
}

const Temettu: React.FC = () => {
   const [data, setData] = useState<Dividend[]>([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch('/temettu.json');
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

   const filteredData = data.filter(item =>
      item.t_sirket.toLowerCase().includes(search.toLowerCase()) ||
      item.t_bistkod.toLowerCase().includes(search.toLowerCase())
   );

   return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <SEO
            title="Temettü Takvimi 2026 - En Çok Temettü Veren Hisseler"
            description="2026 temettü takvimi, hisse başı net temettü miktarları, en yüksek verimli hisseler ve ödeme tarihleri. BIST temettü endeksi analizleri."
            canonicalUrl="https://yatirimx.com/temettu/"
            keywords="temettü takvimi 2026, temettü veren hisseler, 2026 temettü tahminleri, temettü verimliliği, nakit kar payı, borsa istanbul"
         />

         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
               <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <PieChart className="w-8 h-8 text-purple-500" /> Temettü Takvimi 2026
               </h1>
               <p className="text-zinc-400">2026 yılı yaklaşan nakit kar payı dağıtımları ve en yüksek verim analizleri.</p>
            </div>
         </div>

         <div className="flex gap-4">
            <div className="relative flex-1 md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
               <input
                  type="text"
                  placeholder="Şirket veya kod ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/20"
               />
            </div>
         </div>

         <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 min-h-[400px]">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="bg-white/5 text-zinc-400 border-b border-white/5">
                        <th className="px-6 py-4 font-medium">Şirket</th>
                        <th className="px-6 py-4 font-medium text-right">Pay Başına Net</th>
                        <th className="px-6 py-4 font-medium text-center">Verim</th>
                        <th className="px-6 py-4 font-medium text-right">Tarih</th>
                        <th className="px-6 py-4 font-medium text-right"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {loading ? (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                              <div className="flex flex-col items-center gap-3">
                                 <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                 <p>Veriler yükleniyor...</p>
                              </div>
                           </td>
                        </tr>
                     ) : filteredData.length > 0 ? (
                        filteredData.map((div, idx) => (
                           <tr key={idx} className="hover:bg-white/5 transition-colors group">
                              <td className="px-6 py-4">
                                 <Link to={`/temettu/${slugify(`${div.t_bistkod} Temettu Tarihi 2026 Ne Kadar Verecek`)}`} className="flex items-center gap-3 group/link">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300 border border-white/5 group-hover/link:border-purple-500/50 group-hover/link:text-white transition-colors">
                                       {div.t_bistkod}
                                    </div>
                                    <div>
                                       <div className="text-white font-bold group-hover/link:text-purple-400 transition-colors">{div.t_sirket}</div>
                                    </div>
                                 </Link>
                              </td>
                              <td className="px-6 py-4 text-white font-mono text-right font-medium text-base">
                                 {div.t_temt_net} TL
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-xs">
                                    %{div.t_yuzde}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-zinc-300 text-right">{div.t_tarih}</td>
                              <td className="px-6 py-4 text-right">
                                 <Link to={`/temettu/${slugify(`${div.t_bistkod} Temettu Tarihi 2026 Ne Kadar Verecek`)}`} className="p-2 hover:bg-white/10 rounded-full inline-flex text-zinc-500 hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                 </Link>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                              Kriterlere uygun veri bulunamadı.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Info & FAQ Section */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="glass-panel p-6 rounded-2xl border border-white/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <BookOpen className="w-5 h-5 text-purple-500" /> Temettü Hakkında Bilgiler
                  </h3>
                  <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                     <p>
                        <span className="text-white font-bold">Temettü (Kar Payı) Nedir?</span><br />
                        Şirketlerin, elde ettikleri karın bir kısmını veya tamamını ortaklarına (hisse senedi sahiplerine) nakit veya bedelsiz hisse olarak dağıtmasıdır. Temettü, uzun vadeli yatırımcının en önemli getiri kaynaklarından biridir.
                     </p>
                     <p>
                        <span className="text-white font-bold">Temettü Verimliliği Nedir?</span><br />
                        Hisse başına ödenecek nakit temettü tutarının, hissenin güncel piyasa fiyatına oranıdır. Verimlilik ne kadar yüksekse, yatırımcının temettüden elde edeceği getiri o kadar yüksek olur.
                     </p>
                     <p>
                        <span className="text-white font-bold">Hak Kullanım Tarihi (Tarih)</span><br />
                        Temettü almaya hak kazanmak için hisse senedinin portföyünüzde bulunması gereken son gündür. Bu tarihten bir gün önce hisseyi alanlar temettü alır, bu tarihte satanlar temettü alamaz.
                     </p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-500" /> Sıkça Sorulan Sorular
               </h3>
               <FAQItem
                  question="Temettü almak için hisseyi ne zaman almalıyım?"
                  answer="Temettü ödemesinden faydalanmak için, şirketin açıkladığı 'Hak Kullanım Tarihi'nden (Dağıtım Tarihi) en az bir gün önce piyasa kapanışında hisseye sahip olmanız gerekir."
               />
               <FAQItem
                  question="Temettü dağıtılan gün hisse fiyatı düşer mi?"
                  answer="Evet, temettü dağıtım tarihinde hisse senedinin teorik fiyatı, ödenen brüt temettü miktarı kadar düşer. Ancak bu durum portföy değerinizi değiştirmez, çünkü düşen miktar nakit olarak hesabınıza yatar."
               />
               <FAQItem
                  question="Temettü ne zaman hesaba geçer?"
                  answer="Nakit kar payı ödemeleri, hak kullanım tarihinden 2 iş günü sonra (T+2) yatırım hesabınıza nakit olarak geçer."
               />
               <FAQItem
                  question="Temettü ödemesinden vergi kesilir mi?"
                  answer="Evet, bireysel yatırımcılar için brüt temettü üzerinden %10 oranında stopaj (gelir vergisi) kaynağında kesilir. Hesabınıza yatan tutar net temettüdür."
               />
               <FAQItem
                  question="2026 Temettü tahminleri ne zaman kesinleşir?"
                  answer="Şirketler genellikle 2025 yılı finansal sonuçlarını açıkladıktan sonra (2026'nın ilk çeyreğinde), Genel Kurul toplantılarında kar dağıtım kararlarını ve tarihlerini kesinleştirirler."
               />
            </div>
         </div>
      </div>
   );
};

export default Temettu;