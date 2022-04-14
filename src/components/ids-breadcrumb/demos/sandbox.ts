const enableListTruncationCheck: any = document.querySelector('#enable-truncation');
const addBtn: any = document.querySelector('#add-new-breadcrumb');
const removeBtn: any = document.querySelector('#remove-last-breadcrumb');

const breadcrumb: any = document.querySelector('ids-breadcrumb');
const disableBreadcrumbCheck: any = document.querySelector('#disable-breadcrumb');

// Click the "Add Link" button to add breadcrumbs
addBtn.onclick = () => {
  const link: any = document.createElement('ids-hyperlink');
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  link.disabled = disableBreadcrumbCheck.checked;
  breadcrumb.add(link);
};

// Click "remove" to remove
removeBtn.onclick = () => breadcrumb.delete();

// Enable/Disable truncation
enableListTruncationCheck.addEventListener('change', (e: any) => {
  breadcrumb.truncate = e.target?.checked;
});
