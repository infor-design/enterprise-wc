import '../ids-bar-chart';
import '../../ids-axis-chart/ids-axis-chart';
import '../../ids-tooltip/ids-tooltip';

import componentsJSON from '../../../assets/data/components-single.json';

const url = componentsJSON;
const setData = async () => {
  const res = await fetch(url as any);
  const data = await res.json();

  const chart: any = document.querySelector('#index-example');
  if (chart) {
    chart.data = data;
  }
};

setData();
