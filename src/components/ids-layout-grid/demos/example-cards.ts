document.addEventListener('DOMContentLoaded', () => {
  const btnToggle: any = document.querySelector('#edit-toggle-button');
  const gridCells: any = document.querySelectorAll('ids-layout-grid-cell');

  btnToggle?.addEventListener('click', (e: any) => {
    e.target.toggle();

    if (e.target.pressed === true) {
      gridCells.forEach((cell: any) => {
        cell.enableEditable();
        console.log(cell);
      });
    } else {
      gridCells.forEach((cell: any) => {
        cell.disableEditable();
      });
    }
  });
});
