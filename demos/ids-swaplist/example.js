// Example for populating the List View
const swappable1 = document.querySelector('#swaplist-1').container.querySelectorAll('ids-swappable');

// Do an ajax request and apply the data to the list
const url = '/data/periods.json';

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  swappable1.forEach((s) => {
    data.forEach((d) => {
      s.innerHTML += `
        <ids-swappable-item>
          <ids-text>${d.city}</ids-text>
        </ids-swappable-item>
      `;
    });
  });
};

setData();
