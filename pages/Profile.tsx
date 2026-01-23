
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { User, BadgeCheck, Mail, Save, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                fullName: profile.full_name || '',
            });
        }
    }, [profile]);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/giris');
        }
    }, [user, authLoading, navigate]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: formData.username,
                    full_name: formData.fullName,
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success('Profil bilgileriniz güncellendi!');
            await refreshProfile(); // Update global context
        } catch (error: any) {
            toast.error('Hata: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">

                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-[#0c0c0e] flex items-center justify-center text-4xl font-bold text-zinc-600">
                            {profile?.username ? profile.username.charAt(0).toUpperCase() : <User />}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-white">{profile?.full_name || 'İsimsiz Kullanıcı'}</h1>
                            <p className="text-zinc-500 text-sm">@{profile?.username || 'kullanici'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded-lg transition-colors border border-rose-500/20"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Hesap Bilgileri</h3>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">E-posta (Değiştirilemez)</label>
                                <div className="relative opacity-50 cursor-not-allowed">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="email"
                                        disabled
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-zinc-400 text-sm"
                                        value={user?.email || ''}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Ad Soyad</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
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
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 "
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Değişiklikleri Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster position="bottom-center" theme="dark" />
        </div>
    );
};

export default Profile;
