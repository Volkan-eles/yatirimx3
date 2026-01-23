
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h1 className="text-xl font-bold mb-2">Bir Hata Oluştu</h1>
                        <p className="text-zinc-500 text-sm mb-6">
                            Uygulama çalışırken beklenmedik bir sorunla karşılaştı.
                        </p>

                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-left mb-6 overflow-auto max-h-48">
                            <code className="text-[10px] font-mono text-rose-400">
                                {this.state.error?.message || 'Bilinmeyen Hata'}
                            </code>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Sayfayı Yenile
                        </button>

                        <div className="mt-4">
                            <a href="/" className="text-xs text-zinc-500 hover:text-white underline">Ana Sayfaya Dön</a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
