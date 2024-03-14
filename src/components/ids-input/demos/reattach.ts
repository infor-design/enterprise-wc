document.querySelector('#reattach')?.addEventListener('click', () => {
  const input = document.querySelector('ids-input') as any;
  const inputParent = input?.parentNode;
  inputParent?.removeChild(input);
  inputParent.appendChild(input);
});
