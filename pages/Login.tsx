
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowLeft, Send, User, BadgeCheck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        username: ''
    });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (view === 'register') {
                const { error, data } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/giris`,
                        data: {
                            full_name: formData.fullName,
                            username: formData.username
                        }
                    }
                });
                if (error) throw error;

                if (data.session) {
                    toast.success('Kayıt başarılı! Giriş yapılıyor...');
                    navigate(-1);
                } else {
                    toast.success('Kayıt başarılı! Lütfen mail kutunuzu kontrol ederek hesabınızı onaylayın.', { duration: 6000 });
                    setView('login');
                }

            } else if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                toast.success('Giriş başarılı!');
                navigate(-1);

            } else if (view === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                    redirectTo: `${window.location.origin}/reset-sifre`,
                });
                if (error) throw error;
                toast.success('Şifre sıfırlama bağlantısı gönderildi.');
                setView('login');
            }

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold"
            >
                <ArrowLeft className="w-4 h-4" /> Ana Sayfa
            </button>

            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white mb-2">
                        {view === 'register' ? 'YatırımX\'e Katıl' : view === 'forgot' ? 'Şifremi Unuttum' : 'Hoşgeldiniz'}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        {view === 'register'
                            ? 'Yatırımcı topluluğunun bir parçası ol.'
                            : view === 'forgot'
                                ? 'Hesabınıza erişmek için şifre sıfırlama bağlantısı gönderelim.'
                                : 'Hesabınıza giriş yaparak tartışmalara katılın.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">

                    {view === 'register' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Ad Soyad</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                        placeholder="Ad Soyad"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Kullanıcı Adı (Rumuz)</label>
                                <div className="relative">
                                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        required
                                        minLength={3}
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                        placeholder="kullanici_adi"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="email"
                                required
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                placeholder="mail@ornek.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {view !== 'forgot' && (
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {view === 'login' && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setView('forgot')}
                                className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                            >
                                Şifremi Unuttum
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : view === 'register' ? (
                            <>
                                <UserPlus className="w-4 h-4" /> Kayıt Ol
                            </>
                        ) : view === 'forgot' ? (
                            <>
                                <Send className="w-4 h-4" /> Bağlantı Gönder
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" /> Giriş Yap
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    {view === 'forgot' ? (
                        <button
                            onClick={() => setView('login')}
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Giriş ekranına dön
                        </button>
                    ) : (
                        <button
                            onClick={() => setView(view === 'login' ? 'register' : 'login')}
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            {view === 'login'
                                ? 'Hesabınız yok mu? Hemen kayıt olun'
                                : 'Zaten hesabınız var mı? Giriş yapın'}
                        </button>
                    )}
                </div>
            </div>
            <Toaster position="bottom-center" theme="dark" />
        </div>
    );
};

export default Login;
