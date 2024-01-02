document.addEventListener('DOMContentLoaded', () => {
  const story = document.querySelector('#example-story')?.textContent || '';
  const containerElem = document.querySelector('#line-clamp-dynamic');

  if (containerElem) {
    const textTemplate = `<ids-text font-size="20" line-clamp="4">${story}</ids-text>`;
    containerElem.insertAdjacentHTML('beforeend', textTemplate);
  }
});
