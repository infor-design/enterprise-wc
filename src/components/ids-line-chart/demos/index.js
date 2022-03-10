import IdsLineChart from '../ids-line-chart';
import componentsJSON from '../../../assets/data/components.json';

// eslint-disable-next-line no-unused-vars
const lineData2 = [{
  data: [{
    name: 'Jan',
    value: 1
  }, {
    name: 'Feb',
    value: 2
  }, {
    name: 'Mar',
    value: 3
  }, {
    name: 'Apr',
    value: 5
  }, {
    name: 'May',
    value: 7
  }, {
    name: 'Jun',
    value: 10
  }],
  name: 'Component A',
  shortName: 'Comp A',
  abbreviatedName: 'A',
}, {
  data: [{
    name: 'Jan',
    value: 12
  }, {
    name: 'Feb',
    value: 12
  }, {
    name: 'Mar',
    value: 13
  }, {
    name: 'Apr',
    value: 15
  }, {
    name: 'May',
    value: 17
  }, {
    name: 'Junx',
    value: 110
  }],
  name: 'Component B',
  shortName: 'Comp B',
  abbreviatedName: 'B',
}];

const setData = async () => {
  const res = await fetch(componentsJSON);
  const data = await res.json();
  const chart = document.querySelector('#index-example');
  if (chart) {
    chart.data = data;
  }
};

setData();
