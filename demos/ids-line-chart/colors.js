import IdsLineChart from '../../src/components/ids-line-chart/ids-line-chart';

const url = '/data/components-colors.json';
const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  document.querySelector('ids-line-chart').data = data;
};

setData();
