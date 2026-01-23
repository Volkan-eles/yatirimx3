
import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol: string;
    theme?: 'light' | 'dark';
    autosize?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'dark',
    autosize = true
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent duplicate script injection
        if (container.current && container.current.querySelector('script')) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `BIST:${symbol}`,
            "interval": "D",
            "timezone": "Europe/Istanbul",
            "theme": theme,
            "style": "1",
            "locale": "tr",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        if (container.current) {
            container.current.appendChild(script);
        }
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
};

export default memo(TradingViewWidget);
