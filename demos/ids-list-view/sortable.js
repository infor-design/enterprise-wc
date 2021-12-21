import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import IdsDraggable from '../../src/components/ids-draggable/ids-draggable';
import './index.scss';

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const xmlhttp = new XMLHttpRequest();
const url = '/data/events.json';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200 && listView) {
    listView.forEach((l) => {
      l.data = JSON.parse(this.responseText);
    });
  }
};

// Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
