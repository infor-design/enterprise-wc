// Supporting components
import '../ids-pager';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  const pager = document.querySelector('#ids-pager-example');
  pager?.addEventListener('pagenumberchange', (e: any) => {
    console.info('pagenumberchange event fired ', e.detail.value);
  });
});
