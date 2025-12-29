import React from 'react';
import { Share2, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
    title: string;
    url?: string;
    description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, description }) => {
    const [copied, setCopied] = React.useState(false);
    const shareUrl = url || window.location.href;
    const shareText = description || title;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link kopyalandı!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Kopyalama başarısız');
        }
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleTelegramShare = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramUrl, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error occurred
            }
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Paylaş:</span>

            {/* Native Share (Mobile) */}
            {navigator.share && (
                <button
                    onClick={handleNativeShare}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all hover:scale-110"
                    title="Paylaş"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            )}

            {/* Twitter */}
            <button
                onClick={handleTwitterShare}
                className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition-all hover:scale-110"
                title="Twitter'da Paylaş"
            >
                <Twitter className="w-4 h-4" />
            </button>

            {/* WhatsApp */}
            <button
                onClick={handleWhatsAppShare}
                className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 text-zinc-400 hover:text-green-400 transition-all hover:scale-110"
                title="WhatsApp'ta Paylaş"
            >
                <MessageCircle className="w-4 h-4" />
            </button>

            {/* Telegram */}
            <button
                onClick={handleTelegramShare}
                className="p-2 rounded-lg bg-white/5 hover:bg-blue-400/20 text-zinc-400 hover:text-blue-300 transition-all hover:scale-110"
                title="Telegram'da Paylaş"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z" />
                </svg>
            </button>

            {/* Copy Link */}
            <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-zinc-400 hover:text-purple-400 transition-all hover:scale-110"
                title="Linki Kopyala"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
};

export default ShareButtons;
