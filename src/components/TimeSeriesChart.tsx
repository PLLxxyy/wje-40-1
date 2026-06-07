import ReactECharts from 'echarts-for-react';
import { TickData } from '../types';

interface Props {
  data: TickData[];
  prevClose: number;
}

export default function TimeSeriesChart({ data, prevClose }: Props) {
  const times = data.map((d) => d.time);
  const prices = data.map((d) => d.price);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      formatter: (params: any[]) => {
        const p = params[0];
        return `<div style="font-size:12px"><div style="color:#94a3b8">${p.axisValue}</div><div>价格: ${p.data.toFixed(2)}</div></div>`;
      },
    },
    grid: { left: '12%', right: '4%', top: '10%', bottom: '15%' },
    xAxis: {
      type: 'category',
      data: times,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', fontSize: 10, interval: Math.floor(times.length / 6) },
    },
    yAxis: {
      type: 'value',
      min: (value: any) => Math.min(value.min, prevClose * 0.98),
      max: (value: any) => Math.max(value.max, prevClose * 1.02),
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#64748b', fontSize: 10 },
    },
    series: [
      {
        type: 'line',
        data: prices,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#3b82f6',
          width: 1.5,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59,130,246,0.2)' },
              { offset: 1, color: 'rgba(59,130,246,0)' },
            ],
          },
        },
        markLine: {
          silent: true,
          data: [{ yAxis: prevClose, lineStyle: { color: '#64748b', type: 'dashed', width: 1 } }],
          label: { show: false },
        },
      },
    ],
  };

  return (
    <div className="flex-1 min-h-0 bg-slate-800/50 p-2">
      <h3 className="text-xs font-semibold text-slate-300 mb-1">分时图</h3>
      <ReactECharts option={option} style={{ width: '100%', height: 'calc(100% - 20px)' }} />
    </div>
  );
}
