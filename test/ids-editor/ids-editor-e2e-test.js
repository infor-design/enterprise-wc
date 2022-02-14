describe('Ids Editor e2e Tests', () => {
  const url = 'http://localhost:4444/ids-editor';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Editor Component');
    await expect(page.evaluate('document.querySelector("ids-theme-switcher").getAttribute("mode")'))
      .resolves.toMatch('light');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['nested-interactive'] });
  });

  it('should make text bold, italic, underline, strikethrough and clearformatting', async () => {
    let html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2)').innerHTML;
    });
    expect(html.includes('<b><i><u><strike>Cross-plat</strike></u></i></b>')).toBeFalsy();
    html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      const el = p;
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="bold"]').click();
      document.querySelector('ids-editor [editor-action="italic"]').click();
      document.querySelector('ids-editor [editor-action="underline"]').click();
      document.querySelector('ids-editor [editor-action="strikethrough"]').click();
      return p.innerHTML;
    });
    expect(html.includes('<b><i><u><strike>Cross-plat</strike></u></i></b>')).toBeTruthy();
    html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      const el = p.querySelector('b i u strike');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="clearformatting"]').click();
      return p.innerHTML;
    });
    expect(html.includes('<b><i><u><strike>Cross-plat</strike></u></i></b>')).toBeFalsy();
    await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
    });
    await page.keyboard.down('Meta');
    await page.keyboard.press('KeyB');
    await page.keyboard.up('Meta');
    html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      const el = p.querySelector('b');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="clearformatting"]').click();
      return p.innerHTML;
    });
    expect(html.includes('<b>Cross-plat</b>')).toBeFalsy();
  });

  it('should toggle blockquote', async () => {
    let html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2)').innerHTML;
    });
    expect(html.includes('<blockquote>Cross-platform')).toBeFalsy();
    html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="blockquote"]').click();
      const blockquoteEl = doc.querySelector('#editor-container blockquote');
      return blockquoteEl.outerHTML;
    });
    expect(html.includes('<blockquote>Cross-platform')).toBeTruthy();
    html = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container blockquote');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="blockquote"]').click();
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      return p.outerHTML;
    });
    expect(html.includes('<p>Cross-platform')).toBeTruthy();
  });

  it('should set text-align left and center', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p[style="text-align: center;"]');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="aligncenter"]').click();
      return doc.querySelector('#editor-container p[style="text-align: center;"]');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="alignleft"]').click();
      return doc.querySelector('#editor-container p[style="text-align: center;"]');
    });
    expect(elem).toBeFalsy();
  });

  it('should set text-align left and right', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p[style="text-align: right;"]');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="alignright"]').click();
      return doc.querySelector('#editor-container p[style="text-align: right;"]');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="alignleft"]').click();
      return doc.querySelector('#editor-container p[style="text-align: right;"]');
    });
    expect(elem).toBeFalsy();
  });

  it('should toggle ordered list', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) ol li');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="orderedlist"]').click();
      return doc.querySelector('#editor-container p:nth-child(2) ol li');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) ol li');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="orderedlist"]').click();
      return doc.querySelector('#editor-container p:nth-child(2) ol li');
    });
    expect(elem).toBeFalsy();
  });

  it('should toggle unordered list', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) ul li');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="unorderedlist"]').click();
      return doc.querySelector('#editor-container p:nth-child(2) ul li');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) ul li');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="unorderedlist"]').click();
      return doc.querySelector('#editor-container p:nth-child(2) ul li');
    });
    expect(elem).toBeFalsy();
  });

  it('should toggle header elements', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container h1');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="formatblock"]').click();
      document.querySelector('ids-editor ids-menu-item[value="h1"]').click();
      return doc.querySelector('#editor-container h1');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container h1');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="formatblock"]').click();
      document.querySelector('ids-editor ids-menu-item[value="h2"]').click();
      return doc.querySelector('#editor-container h2');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container h2');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="formatblock"]').click();
      document.querySelector('ids-editor ids-menu-item[value="h3"]').click();
      return doc.querySelector('#editor-container h3');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container h3');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="formatblock"]').click();
      document.querySelector('ids-editor ids-menu-item[value="p"]').click();
      return doc.querySelector('#editor-container p:nth-child(2)');
    });
    expect(elem).toBeTruthy();
  });

  it('should toggle hyperlink', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) a');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="hyperlink"]').click();
      doc.querySelector('#hyperlink-modal-apply-btn').click();
      return doc.querySelector('#editor-container p:nth-child(2) a');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) a');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="hyperlink"]').click();
      doc.querySelector('#hyperlink-modal-checkbox-remove').checked = true;
      doc.querySelector('#hyperlink-modal-apply-btn').click();
      return doc.querySelector('#editor-container p:nth-child(2) a');
    });
    expect(elem).toBeFalsy();
  });

  it('should be able to activate buttons on selection change', async () => {
    let cssClass = await page.evaluate(() => {
      const el = document.querySelector('ids-editor [editor-action="hyperlink"]');
      return el.cssClass;
    });
    expect(cssClass).toEqual([]);
    cssClass = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      let el = doc.querySelector('#editor-container a');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.dispatchEvent(new Event('selectionchange', { bubbles: true }));

      el = document.querySelector('ids-editor [editor-action="hyperlink"]');
      return el.cssClass;
    });
    expect(cssClass).toBeTruthy();
  });

  it('should be able to use source formatter', async () => {
    const html = await page.evaluate(() => {
      const editor = document.querySelector('ids-editor');
      const doc = editor.shadowRoot;
      editor.sourceFormatter = true;
      document.querySelector('ids-editor [editor-action="sourcemode"]').click();
      document.querySelector('ids-editor [editor-action="editormode"]').click();
      editor.sourceFormatter = null;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      return el.outerHTML;
    });
    expect(html.includes('<p> Cross-platform')).toBeTruthy();
  });

  it('should toggle fore color', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) font[color]');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="forecolor"]').click();
      const input = document.querySelector('ids-editor .forecolor-input');
      input.value = '#ff0000';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return doc.querySelector('#editor-container p:nth-child(2) font[color]');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) font[color]');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="clearformatting"]').click();
      return doc.querySelector('#editor-container p:nth-child(2) font[color]');
    });
    expect(elem).toBeFalsy();
  });

  it('should be able to insert image', async () => {
    let elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      return doc.querySelector('#editor-container img');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 0);
      sel.removeAllRanges();
      sel.addRange(range);
      document.querySelector('ids-editor [editor-action="insertimage"]').click();
      doc.querySelector('#insertimage-modal-apply-btn').click();
      return doc.querySelector('#editor-container img');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = document.querySelector('ids-editor').shadowRoot;
      const el = doc.querySelector('#editor-container img');
      el.parentNode.removeChild(el);
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      p.innerHTML = p.innerHTML.slice(1);
      return doc.querySelector('#editor-container img');
    });
    expect(elem).toBeFalsy();
  });
});
