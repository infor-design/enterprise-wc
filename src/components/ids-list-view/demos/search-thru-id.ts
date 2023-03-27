import productsJSON from '../../../assets/data/products-100.json';

// Import Css
import css from '../../../assets/css/ids-card/toolbar.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View

const fetchData = async (url: any) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

window.addEventListener('load', async () => {
  // Do an ajax request and apply the data to the list
  const data = await fetchData(productsJSON);

  const listView: any = document.querySelector('#lv-search-thru-id');
  // Set searchable text callback
  listView.searchableTextCallback = (item: any) => item.productName;

  listView.pager = document.querySelector('ids-pager');
  listView.data = data;
});
