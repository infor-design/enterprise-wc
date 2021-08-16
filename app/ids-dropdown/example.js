document.querySelector('#dropdown-1')?.addEventListener('change', (e) => {
  console.info(`Value Changed to ${e.target.value}: ${e.target.selectedOption.textContent}`);
});
