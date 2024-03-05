document.addEventListener('DOMContentLoaded', () => {
  const contents = document.querySelector('#contents');
  const exampleHtml = `
    <ids-text>Version: ${window.IdsGlobal.version}</ids-text>
    <ids-text>Theme Name: ${window.IdsGlobal.themeName}</ids-text>
  `;
  contents?.insertAdjacentHTML('beforeend', exampleHtml);
});
