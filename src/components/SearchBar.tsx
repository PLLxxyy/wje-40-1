import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Stock } from '../types';
import { formatPrice, changePercent } from '../utils/helpers';

interface Props {
  searchStock: (code: string) => Stock | null;
  addToWatchlist: (code: string) => void;
  isInWatchlist: (code: string) => boolean;
  onSelect: (code: string) => void;
  allStocks: Stock[];
}

export default function SearchBar({ searchStock, addToWatchlist, isInWatchlist, onSelect, allStocks }: Props) {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyword = value.trim().toLowerCase();
    if (!keyword) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const matched = allStocks.filter(
      (s) => s.code.toLowerCase().includes(keyword) || s.name.toLowerCase().includes(keyword)
    );
    setResults(matched);
    setShowDropdown(true);
  }, [value, allStocks]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    addToWatchlist(code);
  };

  const handleSelect = (code: string) => {
    onSelect(code);
    setValue('');
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative bg-slate-800 border-b border-slate-700">
      <div className="flex items-center gap-2 px-4 py-2">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              const found = searchStock(value.trim());
              if (found) handleSelect(found.code);
            }
          }}
          onFocus={() => value.trim() && setShowDropdown(true)}
          placeholder="输入股票代码或名称搜索..."
          className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none flex-1"
        />
      </div>
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-slate-800 border-b border-x border-slate-700 shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((stock) => {
            const inWatchlist = isInWatchlist(stock.code);
            const pct = changePercent(stock.price, stock.prevClose);
            const isUp = pct >= 0;
            return (
              <div
                key={stock.code}
                onClick={() => handleSelect(stock.code)}
                className="flex items-center justify-between px-4 py-2 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{stock.name}</span>
                    <span className="text-xs text-slate-500">{stock.code}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-300">{formatPrice(stock.price)}</span>
                    <span className={`text-xs ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                      {isUp ? '+' : ''}{pct.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleAdd(e, stock.code)}
                  disabled={inWatchlist}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    inWatchlist
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <Check className="w-3 h-3" />
                      已添加
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      加自选
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {showDropdown && value.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-slate-800 border-b border-x border-slate-700 shadow-lg z-50 px-4 py-3 text-center text-sm text-slate-500">
          未找到匹配的股票
        </div>
      )}
    </div>
  );
}
