import ReactECharts from 'echarts-for-react';
import { KLineData, KLinePeriod } from '../types';

interface Props {
  data: KLineData[];
  period: KLinePeriod;
  onPeriodChange: (p: KLinePeriod) => void;
}

export default function KLineChart({ data, period, onPeriodChange }: Props) {
  const dates = data.map((d) => d.date);
  const kValues = data.map((d) => [d.open, d.close, d.low, d.high]);
  const volumes = data.map((d) => d.volume);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      formatter: (params: any[]) => {
        const k = params.find((p) => p.seriesName === 'K线');
        const v = params.find((p) => p.seriesName === '成交量');
        if (!k) return '';
        const [open, close, low, high] = k.data;
        const color = close >= open ? '#ef4444' : '#22c55e';
        return `
          <div style="font-size:12px">
            <div style="color:#94a3b8;margin-bottom:4px">${k.axisValue}</div>
            <div>开盘: <span style="color:${color}">${open.toFixed(2)}</span></div>
            <div>收盘: <span style="color:${color}">${close.toFixed(2)}</span></div>
            <div>最高: <span style="color:#ef4444">${high.toFixed(2)}</span></div>
            <div>最低: <span style="color:#22c55e">${low.toFixed(2)}</span></div>
            <div>成交量: ${v ? (v.data / 10000).toFixed(2) + '万' : '-'}</div>
          </div>
        `;
      },
    },
    grid: [
      { left: '8%', right: '4%', top: '12%', height: '55%' },
      { left: '8%', right: '4%', top: '72%', height: '18%' },
    ],
    xAxis: [
      {
        type: 'category',
        data: dates,
        gridIndex: 0,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      {
        type: 'category',
        data: dates,
        gridIndex: 1,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      {
        type: 'value',
        gridIndex: 1,
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: [0, 1], start: 60, end: 100 },
      { type: 'slider', xAxisIndex: [0, 1], start: 60, end: 100, height: 16, bottom: 4, borderColor: '#334155', fillerColor: 'rgba(59,130,246,0.2)', handleStyle: { color: '#3b82f6' }, textStyle: { color: '#64748b' } },
    ],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: kValues,
        itemStyle: {
          color: '#ef4444',
          color0: '#22c55e',
          borderColor: '#ef4444',
          borderColor0: '#22c55e',
        },
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumes.map((v, i) => ({
          value: v,
          itemStyle: {
            color: kValues[i][1] >= kValues[i][0] ? '#ef4444' : '#22c55e',
          },
        })),
      },
    ],
  };

  const periods: { key: KLinePeriod; label: string }[] = [
    { key: 'day', label: '日K' },
    { key: 'week', label: '周K' },
    { key: 'month', label: '月K' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-800/50 border-r border-slate-700">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-700">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => onPeriodChange(p.key)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              period === p.key ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ width: '100%', height: '100%' }} notMerge={true} />
      </div>
    </div>
  );
}
