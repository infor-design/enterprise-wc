document.addEventListener('DOMContentLoaded', () => {
  const treeDemo = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const xmlhttp = new XMLHttpRequest();
      const url = '/data/tree-basic.json';

      xmlhttp.onreadystatechange = function onreadystatechange() {
        if (this.readyState === 4 && this.status === 200) {
          treeDemo.data = JSON.parse(this.responseText);
        }
      };

      // Execute the request
      xmlhttp.open('GET', url, true);
      xmlhttp.send();

      // On selected
      treeDemo.addEventListener('selected', (e) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});
