import IdsAreaChart from '../../src/components/ids-area-chart/ids-area-chart';

const url = '/data/components-colors.json';
const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();

  // Test other colors
  // data[0].color = 'red';
  // data[1].color = 'orange';
  // data[2].color = 'purple';

  document.querySelector('ids-area-chart').data = data;
};

setData();
