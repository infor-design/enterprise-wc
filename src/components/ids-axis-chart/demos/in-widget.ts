import componentsJSON from '../../../assets/data/components.json';
import barChartJSON from '../../../assets/data/components-long-text.json';
import '../../ids-card/ids-card';
import '../../ids-bar-chart/ids-bar-chart';
import '../../ids-line-chart/ids-line-chart';
import '../../ids-home-page/ids-home-page';

import type IdsAxisChart from '../ids-axis-chart';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart = document.querySelector<IdsAxisChart>('#index-example');
  if (chart) {
    chart.data = data;
  }

  const lineChart = document.querySelector<IdsAxisChart>('#line-chart-example');
  if (lineChart) {
    lineChart.data = data;
  }

  const barChartRes = await fetch(barChartJSON as any);
  const barChartData = await barChartRes.json();
  const barChart = document.querySelector<IdsAxisChart>('#bar-chart-example');
  if (barChart) {
    barChart.data = barChartData;
  }
};

await setData();
