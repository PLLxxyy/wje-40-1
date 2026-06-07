import { Stock } from '../types';
import { formatPrice, changePercent } from '../utils/helpers';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

interface Props {
  stocks: Stock[];
  selectedCode: string;
  onSelect: (code: string) => void;
  onRemove: (code: string) => void;
}

export default function WatchList({ stocks, selectedCode, onSelect, onRemove }: Props) {
  const handleRemove = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    onRemove(code);
  };

  return (
    <div className="w-64 bg-slate-800/90 border-r border-slate-700 flex flex-col">
      <div className="px-3 py-2 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200">自选股</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {stocks.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-slate-500">
            暂无自选股，搜索添加吧
          </div>
        ) : (
          stocks.map((stock) => {
            const pct = changePercent(stock.price, stock.prevClose);
            const isUp = pct >= 0;
            return (
              <div
                key={stock.code}
                onClick={() => onSelect(stock.code)}
                className={`group w-full text-left px-3 py-2 border-b border-slate-700/50 transition-colors cursor-pointer ${
                  selectedCode === stock.code ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{stock.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">{stock.code}</span>
                    <button
                      onClick={(e) => handleRemove(e, stock.code)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-600 transition-opacity"
                      title="移除自选股"
                    >
                      <X className="w-3 h-3 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-slate-200">{formatPrice(stock.price)}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? '+' : ''}{pct.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
