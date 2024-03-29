// Populate the List View
(async function init() {
  const swaplist: any = document.querySelector('ids-swaplist')!;
  // eslint-disable-next-line no-template-curly-in-string
  swaplist.defaultTemplate = '<ids-text>${text}</ids-text>';
  swaplist.data = [
    {
      id: 0,
      name: 'Available',
      items: [
        {
          id: 0,
          text: 'Foo',
          value: 'foo',
        },
        {
          id: 1,
          text: 'Bar',
          value: 'bar',
        },
        {
          id: 2,
          text: 'Baz',
          value: 'baz',
        },
      ],
    },
    {
      id: 1,
      name: 'Selected',
      items: [],
    },
  ];

  // Setup attach button
  document.querySelector('#reattach')?.addEventListener('click', () => {
    const swaplistParent = swaplist.parentNode!;
    swaplistParent.removeChild(swaplist);
    swaplistParent.appendChild(swaplist);
  });
}());
