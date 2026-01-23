
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { KeyRound, CheckCircle2, Loader2 } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    // Check if we have a session (the link should autosign in users for recovery)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If not session, maybe the link is invalid or expired
                // But let's allow them to try setting it if the recovery token worked solely.
                // Actually for supabase, the link redirects with a hash containing access_token
                // which the client library handles automatically on init.
            }
        });
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            toast.success('Şifreniz başarıyla güncellendi!');
            setTimeout(() => {
                navigate('/giris');
            }, 2000);

        } catch (error: any) {
            toast.error('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <KeyRound className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">
                        Yeni Şifre Belirle
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        Lütfen hesabınız için yeni ve güvenli bir şifre girin.
                    </p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Yeni Şifre</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" /> Şifreyi Güncelle
                            </>
                        )}
                    </button>
                </form>
            </div>
            <Toaster position="bottom-center" theme="dark" />
        </div>
    );
};

export default ResetPassword;
