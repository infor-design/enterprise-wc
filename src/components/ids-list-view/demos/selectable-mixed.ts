// Supporting components
import '../ids-list-view';
import productsJSON from '../../../assets/data/products-100.json';

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-selectable-mixed');

if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView.data = data;
  };

  listView.addEventListener('selected', (e: any) => {
    console.info('selected event called', e.detail);
  });
  listView.addEventListener('deselected', (e: any) => {
    console.info('deselected event called', e.detail);
  });
  listView.addEventListener('click', (e: any) => {
    console.info('clicked event called', e.detail);
  });
  listView.addEventListener('activated', (e: any) => {
    console.info('activated event called', e.detail);
  });
  listView.addEventListener('deactivated', (e: any) => {
    console.info('deactivated event called', e.detail);
  });
  await setData();
}
