import IdsListView from '../../src/ids-list-view/ids-list-view';
import IdsCard from '../../src/ids-card/ids-card';

// Example for populating the List View
const listView = document.querySelector('#list-view-1');

// 1. Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = 'http://localhost:4300/api/products';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    // 2. Set it on IdsListView.data
    listView.data = JSON.parse(this.responseText);

    // 4. Test Iteration
    // listView.data.forEach((item, i) => {
    //  console.log(item, i);
    // });
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
