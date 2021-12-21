import IdsNotificationBanner from '../../src/components/ids-notification-banner/ids-notification-banner';
import IdsCard from '../../src/components/ids-card/ids-card';
import IdsListView from '../../src/components/ids-list-view/ids-list-view';

// Example for populating the List View
const listView = document.querySelector('#list-view-1');

// Do an ajax request and apply the data to the list
const url = '/data/bikes.json';

fetch(url)
  .then(
    (res) => {
      if (res.status !== 200) {
        return;
      }

      res.json().then((data) => {
        listView.data = data;
      });
    }
  );
