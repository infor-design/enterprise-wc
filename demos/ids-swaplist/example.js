// Example for populating the List View
const swaplist = document.querySelector('#swaplist-1');

// Do an ajax request and apply the data to the list
const url = '/data/periods.json';

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  swaplist.data = data;
  // data.forEach((d) => {
  //   d.data = data;
  //   s.innerHTML += `
  //     <ids-swappable-item>
  //       <ids-text>${d.city}</ids-text>
  //     </ids-swappable-item>
  //   `;
  // });
};

setData();
