document.querySelector('#dropdown-1')?.addEventListener('change', (e) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});

document.querySelector('#dropdown-1')?.addEventListener('focus', (e) => {
  console.info(`Focus Changed to ${e.target}`);
});

// Use the asynchronous `beforeshow` callback to load contents
const getContents = () => new Promise((resolve) => {
  const url = '/data/states.json';

  fetch(url)
    .then(
      (res) => {
        if (res.status !== 200) {
          return;
        }

        res.json().then((data) => {
          resolve(data);
        });
      }
    );
});

const dropdownAsync = document.querySelector('#dropdown-7');
dropdownAsync.beforeShow = async function beforeShow() {
  return getContents();
};
