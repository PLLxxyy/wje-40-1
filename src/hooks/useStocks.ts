import { useState, useEffect, useCallback, useMemo } from 'react';
import { Stock, KLineData, TickData, OrderBookLevel, KLinePeriod } from '../types';
import { generateStocks, updateStocks, generateKLine, generateTicks, generateOrderBook } from '../utils/mockData';

const defaultWatchlist = ['000001', '000002', '000858', '002594', '300750', '600036', '600519', '601318', '601888', '688981'];

export function useStocks(refreshInterval = 2000) {
  const [allStocks, setAllStocks] = useState<Stock[]>(() => generateStocks());
  const [watchlistCodes, setWatchlistCodes] = useState<string[]>(defaultWatchlist);
  const [selectedCode, setSelectedCode] = useState<string>('000001');
  const [period, setPeriod] = useState<KLinePeriod>('day');
  const [kline, setKline] = useState<KLineData[]>([]);
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookLevel[]; asks: OrderBookLevel[] }>({ bids: [], asks: [] });

  const watchlistStocks = useMemo(
    () => watchlistCodes.map((code) => allStocks.find((s) => s.code === code)).filter(Boolean) as Stock[],
    [watchlistCodes, allStocks]
  );

  const selectedStock = allStocks.find((s) => s.code === selectedCode) || allStocks[0];

  useEffect(() => {
    setKline(generateKLine(selectedCode, period));
    setTicks(generateTicks(selectedCode));
    setOrderBook(generateOrderBook(selectedStock?.price || 100));
  }, [selectedCode, period]);

  const refresh = useCallback(() => {
    setAllStocks((prev) => {
      const updated = updateStocks(prev);
      const sel = updated.find((s) => s.code === selectedCode);
      if (sel) {
        setOrderBook(generateOrderBook(sel.price));
      }
      return updated;
    });
  }, [selectedCode]);

  useEffect(() => {
    const timer = setInterval(refresh, refreshInterval);
    return () => clearInterval(timer);
  }, [refresh, refreshInterval]);

  const searchStock = useCallback((code: string): Stock | null => {
    return allStocks.find((s) => s.code === code) || null;
  }, [allStocks]);

  const addToWatchlist = useCallback((code: string) => {
    setWatchlistCodes((prev) => {
      if (prev.includes(code)) return prev;
      return [...prev, code];
    });
  }, []);

  const removeFromWatchlist = useCallback((code: string) => {
    setWatchlistCodes((prev) => prev.filter((c) => c !== code));
  }, []);

  const isInWatchlist = useCallback((code: string) => {
    return watchlistCodes.includes(code);
  }, [watchlistCodes]);

  return {
    allStocks,
    stocks: watchlistStocks,
    selectedStock,
    selectedCode,
    setSelectedCode,
    period,
    setPeriod,
    kline,
    ticks,
    orderBook,
    searchStock,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}
