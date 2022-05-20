const updateOutputText = (text: string) => {
  const outputElem = document.querySelector('#output');
  if (outputElem) outputElem.textContent = text;
};

// Setup normal click events on the actions
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#action-left-reveal')?.addEventListener('click', () => {
    updateOutputText('Left Action (Reveal Mode) was chosen');
  });
  document.querySelector('#action-right-reveal')?.addEventListener('click', () => {
    updateOutputText('Right Action (Reveal Mode) was chosen');
  });
  document.querySelector('#action-right-reveal-one')?.addEventListener('click', () => {
    updateOutputText('Right Action (Reveal / One Action Mode) was chosen');
  });
  document.querySelector('#action-left-continuous')?.addEventListener('click', () => {
    updateOutputText('Left Action (Continuous Mode) was chosen');
  });
  document.querySelector('#action-right-continuous')?.addEventListener('click', () => {
    updateOutputText('Right Action (Continuous Mode) was chosen');
  });
});
