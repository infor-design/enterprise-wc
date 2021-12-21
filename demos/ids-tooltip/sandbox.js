import './sandbox.scss';
import IdsTooltip from '../../src/components/ids-tooltip/ids-tooltip';
import IdsInput from '../../src/components/ids-input/ids-input';

// Use the syncronous `beforeshow` event to log a message
const tooltipTop = document.querySelector('[target="#tooltip-top"]');
tooltipTop.addEventListener('beforeshow', (e) => {
  console.info('beforeshow', e, e.detail);
});

const url = '/data/bikes.json';
// Use the asyncronous `beforeshow` callback to load contents
const getContents = () => new Promise((resolve) => {
  fetch(url)
    .then(
      (res) => {
        if (res.status !== 200) {
          return;
        }

        res.json().then((data) => {
          resolve(data[1].manufacturerName);
        });
      }
    );
});

const tooltipAsync = document.querySelector('[target="#tooltip-async"]');
tooltipAsync.beforeShow = async function beforeShow() {
  return getContents();
};
