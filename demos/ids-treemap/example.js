document.addEventListener('DOMContentLoaded', () => {
  const treeMapEl = document.querySelector('ids-treemap');

  treeMapEl.treeMap({
    data: [
      { value: 10 },
      { value: 7 },
      { value: 4 },
      { value: 1 },
      { value: 5 },
      { value: 9 },
    ],
    width: 700,
    height: 600
  });
});
