import './sandbox.scss';
import IdsTooltip from '../../src/components/ids-tooltip/ids-tooltip';
import IdsInput from '../../src/components/ids-input/ids-input';

// Use the syncronous `beforeshow` event to log a message
const tooltipTop = document.querySelector('[target="#tooltip-top"]');
tooltipTop.addEventListener('beforeshow', (e) => {
  console.info('beforeshow', e, e.detail);
});

const url = '/data/bikes.json';
const tooltipAsync = document.querySelector('[target="#tooltip-async"]');

// Use the asyncronous `beforeshow` callback to load contents
tooltipAsync.beforeShow = async function beforeShow() {
  const res = await fetch(url);
  const data = await res.json();

  return data[1].manufacturerName;
};
