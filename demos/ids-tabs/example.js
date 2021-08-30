document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelector('ids-tabs');

  tabs.addEventListener('change', (e) => {
    console.info(`ids-tabs.on('change') =>`, e.target.value);
  });
});
