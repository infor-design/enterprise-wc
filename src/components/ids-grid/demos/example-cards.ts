document.addEventListener('DOMContentLoaded', () => {
  const btnToggle: any = document.querySelector('#edit-toggle-button');
  const gridCells: any = document.querySelectorAll('ids-grid-cell');

  btnToggle?.addEventListener('click', (e: any) => {
    e.target.toggle();

    if (e.target.pressed === true) {
      gridCells.forEach((cell: any) => {
        cell.enableEditable();
      });
    } else {
      gridCells.forEach((cell: any) => {
        cell.disableEditable();
      });
    }
  });
});
