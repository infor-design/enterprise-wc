import '../../src/components/ids-breadcrumb/ids-breadcrumb';
import '../../src/components/ids-layout-grid/ids-layout-grid';
import '../../src/components/ids-layout-grid/ids-layout-grid-cell';
import '../../src/components/ids-button/ids-button';
import '../../src/components/ids-checkbox/ids-checkbox';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

const [button1, button2] = document.querySelectorAll('ids-button');
const breadcrumb = document.querySelector('ids-breadcrumb');
const checkbox = document.querySelector('ids-checkbox');
button1.onclick = () => {
  const link = new IdsHyperlink();
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  if (checkbox.checked) link.disabled = '';
  breadcrumb.add(link);
};

button2.onclick = () => breadcrumb.delete();
