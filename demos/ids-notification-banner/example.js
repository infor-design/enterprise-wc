import IdsNotificationBanner from '../../src/components/ids-notification-banner';

// Example for populating the List View
const listView = document.querySelector('#list-view-1');

// Do an ajax request and apply the data to the list
const xmlhttp = new XMLHttpRequest();
const url = '/data/bikes.json';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200 && listView) {
    listView.data = JSON.parse(this.responseText);
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
