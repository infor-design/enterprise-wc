document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.getElementById('ids-tabs-basic');

  tabs.addEventListener('change', (e) => {
    console.info(`#${e.target.getAttribute('id')}.on('change') =>`, e.target.value);
  });
});
