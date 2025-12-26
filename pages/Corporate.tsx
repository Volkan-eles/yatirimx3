import React from 'react';
import { TrendingUp, Users, Target, Shield, Briefcase, MapPin, Mail, Phone, ArrowRight, Send } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Finansal Özgürlüğe <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Teknoloji ile Ulaşın</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          YatirimX, yatırımcıların karmaşık piyasa verilerini anlamlandırmasına yardımcı olan, yapay zeka destekli yeni nesil bir finans terminalidir.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'Aktif Kullanıcı', val: '50K+' },
            { label: 'Analiz Edilen Veri', val: '10TB+' },
            { label: 'Kurumsal Partner', val: '25+' },
            { label: 'Ülke', val: '8' },
        ].map((s, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl text-center border border-white/5">
                <div className="text-3xl font-bold text-white mb-1">{s.val}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</div>
            </div>
        ))}
      </div>

      {/* Mission/Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-emerald-500" /> Misyonumuz
            </h3>
            <p className="text-zinc-400 leading-relaxed">
                Her seviyeden yatırımcının profesyonel araçlara erişimini demokratikleştirmek. Finansal okuryazarlığı artırarak, veriye dayalı kararlar alınmasını sağlamak ve Türkiye sermaye piyasalarının derinleşmesine katkıda bulunmak. Bizim için her veri bir hikaye, her grafik bir fırsattır.
            </p>
        </div>
        <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-900/20 to-transparent">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" /> Değerlerimiz
            </h3>
            <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Şeffaflık</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> İnovasyon</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Kullanıcı Odaklılık</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Veri Güvenliği</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export const Careers: React.FC = () => {
    const jobs = [
        { title: 'Senior Frontend Developer', type: 'Tam Zamanlı', loc: 'İstanbul (Hibrit)', dept: 'Engineering' },
        { title: 'Financial Data Analyst', type: 'Tam Zamanlı', loc: 'İstanbul (Ofis)', dept: 'Data Science' },
        { title: 'Product Manager', type: 'Tam Zamanlı', loc: 'Uzaktan', dept: 'Product' },
        { title: 'Junior Backend Developer', type: 'Staj / Yarı Zamanlı', loc: 'İstanbul (Hibrit)', dept: 'Engineering' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="text-center py-10">
                <h1 className="text-4xl font-bold text-white mb-4">Geleceği Birlikte İnşa Edelim</h1>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    Fintech dünyasının en hızlı büyüyen ekibine katılın. Sınırları zorlayan projelerde yer alın.
                </p>
            </div>

            <div className="space-y-4">
                {jobs.map((job, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                            <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.dept}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.type}</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center mt-12 bg-gradient-to-b from-transparent to-blue-900/10">
                <h3 className="text-xl font-bold text-white mb-2">Aradığınız pozisyonu bulamadınız mı?</h3>
                <p className="text-zinc-400 text-sm mb-6">Yine de tanışmak isteriz. Genel başvurularınızı bekliyoruz.</p>
                <button className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-sm">
                    Genel Başvuru Gönder
                </button>
            </div>
        </div>
    );
};

export const Contact: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto items-start">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">İletişime Geçin</h1>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                    Sorularınız, önerileriniz veya iş birlikleri için bize ulaşın. Ekibimiz en kısa sürede size dönüş yapacaktır.
                </p>

                <div className="space-y-6">
                    <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Genel Merkez</h4>
                            <p className="text-zinc-400 text-sm">Büyükdere Cad. No:123 K:14<br/>Levent, İstanbul / Türkiye</p>
                        </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">E-Posta</h4>
                            <p className="text-zinc-400 text-sm">info@yatirimx.com<br/>destek@yatirimx.com</p>
                        </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-start gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Telefon</h4>
                            <p className="text-zinc-400 text-sm">+90 (212) 555 01 23<br/>Hafta içi: 09:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-zinc-900/50">
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Adınız</label>
                            <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="Adınız" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Soyadınız</label>
                            <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="Soyadınız" />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">E-Posta Adresi</label>
                        <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="ornek@sirket.com" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Konu</label>
                         <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500/50 outline-none transition-all">
                            <option>Genel Bilgi</option>
                            <option>Teknik Destek</option>
                            <option>Kurumsal İşbirliği</option>
                            <option>Kariyer</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Mesajınız</label>
                        <textarea rows={5} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500/50 outline-none transition-all" placeholder="Mesajınızı buraya yazın..."></textarea>
                    </div>

                    <button type="button" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Gönder
                    </button>
                </form>
            </div>
        </div>
    );
};