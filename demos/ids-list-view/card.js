import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import IdsCard from '../../src/components/ids-card/ids-card';
import './index.scss';

// Example for populating the List View
const listView = document.querySelectorAll('ids-list-view');

// Do an ajax request and apply the data to the list
const url = '/data/products.json';

fetch(url)
  .then(
    (res) => {
      if (res.status !== 200) {
        return;
      }

      res.json().then((data) => {
        listView.forEach((l) => {
          l.data = data;
        });
      });
    }
  );
