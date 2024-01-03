import css from '../../../assets/css/ids-data-grid/auto-fit.css';
import IdsBarChart from '../ids-bar-chart';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

document.querySelector<IdsBarChart>('ids-bar-chart')!.data = [
  {
    data: [
      { name: 'Foo', value: 1 },
      { name: 'Bar', value: 1 },
    ],
  },
];
