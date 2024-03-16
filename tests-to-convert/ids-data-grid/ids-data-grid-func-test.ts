describe('IdsDataGrid Component', () => {

  // test('supports column resize', async () => {
    //   (window as any).getComputedStyle = () => ({ width: 200 });

    //   dataGrid.columns = [{
    //     id: 'price',
    //     name: 'Price',
    //     field: 'price',
    //     align: 'center',
    //     resizable: true,
    //     minWidth: 100,
    //     width: 200,
    //     maxWidth: 300
    //   },
    //   {
    //     id: 'bookCurrency',
    //     name: 'Currency',
    //     field: 'bookCurrency',
    //     align: 'right',
    //     minWidth: 100,
    //     resizable: true,
    //     maxWidth: 300
    //   }];

    //   const nodes = dataGrid.container.querySelectorAll('.resizer');
    //   expect(nodes.length).toEqual(2);

    //   // Fake a resize
    //   const mousedown = new MouseEvent('mousedown', { clientX: 224, bubbles: true });
    //   // Wrong target
    //   nodes[0].parentNode.dispatchEvent(mousedown);
    //   nodes[0].dispatchEvent(mousedown);
    //   expect(dataGrid.isResizing).toBeTruthy();
    //   expect(dataGrid.columns[0].width).toBe(200);

    //   let mousemove = new MouseEvent('mousemove', { clientX: 200, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(176);

    //   mousemove = new MouseEvent('mouseup', { clientX: 190, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(176);
    // });

    // test('supports column resize on RTL', async () => {
    //   (window as any).getComputedStyle = () => ({ width: 200 });
    //   await processAnimFrame();

    //   await IdsGlobal.getLocale().setLanguage('ar');
    //   await processAnimFrame();

    //   expect(IdsGlobal.getLocale().isRTL()).toBe(true);

    //   dataGrid.columns = [{
    //     id: 'price',
    //     name: 'Price',
    //     field: 'price',
    //     align: 'center',
    //     resizable: true,
    //     minWidth: 100,
    //     width: 200,
    //     maxWidth: 300
    //   },
    //   {
    //     id: 'bookCurrency',
    //     name: 'Currency',
    //     field: 'bookCurrency',
    //     align: 'right',
    //     minWidth: 100,
    //     resizable: true,
    //     maxWidth: 300
    //   }];

    //   await processAnimFrame();
    //   const nodes = dataGrid.container.querySelectorAll('.resizer');
    //   expect(nodes.length).toEqual(2);

    //   // Fake a resize
    //   const mousedown = new MouseEvent('mousedown', { clientX: 224, bubbles: true });
    //   // Wrong target
    //   nodes[0].parentNode.dispatchEvent(mousedown);
    //   nodes[0].dispatchEvent(mousedown);
    //   expect(dataGrid.isResizing).toBeTruthy();
    //   expect(dataGrid.columns[0].width).toBe(200);

    //   let mousemove = new MouseEvent('mousemove', { clientX: 200, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(224);

    //   // Stop Moving
    //   mousemove = new MouseEvent('mouseup', { clientX: 190, bubbles: true });
    //   document.dispatchEvent(mousemove);
    //   expect(dataGrid.columns[0].width).toBe(224);
    // });

  describe('Reordering Tests', () => {
    test('supports column reorder', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: false,
      }];

      const cols = (dataGrid).columns;
      const nodes = dataGrid.container.querySelectorAll('.reorderer');
      expect(nodes.length).toEqual(2);

      // Fake a Drag
      const dragstart = new MouseEvent('dragstart', { bubbles: true });
      nodes[0].parentNode.dispatchEvent(dragstart);
      expect(nodes[0].parentNode.classList.contains('active-drag-column')).toBeTruthy();
      const dragover: any = new CustomEvent('dragover', { bubbles: true, dataTransfer: { } } as any);
      dragover.pageY = '1';
      Object.assign(dragover, {
        dataTransfer: { setData: jest.fn(), effectAllowed: 'move' }
      });
      nodes[1].dispatchEvent(dragover);

      // simulate dragging
      const dragenter = new MouseEvent('dragenter', { bubbles: true });
      nodes[1].parentNode.dispatchEvent(dragenter);
      nodes[0].parentNode.dispatchEvent(dragenter);
      nodes[1].parentNode.dispatchEvent(dragstart);

      const dragstart2 = new MouseEvent('dragstart', { bubbles: true });
      nodes[1].parentNode.dispatchEvent(dragstart2);
      nodes[0].parentNode.dispatchEvent(dragenter);
      nodes[1].parentNode.dispatchEvent(dragenter);
      nodes[0].parentNode.dispatchEvent(dragenter);

      dataGrid.localeAPI.isRTL = () => true;
      nodes[1].parentNode.dispatchEvent(dragenter);
      nodes[0].parentNode.dispatchEvent(dragenter);
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');

      const dragend = new MouseEvent('dragend', { bubbles: true });
      nodes[1].parentNode.dispatchEvent(dragend);
      expect(nodes[0].parentNode.classList.contains('active-drag-column')).toBeFalsy();
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('none');

      const drop = new MouseEvent('drop', { bubbles: true });
      dataGrid.dragInitiated = true;
      nodes[1].parentNode.dispatchEvent(drop);

      // Overall success
      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
    });

    test('supports dragging right', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: true,
      }];

      const cols = (dataGrid).columns;
      const nodes = dataGrid.container.querySelectorAll('.reorderer');

      // Fake a Drag
      const dragstart = new MouseEvent('dragstart', { bubbles: true });
      nodes[2].dispatchEvent(dragstart);
      dataGrid.dragInitiated = true;

      // simulate dragging
      const dragenter = new MouseEvent('dragenter', { bubbles: true });
      nodes[1].dispatchEvent(dragenter);
      nodes[0].dispatchEvent(dragenter);
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');

      const dragend = new MouseEvent('dragend', { bubbles: true });
      nodes[0].dispatchEvent(dragend);

      dataGrid.dragInitiated = true;
      const drop = new MouseEvent('drop', { bubbles: true });
      nodes[0].dispatchEvent(drop);

      // Overall success
      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
    });

    test('supports dragging when right to left', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: true,
      }];
      await processAnimFrame();

      await IdsGlobal.getLocale().setLanguage('ar');
      await processAnimFrame();

      const cols = (dataGrid).columns;
      const nodes = dataGrid.container.querySelectorAll('.reorderer');

      // Fake a Drag
      const dragstart = new MouseEvent('dragstart', { bubbles: true });
      nodes[2].dispatchEvent(dragstart);

      // simulate dragging
      const dragenter = new MouseEvent('dragenter', { bubbles: true });
      nodes[1].dispatchEvent(dragenter);
      nodes[0].dispatchEvent(dragenter);
      expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');

      const dragend = new MouseEvent('dragend', { bubbles: true });
      nodes[0].dispatchEvent(dragend);

      const drop = new MouseEvent('drop', { bubbles: true });
      nodes[0].dispatchEvent(drop);

      // Overall success
      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
    });

    test('supports moveColumn', async () => {
      dataGrid.columns = [{
        id: 'price',
        name: 'Price',
        field: 'price',
        reorderable: true,
        width: 200,
      },
      {
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        minWidth: 100,
        reorderable: true,
      },
      {
        id: 'other',
        name: 'ledger',
        field: 'ledger',
        minWidth: 100,
        reorderable: false,
      }];

      const cols = (dataGrid).columns;
      dataGrid.data[1].dirtyCells = [];
      dataGrid.data[1].dirtyCells.push({
        row: 1, cell: 0, columnId: 'price', originalValue: '12.99'
      });
      dataGrid.data[2].dirtyCells = [];
      dataGrid.data[2].dirtyCells.push({
        row: 2, cell: 0, columnId: 'price', originalValue: '13.99'
      });

      expect(cols[0].id).toBe('price');
      expect(cols[1].id).toBe('bookCurrency');
      expect(cols[2].id).toBe('other');
      dataGrid.moveColumn(0, 1);
      expect(cols[0].id).toBe('bookCurrency');
      expect(cols[1].id).toBe('price');
      expect(cols[2].id).toBe('other');

      (dataset[1] as any).dirtyCells = undefined;
      (dataset[2] as any).dirtyCells = undefined;
      dataGrid.resetDirtyCells();
    });
  });
});
