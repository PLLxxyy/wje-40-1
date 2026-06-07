# pdd-186 股票行情看盘

专业交易软件风格的股票行情可视化页面。

## 功能

- 中间主区域 K 线图，支持日K/周K/月K 切换
- 鼠标悬停显示开盘价、收盘价、最高价、最低价、成交量
- K 线图下方联动成交量柱状图
- 左侧自选股列表，显示最新价与涨跌幅，点击切换主图
- 右侧上方买卖五档盘口
- 右侧下方分时图
- 顶部股票代码搜索框
- 数据每 2 秒自动刷新

## 技术栈

- React 18 + TypeScript + Vite
- TailwindCSS
- ECharts + echarts-for-react
- Lucide React 图标

## 运行

```bash
cd pdd-186
npm install
npm run dev
```

默认端口 3000。
