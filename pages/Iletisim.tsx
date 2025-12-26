import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Iletisim: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create mailto link
        const mailtoLink = `mailto:vlkneles@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `İsim: ${formData.name}\nE-posta: ${formData.email}\n\nMesaj:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitted(false);
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">

            {/* Hero Section */}
            <div className="text-center mb-12 pt-8">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    İletişim
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                    Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Bize Ulaşın</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-white font-semibold mb-2">E-posta</h3>
                                <a
                                    href="mailto:vlkneles@gmail.com"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    vlkneles@gmail.com
                                </a>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <h3 className="text-white font-semibold mb-2">Çalışma Saatleri</h3>
                                <p className="text-zinc-400 text-sm">
                                    E-posta yoluyla 7/24 ulaşabilirsiniz.
                                    <br />
                                    Genellikle 24-48 saat içinde yanıt veriyoruz.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <h3 className="text-white font-semibold mb-2">Platform</h3>
                                <p className="text-zinc-400 text-sm">
                                    YatırımX - Borsa ve Hisse Senedi Analiz Platformu
                                    <br />
                                    <span className="text-zinc-500">Türkiye'nin en kapsamlı BIST veri kaynağı</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                        <h3 className="text-blue-400 font-bold mb-2">💡 İpucu</h3>
                        <p className="text-zinc-400 text-sm">
                            Teknik sorunlar için lütfen kullandığınız tarayıcı ve cihaz bilgilerini belirtin.
                            Hisse senedi ile ilgili sorularınızda hisse kodunu (örn: GARAN) eklemeyi unutmayın.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="glass-panel p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönderin</h2>

                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">E-posta İstemciniz Açılıyor</h3>
                            <p className="text-zinc-400 text-sm">
                                Mesajınızı e-posta istemcinizden gönderebilirsiniz.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-white font-semibold mb-2 text-sm">
                                    İsim Soyisim
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                    placeholder="Adınız ve soyadınız"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 text-sm">
                                    E-posta
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 text-sm">
                                    Konu
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                    placeholder="Mesajınızın konusu"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 text-sm">
                                    Mesaj
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
                                    placeholder="Mesajınızı buraya yazın..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Gönder
                            </button>
                        </form>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Iletisim;
