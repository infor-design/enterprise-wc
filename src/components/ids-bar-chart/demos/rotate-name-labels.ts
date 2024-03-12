import componentsJSON from '../../../assets/data/components-long-text.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#rotate-name-labels-example');
  if (chart) {
    chart.data = data;
  }
};

await setData();
