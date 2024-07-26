// Supporting components
import '../ids-list-view';
import productsJSON from '../../../assets/data/products-with-groups.json';
import css from '../../../assets/css/ids-list-view/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-selectable-multiple');

if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();

    let j = 1;
    data.forEach((elem: any) => {
      if (!elem.isGroupHeader) {
        elem.productName = `Product ${j}`;
        j++;
      }
    });

    listView.data = data;
    console.info('List Has', listView.data.length, 'items including headers');
  };

  listView.addEventListener('selected', (e: any) => {
    console.info('selected event called', e.detail);
  });
  listView.addEventListener('activated', (e: any) => {
    console.info('activated event called', e.detail);
  });
  listView.addEventListener('click', (e: any) => {
    console.info('clicked event called', e.detail);
  });
  listView.addEventListener('deselected', (e: any) => {
    console.info('deselected event called', e.detail);
  });

  document.querySelector('#add-more')!.addEventListener('click', async () => {
    const dataCopy = structuredClone(listView.data);

    let k = Number(dataCopy[dataCopy.length - 1].productName.replace('Product ', ''));
    dataCopy.forEach((elem: any) => {
      if (!elem.isGroupHeader) {
        k++;
        elem.productName = `Product ${k}`;
      }
    });

    // allData = [...allData, ...dataCopy];
    listView.appendToBottom(dataCopy);
    console.info('List Has', listView.data.length, 'items including headers');
  });
  await setData();
}
