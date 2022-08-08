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
  const pager: any = document.querySelector('ids-pager');
  pager.total = data.length;
  listView.pageSize = pager.pageSize;
  listView.pageTotal = data.length;
  listView.data = data;

  pager.addEventListener('pagenumberchange', (e: CustomEvent) => {
    console.info(`pagenumberchange page # ${e.detail.value}`);
    const pageNumber = e.detail.value;
    listView.pageNumber = pageNumber;
    listView.data = data;
  });
});
