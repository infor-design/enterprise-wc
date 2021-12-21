// Example for populating the List Builder with Ajax
const listBuilder = document.querySelector('ids-list-builder');

// Do an ajax request and apply the data to the list
const url = '/data/bikes.json';

fetch(url)
  .then(
    (res) => {
      if (res.status !== 200) {
        return;
      }

      res.json().then((data) => {
        listBuilder.data = data;
      });
    }
  );
