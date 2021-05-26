import '../../src/ids-breadcrumb/ids-breadcrumb';
import '../../src/ids-breadcrumb/ids-breadcrumb-item';
import '../../src/ids-layout-grid/ids-layout-grid';
import '../../src/ids-layout-grid/ids-layout-grid-cell';
import '../../src/ids-button/ids-button';
import IdsHyperlink from '../../src/ids-hyperlink/ids-hyperlink';
import IdsText from '../../src/ids-text/ids-text';

const [button1, button2, button3, ...rest] = document.querySelectorAll('ids-button');
const breadcrumb = document.querySelector('ids-breadcrumb');
button1.onclick = () => { 
  const link = new IdsHyperlink();
  link.innerText = 'New Link';
  link.href = '#';
  breadcrumb.push(link);
}

button2.onclick = () => { 
  const text = new IdsText();
  text.innerText = 'New Text';
  text.display = 'inline';
  breadcrumb.push(text);
}

button3.onclick = () => breadcrumb.pop();
