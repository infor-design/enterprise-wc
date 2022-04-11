export const appendStyleSheets = (...styles: string[]) => {
  let sheet = styles.join('\n');
  sheet = sheet.replaceAll(':host {', ':root {');
  const stylesheet = `<style rel="stylesheet" nonce="0a59a005">${sheet}</style>`;
  (document as any).querySelector('head').insertAdjacentHTML('afterbegin', stylesheet);
  document.body.removeAttribute('hidden');
};
