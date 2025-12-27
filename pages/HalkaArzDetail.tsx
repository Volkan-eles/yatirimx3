
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_IPOS } from '../constants';
import { ArrowLeft, Calendar, Building, Info, Tag, Layers, PieChart, Wallet, Users, BarChart } from 'lucide-react';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4 border-b border-white/5 last:border-0">
        <div className="text-zinc-400 font-medium text-sm">{label} :</div>
        <div className="text-white font-medium text-right md:text-left">{value}</div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        {title}
    </h3>
);

const HalkaArzDetail: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [ipo, setIpo] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/halkarz_ipos.json');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();

                // Search in both active and draft
                const allIpos = [...(data.active_ipos || []), ...(data.draft_ipos || [])];
                const found = allIpos.find((item) => item.slug === code || item.code === code);

                setIpo(found);
            } catch (error) {
                console.error("Error fetching detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [code]);

    if (loading) {
        return <div className="text-center py-20 text-zinc-500">Yükleniyor...</div>;
    }

    if (!ipo) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-zinc-500">
                <h2 className="text-xl font-bold text-white mb-4">Halka Arz Bulunamadı</h2>
                <Link to="/halka-arz" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Listeye Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-5xl mx-auto">
            {ipo && (
                <SEO
                    title={`${ipo.company} Halka Arzı Hakkında Bilmen Gereken Her Şey! – 2026`}
                    description={`${ipo.company} (${ipo.code || 'KOD_YOK'}) halka arz fiyatı ${ipo.price > 0 ? ipo.price + ' TL' : 'belirlenmedi'}, halka arz tarihi ${ipo.dates} ve detaylı şirket analizi. Katılım endeksine uygun mu, dağıtım şekli ve yorumlar.`}
                    canonicalUrl={`https://yatirimx.com/halka-arz/${ipo.slug || slugify(ipo.company)}/`}
                    keywords={`${ipo.code || ''}, ${ipo.company}, ${ipo.company} halka arz, ${ipo.company} yorum, ${ipo.company} ne zaman işlem görecek, halka arz takvimi`}
                />
            )}

            {/* Top Navigation */}
            <div className="flex items-center gap-4 mb-4">
                <Link to="/halka-arz" className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                        <span className="text-black font-extrabold text-sm">{ipo.code}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl md:text-2xl font-bold text-white">{ipo.company}</h1>
                            {ipo.status === 'Yeni' && (
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Yeni!</span>
                            )}
                        </div>
                        <div className="text-sm text-zinc-500 mt-0.5">Halka Arz Bilgilendirme ve Detay Sayfası</div>
                    </div>
                </div>
            </div>

            {/* Tabs (Visual only for this demo) */}
            <div className="border-b border-white/10 flex gap-6 text-sm font-medium">
                <button className="text-white border-b-2 border-blue-500 pb-3">Halka Arz Bilgileri</button>
                <button className="text-zinc-500 hover:text-zinc-300 pb-3 transition-colors">Forum</button>
                <button className="text-zinc-500 hover:text-zinc-300 pb-3 transition-colors">Şirket Hakkında</button>
            </div>

            {/* Main Info Box */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5">
                <SectionHeader title="Halka Arz Tarihi :" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    <DetailRow label="Halka Arz Tarihi" value={<span className="font-bold">{ipo.dates}{ipo.applicationHours && ` ${ipo.applicationHours}`}</span>} />
                    <DetailRow label="Halka Arz Fiyatı/Aralığı" value={<span className="font-bold">{ipo.price > 0 ? `${ipo.price.toFixed(2)} TL` : 'Belirlenmedi'}</span>} />

                    <DetailRow label="Dağıtım Yöntemi" value={<span className="font-bold">{ipo.distributionType} **</span>} />
                    <DetailRow label="Pay" value={<span className="font-bold">{ipo.lotCount} Lot</span>} />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 border-b border-white/5 last:border-0">
                        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="text-zinc-400 font-medium text-sm">Aracı Kurum :</div>
                            <div className="text-white font-medium text-right md:text-left">{ipo.broker || 'Bilinmiyor'}</div>
                        </div>
                    </div>

                    <DetailRow label="Bist Kodu" value={<span className="font-bold">{ipo.code || '?'}</span>} />
                    <DetailRow label="Pazar" value={<span className="font-bold">{ipo.market || 'Yıldız Pazar'}</span>} />

                    {ipo.discount && <DetailRow label="Halka Arz İskontosu" value={<span className="font-bold text-emerald-400">{ipo.discount}</span>} />}
                    {ipo.totalSize && <DetailRow label="Halka Arz Büyüklüğü" value={<span className="font-bold">{ipo.totalSize}</span>} />}

                    <DetailRow label="Bist İlk İşlem Tarihi" value={<span className="font-bold text-zinc-300">{ipo.firstTradeDate || 'Hazırlanıyor...'}</span>} />
                </div>

                {/* Distribution Table */}
                {ipo.distributionDetails && (
                    <div className="mt-8">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-zinc-400" /> Dağıtılan Pay Miktarı *
                        </h4>
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-900/80 text-zinc-400">
                                    <tr>
                                        <th className="p-4 font-medium">Yatırımcı Grubu</th>
                                        <th className="p-4 font-medium">Kişi</th>
                                        <th className="p-4 font-medium text-right">Lot</th>
                                        <th className="p-4 font-medium text-right">Oran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-black/20">
                                    {ipo.distributionDetails.map((row, idx) => (
                                        <tr key={idx} className={row.category === 'Toplam' ? 'font-bold bg-white/5' : ''}>
                                            <td className="p-4 text-white">{row.category}</td>
                                            <td className="p-4 text-zinc-300">{row.count}</td>
                                            <td className="p-4 text-right text-zinc-300">{row.lot}</td>
                                            <td className="p-4 text-right text-emerald-400">{row.ratio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 italic">* Payların %5'inden fazlasına olan gerçek/tüzel kişi başvuruları Grubu.</p>
                    </div>
                )}

                {/* Allocation Groups */}
                {ipo.allocationGroups && ipo.allocationGroups.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-zinc-400" /> Tahsisat Grupları
                        </h4>
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5">
                            <ul className="space-y-2 text-sm text-zinc-300">
                                {ipo.allocationGroups.map((group: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>{group}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Estimated Distribution */}
                {ipo.estimatedDistribution && ipo.estimatedDistribution.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-400" /> Dağıtılacak Pay Miktarı (Olası)
                        </h4>
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-zinc-300">
                                {ipo.estimatedDistribution.map((dist: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">→</span>
                                        <span>{dist}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Financial Data */}
                {ipo.financialData && ipo.financialData.raw && (
                    <div className="mt-8">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-zinc-400" /> Finansal Tablo
                        </h4>
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5">
                            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{ipo.financialData.raw}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content / FAQ Section */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{ipo.company} ({ipo.code || '?'}) halka arzı hakkında bilmen gereken her şey! – 2025</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {ipo.company} halka arzı Sermaye Piyasası Kurulu (SPK) tarafından onaylandı. {ipo.code} halka arz özelliklerini, şirketi, yatırımlarını ve detaylarını inceleyeceğiz.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-500" />
                            {ipo.code} Halka Arz Fiyatı Ne Kadar?
                        </h4>
                        <p className="text-zinc-400 text-sm pl-6 border-l-2 border-white/10">
                            {ipo.company} halka arz fiyatı <span className="text-white font-bold">{ipo.price > 0 ? ipo.price.toFixed(2) + ' TL' : 'Bilinmiyor'}</span> olarak belirlendi.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            {ipo.code} Ne Zaman Halka Arz Olacak?
                        </h4>
                        <p className="text-zinc-400 text-sm pl-6 border-l-2 border-white/10">
                            {ipo.company}'nin halka arz tarihi <span className="text-white font-bold">{ipo.dates}</span> olarak belirlendi.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            {ipo.code} Sembolü (Borsa Kodu) Ne Olacak?
                        </h4>
                        <p className="text-zinc-400 text-sm pl-6 border-l-2 border-white/10">
                            {ipo.company} sembolü <span className="text-white font-bold">"{ipo.code}"</span> olacak.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" />
                            {ipo.code} Halka Açıklık Oranı Ne Kadar?
                        </h4>
                        <div className="pl-6 border-l-2 border-white/10 text-sm text-zinc-400 space-y-1">
                            <p>{ipo.floatingRate || 'Bilinmiyor'}</p>
                            <p>Toplamda <span className="text-white font-bold">{ipo.lotCount} Lot</span> pay dağıtılacak.</p>
                        </div>
                    </div>

                    {ipo.lockup && ipo.lockup.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-500" />
                                {ipo.code} Fiyat İstikrarı ve Hedefleri
                            </h4>
                            <ul className="list-disc pl-10 text-sm text-zinc-400 space-y-1">
                                {ipo.lockup.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {ipo.fundUsage && ipo.fundUsage.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-blue-500" />
                                {ipo.code} Halka Arz Geliri Nerede Kullanılacak?
                            </h4>
                            <p className="text-zinc-400 text-sm pl-6 mb-2">Şirket halka arzdan elde edeceği geliri aşağıdaki gibi kullanmayı hedeflemektedir:</p>
                            <ul className="list-disc pl-10 text-sm text-zinc-400 space-y-1">
                                {ipo.fundUsage.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    Sıkça Sorulan Sorular (SSS)
                </h2>

                <div className="space-y-4">
                    {/* FAQ 1 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>{ipo.company} ({ipo.code}) halka arzına nasıl başvurabilirim?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            {ipo.code} halka arzına başvurmak için banka veya aracı kurumunuzun mobil uygulaması, internet şubesi veya şubelerinden başvuru yapabilirsiniz.
                            {ipo.broker && ipo.broker !== 'Bilinmiyor' && (
                                <> Konsorsiyum lideri <span className="text-white font-semibold">{ipo.broker}</span> üzerinden de başvuru yapabilirsiniz.</>
                            )}
                        </div>
                    </details>

                    {/* FAQ 2 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>{ipo.company} ({ipo.code}) halka arz fiyatı ne kadar?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            {ipo.price > 0 ? (
                                <>
                                    {ipo.company} halka arz fiyatı <span className="text-white font-bold">{ipo.price.toFixed(2)} TL</span> olarak belirlenmiştir.
                                    Bu fiyat üzerinden {ipo.lotCount} lot pay dağıtılacaktır.
                                </>
                            ) : (
                                `${ipo.company} halka arz fiyatı henüz açıklanmamıştır. Fiyat belirlendikten sonra bu bilgi güncellenecektir.`
                            )}
                        </div>
                    </details>

                    {/* FAQ 3 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>{ipo.company} ({ipo.code}) halka arz tarihleri nedir?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            {ipo.company} halka arz başvuru tarihleri <span className="text-white font-bold">{ipo.dates}</span> olarak belirlenmiştir.
                            Bu tarihler arasında aracı kurumunuz üzerinden başvuru yapabilirsiniz.
                        </div>
                    </details>

                    {/* FAQ 4 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>Dağıtım yöntemi nedir?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            {ipo.distributionType === 'Eşit Dağıtım' ? (
                                'Bu halka arzda eşit dağıtım yöntemi kullanılacaktır. Tüm başvuru sahiplerine eşit miktarda pay dağıtılacaktır.'
                            ) : ipo.distributionType === 'Oransal Dağıtım' ? (
                                'Bu halka arzda oransal dağıtım yöntemi kullanılacaktır. Paylar, talep edilen miktara göre oransal olarak dağıtılacaktır.'
                            ) : (
                                `Dağıtım yöntemi: ${ipo.distributionType}`
                            )}
                        </div>
                    </details>

                    {/* FAQ 5 - Fund Usage */}
                    {ipo.fundUsage && ipo.fundUsage.length > 0 && (
                        <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                            <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                                <span>Halka arz geliri nerede kullanılacak?</span>
                                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                                <p className="mb-2">Şirket, halka arzdan elde edeceği geliri şu alanlarda kullanmayı planlamaktadır:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {ipo.fundUsage.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    )}

                    {/* FAQ 6 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>Minimum başvuru tutarı ne kadar?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            {ipo.price > 0 ? (
                                `Minimum başvuru tutarı genellikle 1 lot (100 adet hisse) üzerinden hesaplanır. ${ipo.code} için bu yaklaşık ${(ipo.price * 100).toFixed(2)} TL'dir.`
                            ) : (
                                'Minimum başvuru tutarı halka arz fiyatı belirlendikten sonra açıklanacaktır.'
                            )}
                        </div>
                    </details>

                    {/* FAQ 7 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>{ipo.company} ({ipo.code}) hisseleri ne zaman işlem görmeye başlayacak?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            Halka arz başvuruları tamamlandıktan sonra, hisseler genellikle 1-2 hafta içinde Borsa İstanbul'da işlem görmeye başlar.
                            Kesin tarih SPK onayı sonrası açıklanacaktır.
                        </div>
                    </details>

                    {/* FAQ 8 */}
                    <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                        <summary className="cursor-pointer p-4 font-semibold text-white hover:bg-white/5 transition-colors flex justify-between items-center">
                            <span>Yabancı yatırımcılar başvurabilir mi?</span>
                            <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-zinc-400 text-sm leading-relaxed">
                            Evet, yabancı yatırımcılar da Türkiye'de yerleşik bir aracı kurum üzerinden halka arza başvurabilirler.
                            Ancak bazı halka arzlarda yabancı yatırımcılar için ayrı tahsisat grupları oluşturulabilir.
                        </div>
                    </details>
                </div>
            </div>
        </div >
    );
};

export default HalkaArzDetail;