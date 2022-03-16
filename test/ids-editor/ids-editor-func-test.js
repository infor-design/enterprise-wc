/**
 * @jest-environment jsdom
 */
import ResizeObserver from '../helpers/resize-observer-mock';
import wait from '../helpers/wait';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsEditor from '../../src/components/ids-editor/ids-editor';
import {
  handlePasteAsPlainText,
  handlePasteAsHtml
} from '../../src/components/ids-editor/ids-editor-handle-paste';

document.execCommand = jest.fn();
document.queryCommandSupported = jest.fn();
global.DOMStringList = jest.fn();

describe('IdsEditor Component', () => {
  let container;
  let editor;

  beforeEach(async () => {
    const elem = new IdsEditor();
    container = new IdsContainer();
    container.appendChild(elem);
    document.body.appendChild(container);
    editor = container.querySelector('ids-editor');
    await container.setLanguage('en');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsEditor();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-editor').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should be able to get current value', async () => {
    expect(editor.value).toEqual('');
    const template = document.createElement('template');
    template.innerHTML = '<p>test</p>';
    editor.appendChild(template.content.childNodes[0]);
    await wait(500);
    expect(editor.value).toEqual('<p>test</p>\n');
  });

  it('should sets as disabled state', () => {
    const labelEl = editor.container.querySelector('#editor-label');
    const textarea = editor.container.querySelector('#source-textarea');
    const contenteditableEl = editor.container.querySelector('.editor-container');
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(editor.container.getAttribute('disabled')).toEqual(null);
    expect(labelEl.getAttribute('disabled')).toEqual(null);
    expect(textarea.getAttribute('disabled')).toEqual(null);
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('true');
    expect(editor.disabled).toEqual(false);
    editor.disabled = true;
    expect(editor.getAttribute('disabled')).toEqual('');
    expect(editor.container.getAttribute('disabled')).toEqual('');
    expect(labelEl.getAttribute('disabled')).toEqual('');
    expect(textarea.getAttribute('disabled')).toEqual('');
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('false');
    expect(editor.disabled).toEqual(true);
    editor.disabled = false;
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(editor.container.getAttribute('disabled')).toEqual(null);
    expect(labelEl.getAttribute('disabled')).toEqual(null);
    expect(textarea.getAttribute('disabled')).toEqual(null);
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('true');
    expect(editor.disabled).toEqual(false);
    editor.disabled = null;
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(editor.container.getAttribute('disabled')).toEqual(null);
    expect(labelEl.getAttribute('disabled')).toEqual(null);
    expect(textarea.getAttribute('disabled')).toEqual(null);
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('true');
    expect(editor.disabled).toEqual(false);
  });

  it('should sets as hyperlink disabled state', async () => {
    const template = document.createElement('template');
    template.innerHTML = '<p>test<a href="http://example.com">link</a></p>';
    editor.appendChild(template.content.childNodes[0]);
    await wait(500);
    const link = editor.container.querySelector('.editor-container a');
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(link.getAttribute('tabindex')).toEqual(null);
    editor.disabled = true;
    await wait(500);
    expect(editor.getAttribute('disabled')).toEqual('');
    expect(link.getAttribute('tabindex')).toEqual('-1');
    editor.disabled = null;
    await wait(500);
    expect(editor.getAttribute('disabled')).toEqual(null);
    expect(link.getAttribute('tabindex')).toEqual(null);
  });

  it('should sets the label text', () => {
    let labelEl = editor.container.querySelector('#editor-label');
    let sourceLabelEl = editor.container.querySelector('[for="source-textarea"]');
    const sourceTextareaLabel = (str) => `${str} - HTML Source View`;
    let label = 'test';
    const d = { label: 'Ids editor' };
    d.sourceLabel = sourceTextareaLabel(d.label);
    let sourceLabel = sourceTextareaLabel(label);
    expect(editor.getAttribute('label')).toEqual(null);
    expect(labelEl.textContent.trim()).toEqual(d.label);
    expect(sourceLabelEl.textContent.trim()).toEqual(d.sourceLabel);
    editor.label = label;
    expect(editor.getAttribute('label')).toEqual(label);
    expect(labelEl.textContent.trim()).toEqual(label);
    expect(sourceLabelEl.textContent.trim()).toEqual(sourceLabel);
    editor.label = null;
    expect(editor.getAttribute('label')).toEqual(null);
    expect(labelEl.textContent.trim()).toEqual(d.label);
    expect(sourceLabelEl.textContent.trim()).toEqual(d.sourceLabel);

    const customSrcLabel = function customSrcLabel() {
      return `Test Html source view ${this.label} title text.`;
    };
    editor.sourceTextareaLabel = customSrcLabel.bind(editor);
    label = 'custom test';
    sourceLabel = `Test Html source view ${label} title text.`;

    editor.label = label;
    labelEl = editor.container.querySelector('#editor-label');
    sourceLabelEl = editor.container.querySelector('[for="source-textarea"]');
    expect(editor.getAttribute('label')).toEqual(label);
    expect(labelEl.textContent.trim()).toEqual(label);
    expect(sourceLabelEl.textContent.trim()).toEqual(sourceLabel);
  });

  it('should sets the label to be hidden or shown', () => {
    const labelEl = editor.container.querySelector('#editor-label');
    expect(editor.getAttribute('label-hidden')).toEqual(null);
    expect(labelEl.getAttribute('audible')).toEqual(null);
    editor.labelHidden = true;
    expect(editor.getAttribute('label-hidden')).toEqual('');
    expect(labelEl.getAttribute('audible')).toEqual('');
    editor.labelHidden = null;
    expect(editor.getAttribute('label-hidden')).toEqual(null);
    expect(labelEl.getAttribute('audible')).toEqual(null);
  });

  it('should sets the label validation required indicator to be hidden or shown', () => {
    const labelEl = editor.container.querySelector('#editor-label');
    editor.validate = 'required';
    expect(editor.getAttribute('label-required')).toEqual(null);
    expect(labelEl.classList.contains('required')).toEqual(true);
    expect(labelEl.classList.contains('no-required-indicator')).toEqual(false);
    editor.labelRequired = false;
    expect(editor.getAttribute('label-required')).toEqual('false');
    expect(labelEl.classList.contains('required')).toEqual(true);
    expect(labelEl.classList.contains('no-required-indicator')).toEqual(true);
    editor.labelRequired = true;
    expect(editor.getAttribute('label-required')).toEqual('true');
    expect(labelEl.classList.contains('required')).toEqual(true);
    expect(labelEl.classList.contains('no-required-indicator')).toEqual(false);
    editor.labelRequired = null;
    expect(editor.getAttribute('label-required')).toEqual(null);
    expect(labelEl.classList.contains('required')).toEqual(true);
    expect(labelEl.classList.contains('no-required-indicator')).toEqual(false);
  });

  it('should sets paragraph separator', () => {
    const SEPARATORS = ['p', 'div', 'br'];
    const DEFAULT_SEPARATOR = 'p';
    expect(editor.paragraphSeparator).toEqual(DEFAULT_SEPARATOR);
    expect(editor.getAttribute('paragraph-separator')).toEqual(null);
    editor.paragraphSeparator = SEPARATORS[0];
    expect(editor.paragraphSeparator).toEqual(SEPARATORS[0]);
    expect(editor.getAttribute('paragraph-separator')).toEqual(SEPARATORS[0]);
    editor.paragraphSeparator = SEPARATORS[1];
    expect(editor.paragraphSeparator).toEqual(SEPARATORS[1]);
    expect(editor.getAttribute('paragraph-separator')).toEqual(SEPARATORS[1]);
    editor.paragraphSeparator = SEPARATORS[2];
    expect(editor.paragraphSeparator).toEqual(SEPARATORS[2]);
    expect(editor.getAttribute('paragraph-separator')).toEqual(SEPARATORS[2]);
    editor.paragraphSeparator = 'test';
    expect(editor.paragraphSeparator).toEqual(DEFAULT_SEPARATOR);
    expect(editor.getAttribute('paragraph-separator')).toEqual(null);
    editor.paragraphSeparator = null;
    expect(editor.paragraphSeparator).toEqual(DEFAULT_SEPARATOR);
    expect(editor.getAttribute('paragraph-separator')).toEqual(null);
  });

  it('should sets to be paste as plain text', () => {
    expect(editor.getAttribute('paste-as-plain-text')).toEqual(null);
    expect(editor.pasteAsPlainText).toEqual(false);
    editor.pasteAsPlainText = true;
    expect(editor.getAttribute('paste-as-plain-text')).toEqual('');
    expect(editor.pasteAsPlainText).toEqual(true);
    editor.pasteAsPlainText = false;
    expect(editor.getAttribute('paste-as-plain-text')).toEqual(null);
    expect(editor.pasteAsPlainText).toEqual(false);
    editor.pasteAsPlainText = null;
    expect(editor.getAttribute('paste-as-plain-text')).toEqual(null);
    expect(editor.pasteAsPlainText).toEqual(false);
  });

  it('should sets placeholder text', () => {
    const containers = {
      editor: editor.container.querySelector('.editor-container'),
      source: editor.container.querySelector('#source-textarea')
    };
    expect(editor.placeholder).toEqual(null);
    expect(containers.editor.getAttribute('placeholder')).toEqual(null);
    expect(containers.source.getAttribute('placeholder')).toEqual(null);
    editor.placeholder = 'test';
    expect(editor.placeholder).toEqual('test');
    expect(containers.editor.getAttribute('placeholder')).toEqual('test');
    expect(containers.source.getAttribute('placeholder')).toEqual('test');
    editor.placeholder = null;
    expect(editor.placeholder).toEqual(null);
    expect(containers.editor.getAttribute('placeholder')).toEqual(null);
    expect(containers.source.getAttribute('placeholder')).toEqual(null);
  });

  it('should sets as readonly state', () => {
    const labelEl = editor.container.querySelector('#editor-label');
    const textarea = editor.container.querySelector('#source-textarea');
    const contenteditableEl = editor.container.querySelector('.editor-container');
    expect(editor.getAttribute('readonly')).toEqual(null);
    expect(editor.container.getAttribute('readonly')).toEqual(null);
    expect(labelEl.getAttribute('readonly')).toEqual(null);
    expect(textarea.getAttribute('readonly')).toEqual(null);
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('true');
    expect(editor.readonly).toEqual(false);
    editor.readonly = true;
    expect(editor.getAttribute('readonly')).toEqual('');
    expect(editor.container.getAttribute('readonly')).toEqual('');
    expect(labelEl.getAttribute('readonly')).toEqual('');
    expect(textarea.getAttribute('readonly')).toEqual('');
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('false');
    expect(editor.readonly).toEqual(true);
    editor.readonly = false;
    expect(editor.getAttribute('readonly')).toEqual(null);
    expect(editor.container.getAttribute('readonly')).toEqual(null);
    expect(labelEl.getAttribute('readonly')).toEqual(null);
    expect(textarea.getAttribute('readonly')).toEqual(null);
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('true');
    expect(editor.readonly).toEqual(false);
    editor.readonly = null;
    expect(editor.getAttribute('readonly')).toEqual(null);
    expect(editor.container.getAttribute('readonly')).toEqual(null);
    expect(labelEl.getAttribute('readonly')).toEqual(null);
    expect(textarea.getAttribute('readonly')).toEqual(null);
    expect(contenteditableEl.getAttribute('contenteditable')).toEqual('true');
    expect(editor.readonly).toEqual(false);
  });

  it('should sets be use source formatter', () => {
    expect(editor.getAttribute('source-formatter')).toEqual(null);
    expect(editor.sourceFormatter).toEqual(false);
    editor.sourceFormatter = true;
    expect(editor.getAttribute('source-formatter')).toEqual('');
    expect(editor.sourceFormatter).toEqual(true);
    editor.sourceFormatter = false;
    expect(editor.getAttribute('source-formatter')).toEqual(null);
    expect(editor.sourceFormatter).toEqual(false);
    editor.sourceFormatter = null;
    expect(editor.getAttribute('source-formatter')).toEqual(null);
    expect(editor.sourceFormatter).toEqual(false);
  });

  it('should sets view mode', () => {
    const VIEWS = ['editor', 'source'];
    const DEFAULT_VIEW = 'editor';
    const getElems = () => ({
      editor: editor.container.querySelector('.editor-container'),
      source: editor.container.querySelector('.source-container'),
      toolbar: editor.querySelector('ids-toolbar'),
      btnEditor: editor.querySelector('[editor-action="editormode"]'),
      btnSource: editor.querySelector('[editor-action="sourcemode"]')
    });
    let elems = getElems();
    expect(editor.view).toEqual(DEFAULT_VIEW);
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);
    editor.view = VIEWS[1];
    elems = getElems();
    expect(editor.view).toEqual(VIEWS[1]);
    expect(elems.editor.classList.contains('hidden')).toEqual(true);
    expect(elems.source.classList.contains('hidden')).toEqual(false);
    expect(elems.toolbar.disabled).toEqual(true);
    expect(elems.btnEditor.hidden).toEqual(false);
    expect(elems.btnSource.hidden).toEqual(true);
    editor.view = VIEWS[0];
    elems = getElems();
    expect(editor.view).toEqual(VIEWS[0]);
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);
    editor.view = 'test';
    elems = getElems();
    expect(editor.view).toEqual(DEFAULT_VIEW);
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);
    editor.view = null;
    elems = getElems();
    expect(editor.view).toEqual(DEFAULT_VIEW);
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);
  });

  it('should switch to view mode with toolbar button', () => {
    const getElems = () => ({
      editor: editor.container.querySelector('.editor-container'),
      source: editor.container.querySelector('.source-container'),
      toolbar: editor.querySelector('ids-toolbar'),
      btnEditor: editor.querySelector('[editor-action="editormode"]'),
      btnSource: editor.querySelector('[editor-action="sourcemode"]')
    });
    let elems = getElems();
    expect(editor.view).toEqual('editor');
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);

    elems.btnSource.click();
    elems = getElems();
    expect(editor.view).toEqual('source');
    expect(elems.editor.classList.contains('hidden')).toEqual(true);
    expect(elems.source.classList.contains('hidden')).toEqual(false);
    expect(elems.toolbar.disabled).toEqual(true);
    expect(elems.btnEditor.hidden).toEqual(false);
    expect(elems.btnSource.hidden).toEqual(true);

    elems.btnEditor.click();
    elems = getElems();
    expect(editor.view).toEqual('editor');
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);
  });

  it('should veto before change mode', () => {
    const getElems = () => ({
      editor: editor.container.querySelector('.editor-container'),
      source: editor.container.querySelector('.source-container'),
      toolbar: editor.querySelector('ids-toolbar'),
      btnEditor: editor.querySelector('[editor-action="editormode"]'),
      btnSource: editor.querySelector('[editor-action="sourcemode"]')
    });
    let veto = false;
    editor.addEventListener('beforesourcemode', (e) => {
      e.detail.response(veto);
    });
    editor.addEventListener('beforeeditormode', (e) => {
      e.detail.response(veto);
    });

    let elems = getElems();
    expect(editor.view).toEqual('editor');
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);

    veto = false;
    elems.btnSource.click();
    elems = getElems();
    expect(editor.view).toEqual('editor');
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);

    veto = true;
    elems.btnSource.click();
    elems = getElems();
    expect(editor.view).toEqual('source');
    expect(elems.editor.classList.contains('hidden')).toEqual(true);
    expect(elems.source.classList.contains('hidden')).toEqual(false);
    expect(elems.toolbar.disabled).toEqual(true);
    expect(elems.btnEditor.hidden).toEqual(false);
    expect(elems.btnSource.hidden).toEqual(true);

    veto = false;
    elems.btnEditor.click();
    elems = getElems();
    expect(editor.view).toEqual('source');
    expect(elems.editor.classList.contains('hidden')).toEqual(true);
    expect(elems.source.classList.contains('hidden')).toEqual(false);
    expect(elems.toolbar.disabled).toEqual(true);
    expect(elems.btnEditor.hidden).toEqual(false);
    expect(elems.btnSource.hidden).toEqual(true);

    veto = true;
    elems.btnEditor.click();
    elems = getElems();
    expect(editor.view).toEqual('editor');
    expect(elems.editor.classList.contains('hidden')).toEqual(false);
    expect(elems.source.classList.contains('hidden')).toEqual(true);
    expect(elems.toolbar.disabled).toEqual(false);
    expect(elems.btnEditor.hidden).toEqual(true);
    expect(elems.btnSource.hidden).toEqual(false);
  });

  it('should sets default value to each element in modals', () => {
    const modals = {
      hyperlink: {
        url: 'http://www.test.com',
        classes: 'test',
        targets: [{ text: 'open in my iframe', value: 'my-iframe', selected: true }],
        isClickable: true,
        showIsClickable: true
      },
      insertimage: {
        url: '/img/test.jpg',
        alt: 'image test title text'
      }
    };
    const qs = (s) => editor.container.querySelector(s);
    const getElems = () => ({
      linkUrl: qs('#hyperlink-modal-input-url'),
      linkClasses: qs('#hyperlink-modal-input-classes'),
      linkDdTargets: qs('#hyperlink-modal-dropdown-targets'),
      linkCbClickable: qs('#hyperlink-modal-checkbox-clickable'),
      imgUrl: qs('#insertimage-modal-input-src'),
      imgAlt: qs('#insertimage-modal-input-alt'),
    });
    let elems = getElems();
    expect(elems.linkUrl.value).toEqual('http://www.example.com');
    expect(elems.linkClasses.value).toEqual('hyperlink');
    expect(elems.linkCbClickable.checked).toEqual(null);
    expect(elems.imgUrl.value).toEqual('../assets/images/placeholder-154x120.png');
    expect(elems.imgAlt.value).toEqual('');

    editor.modalElementsValue(modals);
    elems = getElems();
    expect(elems.linkUrl.value).toEqual('http://www.test.com');
    expect(elems.linkClasses.value).toEqual('test');
    expect(elems.linkCbClickable.checked).toEqual('true');
    expect(elems.imgUrl.value).toEqual('/img/test.jpg');
    expect(elems.imgAlt.value).toEqual('image test title text');

    editor.modalElementsValue({ hyperlink: { showIsClickable: false } });
    elems = getElems();
    expect(elems.linkCbClickable).toBeFalsy();
  });

  it('should renders with markup', async () => {
    document.body.innerHTML = `
      <ids-editor label="test editor1" placeholder="test" view="source" label-hidden disabled>
        <p>test<a href="http://example.com">link</a></p>
      </ids-editor>
      <ids-editor label="test editor2" view="editor" label-required="false" readonly>
        <p>test<a href="http://example.com">link</a></p>
      </ids-editor>`;
    await processAnimFrame();
    const editors = document.querySelectorAll('ids-editor');
    expect(editors[0].view).toEqual('source');
    expect(editors[0].disabled).toEqual(true);
    expect(editors[0].readonly).toEqual(false);
    expect(editors[1].view).toEqual('editor');
    expect(editors[1].disabled).toEqual(false);
    expect(editors[1].readonly).toEqual(true);
  });

  it('should be let paste content', () => {
    const mockCallback = jest.fn(() => { });
    const editorContainer = editor.container.querySelector('.editor-container');
    const event = new Event('paste', {
      clipboardData: {
        getData: jest.fn(),
        types: ['text/html'],
        value: '<h1>test</h1>'
      }
    });
    editorContainer.addEventListener('paste', mockCallback);
    editor.pasteAsPlainText = false;
    editorContainer.dispatchEvent(event);
    expect(mockCallback).toBeCalledTimes(1);
    editor.pasteAsPlainText = true;
    editorContainer.dispatchEvent(event);
    expect(mockCallback).toBeCalledTimes(2);
  });

  it('should be handle paste as plain text', () => {
    let content = null;
    const getClipboardData = (opt) => ({
      clipboardData: {
        getData: (s) => (s === 'text/plain' ? `${opt}` : `<h1>${opt}</h1>`),
        types: ['text/plain']
      }
    });
    content = handlePasteAsPlainText();
    expect(content).toEqual(null);
    content = handlePasteAsPlainText(getClipboardData('test'));
    expect(content).toEqual('<p>test</p>');
    content = handlePasteAsPlainText(getClipboardData('test.png'));
    expect(content).toEqual('<img src="test.png" />');
  });

  it('should be handle paste as html', () => {
    let content = null;
    const getGlobalData = (opt) => ({ getData: (s) => (s === 'Text' ? `${opt}` : `<h1>${opt}</h1>`) });
    const getClipboardData = (opt) => ({
      clipboardData: {
        getData: (s) => (s === 'text/plain' ? `${opt}` : `<h1>${opt}</h1>`),
        types: ['text/html']
      }
    });
    content = handlePasteAsHtml();
    expect(content).toEqual(null);
    content = handlePasteAsHtml(getClipboardData('test'));
    expect(content).toEqual('<h1>test</h1>');
    let data = getClipboardData('test');
    data.clipboardData.types = ['text/plain'];
    content = handlePasteAsHtml(data);
    expect(content).toEqual('test');

    data = getClipboardData('test');
    data.clipboardData.types = null;
    global.clipboardData = getGlobalData('test');
    content = handlePasteAsHtml(data);
    expect(content).toEqual('<p>test</p>');

    data = getClipboardData('test');
    data.clipboardData.types = null;
    global.clipboardData = getGlobalData('test.png');
    content = handlePasteAsHtml(data);
    expect(content).toEqual('<img src="test.png" />');
  });
});
