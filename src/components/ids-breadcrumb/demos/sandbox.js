const enableListTruncationCheck = document.querySelector('#enable-truncation');
const addBtn = document.querySelector('#add-new-breadcrumb');
const removeBtn = document.querySelector('#remove-last-breadcrumb');

const breadcrumb = document.querySelector('ids-breadcrumb');
const disableBreadcrumbCheck = document.querySelector('#disable-breadcrumb');

// Click the "Add Link" button to add breadcrumbs
addBtn.onclick = () => {
  const link = document.createElement('ids-hyperlink');
  link.innerText = `Breadcrumb ${breadcrumb.children.length + 1}`;
  link.href = '#';
  link.disabled = disableBreadcrumbCheck.checked;
  breadcrumb.add(link);
};

// Click "remove" to remove
removeBtn.onclick = () => breadcrumb.delete();

// Enable/Disable truncation
enableListTruncationCheck.addEventListener('change', (e) => {
  breadcrumb.truncate = e.target.checked;
});
