import { OrderBookLevel } from '../types';
import { formatPrice } from '../utils/helpers';

interface Props {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  currentPrice: number;
}

export default function OrderBook({ bids, asks, currentPrice }: Props) {
  const maxVol = Math.max(
    ...bids.map((b) => b.volume),
    ...asks.map((a) => a.volume),
    1
  );

  return (
    <div className="bg-slate-800/90 border-b border-slate-700 p-3">
      <h3 className="text-xs font-semibold text-slate-300 mb-2">买卖五档</h3>
      <div className="space-y-0.5">
        {[...asks].reverse().map((ask, i) => (
          <div key={`ask-${i}`} className="flex items-center text-xs gap-2">
            <span className="w-8 text-slate-500 text-right">卖{5 - i}</span>
            <span className="w-16 text-green-400 font-mono">{formatPrice(ask.price)}</span>
            <div className="flex-1 bg-slate-700/50 rounded overflow-hidden h-4 relative">
              <div
                className="absolute right-0 top-0 h-full bg-green-500/20"
                style={{ width: `${(ask.volume / maxVol) * 100}%` }}
              />
              <span className="absolute right-1 top-0 text-[10px] text-slate-400 leading-4">
                {ask.volume}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="my-2 py-1 border-y border-slate-700 text-center">
        <span className="text-sm font-bold text-slate-200">{formatPrice(currentPrice)}</span>
      </div>
      <div className="space-y-0.5">
        {bids.map((bid, i) => (
          <div key={`bid-${i}`} className="flex items-center text-xs gap-2">
            <span className="w-8 text-slate-500 text-right">买{i + 1}</span>
            <span className="w-16 text-red-400 font-mono">{formatPrice(bid.price)}</span>
            <div className="flex-1 bg-slate-700/50 rounded overflow-hidden h-4 relative">
              <div
                className="absolute right-0 top-0 h-full bg-red-500/20"
                style={{ width: `${(bid.volume / maxVol) * 100}%` }}
              />
              <span className="absolute right-1 top-0 text-[10px] text-slate-400 leading-4">
                {bid.volume}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
