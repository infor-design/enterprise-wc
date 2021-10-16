document.addEventListener('DOMContentLoaded', () => {
  const listBuilder = document.querySelector('ids-list-builder');

  const xmlhttp = new XMLHttpRequest();
  const url = '/data/products.json';

  xmlhttp.onreadystatechange = function onreadystatechange() {
    if (this.readyState === 4 && this.status === 200 && listBuilder) {
      listBuilder.data = JSON.parse(this.responseText);
    }
  };

  xmlhttp.open('GET', url, true);
  xmlhttp.send();
});
