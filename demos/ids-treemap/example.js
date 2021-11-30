document.addEventListener('DOMContentLoaded', () => {
  const treeMapEl = document.querySelector('ids-treemap');

  treeMapEl.result = treeMapEl.treeMap({
    data: [
      { value: 28, color: '#003876', label: '28%' },
      { value: 18, color: '#004A99', label: '18%' },
      { value: 8, color: '#0054B1', label: '8%' },
      { value: 8, color: '#0066D4', label: '8%' },
      { value: 17, color: '#0072ED', label: '17%' },
      { value: 7, color: '#1C86EF', label: '7%' },
      { value: 14, color: '#55A3F3', label: '14%' },
    ],
    width: 1000,
    height: 300
  });
});
