import { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (code: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
      <Search className="w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            onSearch(value.trim());
          }
        }}
        placeholder="输入股票代码搜索..."
        className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none flex-1"
      />
    </div>
  );
}
