import { useStocks } from './hooks/useStocks';
import SearchBar from './components/SearchBar';
import WatchList from './components/WatchList';
import KLineChart from './components/KLineChart';
import OrderBook from './components/OrderBook';
import TimeSeriesChart from './components/TimeSeriesChart';
import { formatPrice, changePercent } from './utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

function App() {
  const {
    stocks,
    allStocks,
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
  } = useStocks(2000);

  const pct = selectedStock ? changePercent(selectedStock.price, selectedStock.prevClose) : 0;
  const isUp = pct >= 0;

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <SearchBar
        searchStock={searchStock}
        addToWatchlist={addToWatchlist}
        isInWatchlist={isInWatchlist}
        onSelect={setSelectedCode}
        allStocks={allStocks}
      />
      <div className="flex-1 flex overflow-hidden">
        <WatchList
          stocks={stocks}
          selectedCode={selectedCode}
          onSelect={setSelectedCode}
          onRemove={removeFromWatchlist}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 border-b border-slate-700 flex items-center gap-4">
            <span className="text-lg font-bold text-slate-100">{selectedStock?.name}</span>
            <span className="text-xs text-slate-500">{selectedStock?.code}</span>
            <span className="text-xl font-bold" style={{ color: isUp ? '#ef4444' : '#22c55e' }}>
              {selectedStock ? formatPrice(selectedStock.price) : '--'}
            </span>
            <span className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-red-400' : 'text-green-400'}`}>
              {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isUp ? '+' : ''}{pct.toFixed(2)}%
            </span>
          </div>
          <div className="flex-1 flex min-h-0">
            <KLineChart data={kline} period={period} onPeriodChange={setPeriod} />
            <div className="w-64 flex flex-col">
              <OrderBook bids={orderBook.bids} asks={orderBook.asks} currentPrice={selectedStock?.price || 0} />
              <TimeSeriesChart data={ticks} prevClose={selectedStock?.prevClose || 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
