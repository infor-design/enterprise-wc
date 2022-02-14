import '../ids-breadcrumb/ids-breadcrumb.js';
import '../ids-hyperlink/ids-hyperlink.js';
import '../ids-text/ids-text.js';
import '../ids-checkbox/ids-checkbox.js';

const [button1, button2] = document.querySelectorAll('ids-button');
const breadcrumb = document.querySelector('ids-breadcrumb');
const checkbox = document.querySelector('ids-checkbox');
button1.onclick = () => {
  const link = document.createElement('ids-hyperlink');
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  if (checkbox.checked) link.disabled = '';
  breadcrumb.add(link);
};

button2.onclick = () => breadcrumb.delete();
