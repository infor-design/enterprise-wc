import '../ids-axis-chart';
import componentsColorsJSON from '../../../assets/data/components-colors.json';

const setData = async () => {
  const res = await fetch(componentsColorsJSON as any);
  const data = await res.json();
  (document.querySelector('ids-axis-chart') as any).data = data;
};

await setData();
