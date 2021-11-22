document.addEventListener('DOMContentLoaded', () => {
  const treeMapEl = document.querySelector('ids-treemap');

  treeMapEl.result = treeMapEl.treeMap({
    data: [
      { value: 23 },
      { value: 20 },
      { value: 19 },
      { value: 14 },
      { value: 9 },
      { value: 8 },
      { value: 7 },
    ],
    width: 700,
    height: 600
  });

  console.log(treeMapEl.result);
});
