import componentsJSON from '../../../assets/data/items-single-patterns.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  const chart: any = document.querySelector('#pattern-example');
  if (chart) {
    chart.data = data;
  }
};

await setData();
