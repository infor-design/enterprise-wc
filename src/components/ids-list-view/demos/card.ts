import productsJSON from '../../../assets/data/products-100.json';

// Example for populating the List View

const fetchData = async (url: any) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

window.addEventListener('load', async () => {
  // Do an ajax request and apply the data to the list
  const data = await fetchData(productsJSON);

  const listView: any = document.querySelector('ids-list-view');
  listView.pager = document.querySelector('ids-pager');
  listView.data = data;
});
