import './test-sandbox.scss';
import IdsTooltip from '../../src/ids-tooltip/ids-tooltip';

// Use the syncronous `beforeshow` event to log a message
const tooltipTop = document.querySelector('[target="#tooltip-top"]');
tooltipTop.addEventListener('beforeshow', (e) => {
  console.info('beforeshow', e, e.detail);
});

// Use the asyncronous `beforeshow` event to load contents
const getContents = () => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/api/bikes', true);
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
