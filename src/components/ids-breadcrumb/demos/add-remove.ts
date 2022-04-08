const [button1, button2]: any = document.querySelectorAll('ids-button');
const breadcrumb: any = document.querySelector('ids-breadcrumb');
const checkbox: any = document.querySelector('ids-checkbox');
button1.onclick = () => {
  const link: any = document.createElement('ids-hyperlink');
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  if (checkbox.checked) link.disabled = '';
  breadcrumb.add(link);
};

button2.onclick = () => breadcrumb.delete();
