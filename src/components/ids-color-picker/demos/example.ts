const picker1 = document.querySelector('ids-color-picker');
picker1.addEventListener('change', (evt: any) => {
  console.log('change', evt.detail.value);
});

picker1.addEventListener('input', (evt: any) => {
  console.log('input', evt.detail.value);
});

const advanced = document.querySelector('#advanced');
advanced?.addEventListener('change', (evt: any) => {
  console.log('change', evt.detail.value);
});

advanced?.addEventListener('input', (evt: any) => {
  console.log('input', evt.detail.value);
});

const regular = document.querySelector('#regular');
regular?.addEventListener('change', (evt: any) => {
  console.log('change', evt.target.value);
});

regular?.addEventListener('input', (evt: any) => {
  console.log('input', evt.target.value);
});