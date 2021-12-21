document.addEventListener('DOMContentLoaded', () => {
  const treeDemo = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const url = '/data/tree-basic.json';

      fetch(url)
        .then(
          (res) => {
            if (res.status !== 200) {
              return;
            }

            res.json().then((data) => {
              treeDemo.data = data;
            });
          }
        );

      // On selected
      treeDemo.addEventListener('selected', (e) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});
