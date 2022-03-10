import componentsColorsJSON from '../../../assets/data/components-colors.json';

const setData = async () => {
  const res = await fetch(componentsColorsJSON);
  const data = await res.json();
  document.querySelector('ids-line-chart').data = data;
};

setData();
