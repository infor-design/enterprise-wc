import componentsJSON from '../../../assets/data/items-single.json';

import '../../ids-radio/ids-radio-group';
import '../../ids-radio/ids-radio';

import type IdsRadioGroup from '../../ids-radio/ids-radio-group';
import type IdsPieChart from '../ids-pie-chart';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#index-example');
  if (chart) {
    chart.data = data;
  }
};

setData();

document.addEventListener('DOMContentLoaded', () => {
  const chartEl = document.querySelector<IdsPieChart>('#index-example')!;
  const radioGroupEl = document.querySelector<IdsRadioGroup>('#opts-legend-placement')!;

  radioGroupEl.onEvent('change.test', radioGroupEl, (e: CustomEvent) => {
    console.info(`New legend placement: ${e.detail.value}`);
    chartEl.legendPlacement = e.detail.value;
  });
});
