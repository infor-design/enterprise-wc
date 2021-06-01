import '../../src/ids-breadcrumb/ids-breadcrumb';
import '../../src/ids-layout-grid/ids-layout-grid';
import '../../src/ids-layout-grid/ids-layout-grid-cell';
import '../../src/ids-button/ids-button';
import '../../src/ids-checkbox/ids-checkbox';
import IdsHyperlink from '../../src/ids-hyperlink/ids-hyperlink';

const [button1, button2] = document.querySelectorAll('ids-button');
const breadcrumb = document.querySelector('ids-breadcrumb');
const checkbox = document.querySelector('ids-checkbox');
button1.onclick = () => {
  const link = new IdsHyperlink();
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  if (checkbox.checked) link.disabled = '';
  breadcrumb.push(link);
};

button2.onclick = () => breadcrumb.pop();
