import '../ids-pie-chart';
import componentsColorsJSON from '../../../assets/data/items-single-color.json';

const setData = async () => {
  const res = await fetch(componentsColorsJSON as any);
  const data = await res.json();
  (document.querySelector('ids-pie-chart') as any).data = data;
};

await setData();
