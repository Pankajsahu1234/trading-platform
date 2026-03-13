

import { useEffect, useRef, useState } from "react";

interface SymbolConfig {
  id: string;
  name: string;
  displayName: string;
  tvSymbol: string; // TradingView symbol
  icon: string;
}

const SYMBOLS: SymbolConfig[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    displayName: 'BTC/USDT',
    tvSymbol: 'BINANCE:BTCUSDT',
    icon: ''
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    displayName: 'ETH/USDT',
    tvSymbol: 'BINANCE:ETHUSDT',
    icon: ''
  },
  {
    id: 'GOLD',
    name: 'Gold',
    displayName: 'XAUUSD',
    tvSymbol: 'BINANCE:PAXGUSDT',
    icon: ''
  },
  {
    id: 'SILVER',
    name: 'Silver',
    displayName: 'XAGUSD',
    tvSymbol: 'OANDA:XAGUSD',
    icon: ''
  }
];

export function MarketCandleChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolConfig>(SYMBOLS[0]);

  const loadTradingViewWidget = (symbol: string) => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).TradingView && containerRef.current) {
        widgetRef.current = new (window as any).TradingView.widget({
          container_id: 'tradingview_chart_container',
          width: '100%',
          height: 500,
          symbol: symbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1a1a2e',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
        });
      }
    };

    containerRef.current.appendChild(script);
  };

  useEffect(() => {
    // If TradingView already loaded (e.g. switching symbols), just re-init
    if ((window as any).TradingView && containerRef.current) {
      containerRef.current.innerHTML = `<div id="tradingview_chart_container"></div>`;
      widgetRef.current = new (window as any).TradingView.widget({
        container_id: 'tradingview_chart_container',
        width: '100%',
        height: 500,
        symbol: selectedSymbol.tvSymbol,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1a1a2e',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
      });
    } else {
      // First load — inject wrapper div then load script
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div id="tradingview_chart_container"></div>`;
      }
      loadTradingViewWidget(selectedSymbol.tvSymbol);
    }
  }, [selectedSymbol]);

  const handleSymbolChange = (symbolConfig: SymbolConfig) => {
    setSelectedSymbol(symbolConfig);
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Live Market Candlesticks</h3>
            <p className="text-sm text-muted-foreground">
              {selectedSymbol.name} - Real-time 15-minute candles
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Powered by</p>
            <p className="text-sm font-bold text-primary">TradingView</p>
          </div>
        </div>

        {/* Symbol Selector */}
        <div className="flex gap-2 flex-wrap">
          {SYMBOLS.map((sym) => (
            <button
              key={sym.id}
              onClick={() => handleSymbolChange(sym)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedSymbol.id === sym.id
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card border border-border hover:border-primary hover:scale-102"
              }`}
            >
              <span>{sym.displayName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TradingView Widget Container */}
      <div className="w-full rounded-lg overflow-hidden border border-border">
        <div ref={containerRef} style={{ minHeight: '500px' }}>
          <div id="tradingview_chart_container" />
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
        <div className="animate-slide-in">
          <p className="text-muted-foreground">Data Source</p>
          <p className="font-semibold">TradingView Live</p>
        </div>
        <div className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
          <p className="text-muted-foreground">Update Interval</p>
          <p className="font-semibold">Real-time</p>
        </div>
        <div className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-muted-foreground">Candle Period</p>
          <p className="font-semibold">15 Minutes</p>
        </div>
        <div className="animate-slide-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-muted-foreground">Symbol</p>
          <p className="font-semibold">{selectedSymbol.tvSymbol}</p>
        </div>
      </div>
    </div>
  );
}