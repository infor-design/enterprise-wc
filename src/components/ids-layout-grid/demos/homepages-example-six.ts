const mediaQueryMd = window.matchMedia('(max-width: 1546px)');
const gridCell2: any = document.getElementById('grid-cell-2');

mediaQueryMd.addEventListener('change', () => {
  if (mediaQueryMd.matches) {
    gridCell2.order = '-1';
  } else {
    gridCell2.order = 'revert';
  }
});
