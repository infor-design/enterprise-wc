import '../ids-line-chart';
import componentsJSON from '../../../assets/data/components.json';

const setData = async () => {
  const res = await fetch(componentsJSON as any);
  const data = await res.json();
  (document as any).querySelector('ids-line-chart').data = data;
};

await setData();
