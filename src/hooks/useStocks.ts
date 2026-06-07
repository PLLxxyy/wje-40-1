import { useState, useEffect, useCallback } from 'react';
import { Stock, KLineData, TickData, OrderBookLevel, KLinePeriod } from '../types';
import { generateStocks, updateStocks, generateKLine, generateTicks, generateOrderBook } from '../utils/mockData';

export function useStocks(refreshInterval = 2000) {
  const [stocks, setStocks] = useState<Stock[]>(() => generateStocks());
  const [selectedCode, setSelectedCode] = useState<string>('000001');
  const [period, setPeriod] = useState<KLinePeriod>('day');
  const [kline, setKline] = useState<KLineData[]>([]);
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookLevel[]; asks: OrderBookLevel[] }>({ bids: [], asks: [] });

  const selectedStock = stocks.find((s) => s.code === selectedCode) || stocks[0];

  useEffect(() => {
    setKline(generateKLine(selectedCode, period));
    setTicks(generateTicks(selectedCode));
    setOrderBook(generateOrderBook(selectedStock?.price || 100));
  }, [selectedCode, period]);

  const refresh = useCallback(() => {
    setStocks((prev) => {
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

  return {
    stocks,
    selectedStock,
    selectedCode,
    setSelectedCode,
    period,
    setPeriod,
    kline,
    ticks,
    orderBook,
  };
}
