import IdsText from '../ids-text';

document.addEventListener('DOMContentLoaded', () => {
  const story = document.querySelector('#example-story')?.textContent || '';
  const containerElem = document.querySelector('#line-clamp-dynamic');

  if (containerElem) {
    const textElem = document.createElement('ids-text') as IdsText;
    textElem.textContent = story;
    textElem.lineClamp = 4;
    textElem.fontSize = 20;
    containerElem.insertAdjacentElement('beforeend', textElem);
  }
});
