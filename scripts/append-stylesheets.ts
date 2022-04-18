import cssVars from '../src/core/ids-element.scss';

const style = document.createElement('style');
style.textContent = cssVars.replace(':host {', ':root {');
style.id = 'ids-styles';
const doc = (document.head as any);
doc.appendChild(style);

export const appendStyleSheets = (...styles: string[]) => {
  let sheet = styles.join('\n');
  sheet = sheet.replaceAll(':host {', ':root {');
  const stylesheet = `<style rel="stylesheet" nonce="0a59a005">${sheet}</style>`;
  (document as any).querySelector('head').insertAdjacentHTML('afterbegin', stylesheet);
  document.body.removeAttribute('hidden');
};
