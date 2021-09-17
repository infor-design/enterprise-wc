document.querySelector('#dropdown-1')?.addEventListener('change', (e) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});

document.querySelector('#dropdown-1')?.addEventListener('focus', (e) => {
  console.info(`Focus Changed to ${e.target}`);
});

// Use the asynchronous `beforeshow` callback to load contents
const getContents = () => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/data/states.json', true);
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      resolve(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
});

const dropdownAsync = document.querySelector('#dropdown-7');
dropdownAsync.beforeShow = async function beforeShow() {
  return getContents();
};
