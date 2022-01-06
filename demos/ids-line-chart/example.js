import IdsLineChart from '../../src/components/ids-line-chart/ids-line-chart';

const lineData = [{
  data: [{
    name: 'Jan',
    value: 100
  }, {
    name: 'Feb',
    value: 3111
  }, {
    name: 'Mar',
    value: 3411
  }, {
    name: 'Apr',
    value: 500
  }, {
    name: 'May',
    value: 3411
  }, {
    name: 'Jun',
    value: 6500
  }],
  name: 'Component A',
  legendShortName: 'Comp A',
  legendAbbrName: 'A',
}, {
  data: [{
    name: 'Jan',
    value: 2211
  }, {
    name: 'Feb',
    value: 2111
  }, {
    name: 'Mar',
    value: 2411
  }, {
    name: 'Apr',
    value: 2011
  }, {
    name: 'May',
    value: 2411
  }, {
    name: 'Jun',
    value: 2811
  }],
  name: 'Component B',
  legendShortName: 'Comp B',
  legendAbbrName: 'B'
}, {
  data: [{
    name: 'Jan',
    value: 1211
  }, {
    name: 'Feb',
    value: 1111
  }, {
    name: 'Mar',
    value: 1411
  }, {
    name: 'Apr',
    value: 1011
  }, {
    name: 'May',
    value: 8000
  }],
  name: 'Component C',
  legendShortName: 'Comp C',
  legendAbbrName: 'C'
}];

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
  legendShortName: 'Comp A',
  legendAbbrName: 'A',
}];

document.querySelector('ids-line-chart').data = lineData;
