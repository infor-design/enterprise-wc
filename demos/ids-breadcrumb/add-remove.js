import IdsBreadcrumb from '../../src/components/ids-breadcrumb/ids-breadcrumb';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';
import IdsText from '../../src/components/ids-text/ids-text';
import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';

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
