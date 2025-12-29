import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mesajınız Alındı!</h3>
                <p className="text-zinc-400">En kısa sürede size geri dönüş yapacağız.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                >
                    Yeni mesaj gönder
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Adınız Soyadınız</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-zinc-900 outline-none transition-all placeholder:text-zinc-600"
                        placeholder="Örn: Ahmet Yılmaz"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">E-posta Adresi</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-zinc-900 outline-none transition-all placeholder:text-zinc-600"
                        placeholder="ahmet@ornek.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Konu</label>
                <select className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-zinc-900 outline-none transition-all">
                    <option>Genel Sorular</option>
                    <option>Teknik Destek</option>
                    <option>İş Birliği</option>
                    <option>Öneri / Şikayet</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Mesajınız</label>
                <textarea
                    required
                    rows={4}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:bg-zinc-900 outline-none transition-all placeholder:text-zinc-600 resize-none"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
                {status === 'submitting' ? (
                    'Gönderiliyor...'
                ) : (
                    <>
                        Mesajı Gönder <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
};
