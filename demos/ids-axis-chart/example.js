const url = '/data/components.json';
const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  document.querySelector('ids-axis-chart').data = data;
};

setData();
