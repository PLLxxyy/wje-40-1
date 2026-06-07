import { Stock, KLineData, TickData, OrderBookLevel } from '../types';

const stockNames: Record<string, string> = {
  '000001': '平安银行',
  '000002': '万科A',
  '000858': '五粮液',
  '002594': '比亚迪',
  '300750': '宁德时代',
  '600036': '招商银行',
  '600519': '贵州茅台',
  '601318': '中国平安',
  '601888': '中国中免',
  '688981': '中芯国际',
};

const basePrices: Record<string, number> = {
  '000001': 12.5,
  '000002': 18.2,
  '000858': 168.0,
  '002594': 245.0,
  '300750': 210.0,
  '600036': 35.0,
  '600519': 1680.0,
  '601318': 48.0,
  '601888': 85.0,
  '688981': 52.0,
};

export function generateStocks(): Stock[] {
  return Object.keys(stockNames).map((code) => {
    const base = basePrices[code];
    const change = (Math.random() - 0.5) * base * 0.06;
    const price = base + change;
    return {
      code,
      name: stockNames[code],
      price: Math.round(price * 100) / 100,
      prevClose: base,
      volume: Math.floor(Math.random() * 500000) + 100000,
    };
  });
}

export function updateStocks(stocks: Stock[]): Stock[] {
  return stocks.map((s) => {
    const delta = (Math.random() - 0.5) * s.price * 0.008;
    const newPrice = Math.max(s.price + delta, s.price * 0.95);
    return {
      ...s,
      price: Math.round(newPrice * 100) / 100,
      volume: s.volume + Math.floor(Math.random() * 5000),
    };
  });
}

function randomWalk(start: number, steps: number, volatility: number): number[] {
  const vals = [start];
  for (let i = 1; i < steps; i++) {
    vals.push(vals[i - 1] + (Math.random() - 0.5) * volatility);
  }
  return vals;
}

export function generateKLine(code: string, period: 'day' | 'week' | 'month'): KLineData[] {
  const base = basePrices[code] || 100;
  const count = period === 'day' ? 120 : period === 'week' ? 60 : 36;
  const volatility = base * 0.03;
  const closes = randomWalk(base, count, volatility);
  const data: KLineData[] = [];

  for (let i = 0; i < count; i++) {
    const close = closes[i];
    const open = i === 0 ? base : closes[i - 1];
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const date = new Date();
    if (period === 'day') {
      date.setDate(date.getDate() - (count - i));
    } else if (period === 'week') {
      date.setDate(date.getDate() - (count - i) * 7);
    } else {
      date.setMonth(date.getMonth() - (count - i));
    }
    data.push({
      date: date.toISOString().slice(0, 10),
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.floor(Math.random() * 500000) + 50000,
    });
  }
  return data;
}

export function generateTicks(code: string): TickData[] {
  const base = basePrices[code] || 100;
  const points: TickData[] = [];
  const steps = 240;
  const prices = randomWalk(base, steps, base * 0.005);
  for (let i = 0; i < steps; i++) {
    const hour = 9 + Math.floor(i / 60);
    const minute = (i % 60);
    if (hour === 11 && minute > 30) continue;
    if (hour === 12) continue;
    if (hour > 15) continue;
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    points.push({
      time,
      price: Math.round(prices[i] * 100) / 100,
      volume: Math.floor(Math.random() * 3000) + 100,
    });
  }
  return points;
}

export function generateOrderBook(price: number): { bids: OrderBookLevel[]; asks: OrderBookLevel[] } {
  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];
  for (let i = 0; i < 5; i++) {
    bids.push({
      price: Math.round((price - (i + 1) * 0.01) * 100) / 100,
      volume: Math.floor(Math.random() * 8000) + 500,
    });
    asks.push({
      price: Math.round((price + (i + 1) * 0.01) * 100) / 100,
      volume: Math.floor(Math.random() * 8000) + 500,
    });
  }
  return { bids, asks };
}
