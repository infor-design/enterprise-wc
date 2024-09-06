document.querySelectorAll('ids-notification-banner').forEach((el) => {
  el.addEventListener('beforeclose', (e) => {
    console.info('beforeclose fired', e);
  });
  el.addEventListener('close', (e) => {
    console.info('close fired', e);
  });
  el.addEventListener('afterclose', (e) => {
    console.info('afterclose fired', e);
  });
});
