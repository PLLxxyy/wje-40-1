export interface Stock {
  code: string;
  name: string;
  price: number;
  prevClose: number;
  volume: number;
}

export interface KLineData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface TickData {
  time: string;
  price: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  volume: number;
}

export type KLinePeriod = 'day' | 'week' | 'month';
