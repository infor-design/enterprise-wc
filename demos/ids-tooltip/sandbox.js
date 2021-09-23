import './sandbox.scss';
import IdsTooltip from '../../src/components/ids-tooltip';
import IdsInput from '../../src/components/ids-input';

// Use the syncronous `beforeshow` event to log a message
const tooltipTop = document.querySelector('[target="#tooltip-top"]');
tooltipTop.addEventListener('beforeshow', (e) => {
  console.info('beforeshow', e, e.detail);
});

// Use the asyncronous `beforeshow` event to load contents
const getContents = () => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/data/bikes.json', true);
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      resolve(JSON.parse(xhr.responseText)[1].manufacturerName);
    }
  };
  xhr.send();
});

const tooltipAsync = document.querySelector('[target="#tooltip-async"]');
tooltipAsync.beforeShow = async function beforeShow() {
  return getContents();
};
