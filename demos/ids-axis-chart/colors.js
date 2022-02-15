import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';

const url = '/data/components-colors.json';
const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  document.querySelector('ids-axis-chart').data = data;
};

setData();
