/**
 * @jest-environment jsdom
 */
import IdsTree from '../../src/components/ids-tree/ids-tree';
import IdsTreeShared from '../../src/components/ids-tree/ids-tree-shared';
import IdsContainer from '../../src/components/ids-container/ids-container';
import arMessages from '../../src/components/ids-locale/data/ar-messages.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsTree Component', () => {
  let container: any;
  let tree: any;
  let dataset: any;

  beforeEach(async () => {
    const elem = new IdsTree();
    container = new IdsContainer();
    container.appendChild(elem);
    document.body.appendChild(container);
    tree = container.querySelector('ids-tree');
    await IdsGlobal.getLocale().setLanguage('en');
    IdsGlobal.getLocale().loadedLanguages.set('ar', arMessages);

    dataset = [{
      id: 'home',
      text: 'Home',
      selected: 'true'
    }, {
      id: 'public-folders',
      text: 'Public Folders',
      children: [{
        id: 'leadership',
        text: 'Leadership'
      }, {
        id: 'history',
        text: 'History',
        disabled: 'true'
      }, {
        id: 'careers-last',
        text: 'Careers last'
      }]
    }, {
      id: 'icons',
      text: 'Icons',
      expanded: 'false',
      children: [{
        id: 'audio',
        text: 'Audio',
        icon: 'tree-audio',
        badge: {
          color: 'info',
          text: '0',
          shape: 'round',
          textAudible: 'audible text',
          icon: 'pending'
        }
      }]
    }];
  });

  test('should sets the tree group collapse icon', () => {
    const icon = 'user-folder-closed';
    expect(tree.getAttribute('collapse-icon')).toEqual(null);
    expect(tree.collapseIcon).toEqual(IdsTreeShared.DEFAULTS.collapseIcon);
    tree.collapseIcon = icon;
    expect(tree.getAttribute('collapse-icon')).toEqual(icon);
    expect(tree.collapseIcon).toEqual(icon);
    tree.collapseIcon = null;
    expect(tree.getAttribute('collapse-icon')).toEqual(null);
    expect(tree.collapseIcon).toEqual(IdsTreeShared.DEFAULTS.collapseIcon);
  });

  test('should sets the tree as disabled', () => {
    expect(tree.getAttribute('disabled')).toEqual(null);
    expect(tree.container.getAttribute('disabled')).toEqual(null);
    expect(tree.disabled).toEqual(false);
    tree.disabled = true;
    expect(tree.getAttribute('disabled')).toEqual('');
    expect(tree.container.getAttribute('disabled')).toEqual('');
    expect(tree.disabled).toEqual(true);
    tree.disabled = false;
    expect(tree.getAttribute('disabled')).toEqual(null);
    expect(tree.container.getAttribute('disabled')).toEqual(null);
    expect(tree.disabled).toEqual(false);
  });

  test('should sets the tree group expand icon', () => {
    const icon = 'user-folder-open';
    expect(tree.getAttribute('expand-icon')).toEqual(null);
    expect(tree.expandIcon).toEqual(IdsTreeShared.DEFAULTS.expandIcon);
    tree.expandIcon = icon;
    expect(tree.getAttribute('expand-icon')).toEqual(icon);
    expect(tree.expandIcon).toEqual(icon);
    tree.expandIcon = null;
    expect(tree.getAttribute('expand-icon')).toEqual(null);
    expect(tree.expandIcon).toEqual(IdsTreeShared.DEFAULTS.expandIcon);
  });

  test('should sets the tree as expanded', () => {
    expect(tree.getAttribute('expanded')).toEqual(null);
    expect(tree.expanded).toEqual(IdsTreeShared.DEFAULTS.expanded);
    tree.expanded = true;
    expect(tree.getAttribute('expanded')).toEqual('true');
    expect(tree.expanded).toEqual(true);
    tree.expanded = false;
    expect(tree.getAttribute('expanded')).toEqual('false');
    expect(tree.expanded).toEqual(false);
    tree.expanded = null;
    expect(tree.getAttribute('expanded')).toEqual(null);
    expect(tree.expanded).toEqual(IdsTreeShared.DEFAULTS.expanded);
  });

  test('should sets the tree node icon', () => {
    const icon = 'tree-doc';
    expect(tree.getAttribute('icon')).toEqual(null);
    expect(tree.icon).toEqual(IdsTreeShared.DEFAULTS.icon);
    tree.icon = icon;
    expect(tree.getAttribute('icon')).toEqual(icon);
    expect(tree.icon).toEqual(icon);
    tree.icon = null;
    expect(tree.getAttribute('icon')).toEqual(null);
    expect(tree.icon).toEqual(IdsTreeShared.DEFAULTS.icon);
  });

  test('should sets the tree selectable', () => {
    let selectable: any = 'single';
    expect(tree.getAttribute('selectable')).toEqual(null);
    expect(tree.selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual(selectable);
    expect(tree.selectable).toEqual(selectable);
    selectable = 'multiple';
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual(selectable);
    expect(tree.selectable).toEqual(selectable);
    selectable = false;
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual('false');
    expect(tree.selectable).toEqual(false);
    tree.selectable = 'test';
    expect(tree.getAttribute('selectable')).toEqual(null);
    expect(tree.selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
    tree.selectable = null;
    expect(tree.getAttribute('selectable')).toEqual(null);
    expect(tree.selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
  });

  test('should update toggle collapse icon', () => {
    tree.data = dataset;
    tree.expandTarget = 'icon';
    const icon = 'chevron-right';
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(null);
    expect(tree.toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    tree.toggleCollapseIcon = icon;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(icon);
    expect(tree.toggleCollapseIcon).toEqual(icon);
  });

  test('should sets the tree toggle collapse icon', () => {
    const icon = 'chevron-right';
    tree.expandTarget = 'icon';
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(null);
    expect(tree.toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    tree.toggleCollapseIcon = icon;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(icon);
    expect(tree.toggleCollapseIcon).toEqual(icon);
    tree.toggleCollapseIcon = null;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(null);
    expect(tree.toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
  });

  test('should sets the tree toggle expand icon', () => {
    const icon = 'chevron-down';
    tree.expandTarget = 'icon';
    expect(tree.getAttribute('toggle-expand-icon')).toEqual(null);
    expect(tree.toggleExpandIcon).toEqual(IdsTreeShared.DEFAULTS.toggleExpandIcon);
    tree.toggleExpandIcon = icon;
    expect(tree.getAttribute('toggle-expand-icon')).toEqual(icon);
    expect(tree.toggleExpandIcon).toEqual(icon);
    tree.toggleExpandIcon = null;
    expect(tree.getAttribute('toggle-expand-icon')).toEqual(null);
    expect(tree.toggleExpandIcon).toEqual(IdsTreeShared.DEFAULTS.toggleExpandIcon);
  });

  test('should sets the tree toggle icon rotate', () => {
    expect(tree.getAttribute('toggle-icon-rotate')).toEqual(null);
    expect(tree.toggleIconRotate).toEqual(IdsTreeShared.DEFAULTS.toggleIconRotate);
    tree.toggleIconRotate = true;
    expect(tree.getAttribute('toggle-icon-rotate')).toEqual('true');
    expect(tree.toggleIconRotate).toEqual(true);
    tree.toggleIconRotate = false;
    expect(tree.getAttribute('toggle-icon-rotate')).toEqual('false');
    expect(tree.toggleIconRotate).toEqual(false);
    tree.toggleIconRotate = null;
    expect(tree.getAttribute('toggle-icon-rotate')).toEqual(null);
    expect(tree.toggleIconRotate).toEqual(IdsTreeShared.DEFAULTS.toggleIconRotate);
  });

  test('can use icon expand target', () => {
    expect(tree.getAttribute('expand-target')).toEqual(null);
    expect(tree.expandTarget).toEqual(IdsTreeShared.DEFAULTS.expandTarget);
    tree.expandTarget = 'icon';
    expect(tree.getAttribute('expand-target')).toEqual('icon');
    expect(tree.expandTarget).toEqual('icon');
    tree.expandTarget = 'node';
    expect(tree.getAttribute('expand-target')).toEqual('node');
    expect(tree.expandTarget).toEqual('node');
    tree.expandTarget = null;
    expect(tree.getAttribute('expand-target')).toEqual(null);
    expect(tree.expandTarget).toEqual(IdsTreeShared.DEFAULTS.expandTarget);
  });

  test('should sets the tree to use dataset', () => {
    tree.data = 'test';
    expect(tree.data).toEqual(expect.arrayContaining([]));
    expect(tree.data.length).toEqual(0);
    tree.data = [];
    expect(tree.data).toEqual(expect.arrayContaining([]));
    expect(tree.data.length).toEqual(0);
    tree.data = dataset;

    expect(tree.getNode('#home').isGroup).toEqual(false);
    expect(tree.getNode('#home').level).toEqual(1);
    expect(tree.getNode('#home').posinset).toEqual(1);
    expect(tree.getNode('#home').setsize).toEqual(3);

    expect(tree.getNode('#public-folders').isGroup).toEqual(true);
    expect(tree.getNode('#public-folders').level).toEqual(1);
    expect(tree.getNode('#public-folders').posinset).toEqual(2);
    expect(tree.getNode('#public-folders').setsize).toEqual(3);

    expect(tree.getNode('#leadership').isGroup).toEqual(false);
    expect(tree.getNode('#leadership').level).toEqual(2);
    expect(tree.getNode('#leadership').posinset).toEqual(1);
    expect(tree.getNode('#leadership').setsize).toEqual(3);

    expect(tree.getNode('#history').isGroup).toEqual(false);
    expect(tree.getNode('#history').level).toEqual(2);
    expect(tree.getNode('#history').posinset).toEqual(2);
    expect(tree.getNode('#history').setsize).toEqual(3);

    expect(tree.getNode('#careers-last').isGroup).toEqual(false);
    expect(tree.getNode('#careers-last').level).toEqual(2);
    expect(tree.getNode('#careers-last').posinset).toEqual(3);
    expect(tree.getNode('#careers-last').setsize).toEqual(3);

    expect(tree.getNode('#icons').isGroup).toEqual(true);
    expect(tree.getNode('#icons').level).toEqual(1);
    expect(tree.getNode('#icons').posinset).toEqual(3);
    expect(tree.getNode('#icons').setsize).toEqual(3);

    expect(tree.getNode('#audio').isGroup).toEqual(false);
    expect(tree.getNode('#audio').level).toEqual(2);
    expect(tree.getNode('#audio').posinset).toEqual(1);
    expect(tree.getNode('#audio').setsize).toEqual(1);
  });

  test('should sets init icons', () => {
    tree.icon = 'tree-node';
    tree.collapseIcon = 'closed-folder';
    tree.expandIcon = 'open-folder';
    tree.data = dataset;
  });

  test('should sets the tree node single selection', () => {
    tree.data = dataset;
    let id = '#home';
    expect(tree.isSelected(id)).toEqual(true);
    expect(tree.selected).toEqual(expect.objectContaining({
      data: expect.objectContaining({ id: 'home' })
    }));
    tree.unselect(id);
    expect(tree.isSelected(id)).toEqual(false);
    expect(tree.selected).toEqual(null);
    id = '#public-folders';
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(true);
    expect(tree.selected).toEqual(expect.objectContaining({
      data: expect.objectContaining({ id: 'public-folders' })
    }));
    id = '#leadership';
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(true);
    expect(tree.isSelected('#home')).toEqual(false);
    expect(tree.isSelected('#public-folders')).toEqual(false);
    expect(tree.selected).toEqual(expect.objectContaining({
      data: expect.objectContaining({ id: 'leadership' })
    }));
  });

  test('should gets the tree node for selection multiple', () => {
    tree.data = dataset;
    const selectable = 'multiple';
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual(selectable);
    expect(tree.selectable).toEqual(selectable);
    expect(tree.selected).toEqual(expect.arrayContaining([]));
    expect(tree.selected.length).toEqual(0);

    const home = tree.getNode('#home');
    home.elem.selected = true;
    expect(tree.isSelected('#home')).toEqual(true);

    const pubFolders = tree.getNode('#public-folders');
    pubFolders.elem.selected = true;
    expect(tree.isSelected('#public-folders')).toEqual(true);
    expect(tree.isSelected('#home')).toEqual(true);
  });

  test('should gets the tree node for selection false', () => {
    tree.data = dataset;
    const selectable = 'false';
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual(selectable);
    expect(tree.selectable).toEqual(false);
    expect(tree.selected).toEqual(null);
  });

  test('should collapse all attached nodes', () => {
    tree.data = dataset;
    let node1 = tree.getNode('#public-folders');
    let node2 = tree.getNode('#icons');
    expect(node1.isGroup).toEqual(true);
    expect(node2.isGroup).toEqual(true);
    expect(node1.elem.expanded).toEqual(true);
    expect(node2.elem.expanded).toEqual(false);
    tree.collapseAll();
    node1 = tree.getNode('#public-folders');
    node2 = tree.getNode('#icons');
    expect(node1.elem.expanded).toEqual(false);
    expect(node2.elem.expanded).toEqual(false);
  });

  test('should expand all attached nodes', () => {
    tree.data = dataset;
    let node1 = tree.getNode('#public-folders');
    let node2 = tree.getNode('#icons');
    expect(node1.isGroup).toEqual(true);
    expect(node2.isGroup).toEqual(true);
    expect(node1.elem.expanded).toEqual(true);
    expect(node2.elem.expanded).toEqual(false);
    tree.expandAll();
    node1 = tree.getNode('#public-folders');
    node2 = tree.getNode('#icons');
    expect(node1.elem.expanded).toEqual(true);
    expect(node2.elem.expanded).toEqual(true);
  });

  test('should collapse node', () => {
    tree.data = dataset;
    let id = '#leadership';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(false);
    tree.collapse(id);
    id = '#public-folders';
    node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    tree.collapse(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
  });

  test('should call expand node', () => {
    tree.data = dataset;
    const id = '#icons';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(false);
    tree.expand(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
  });

  test('should toggle node', () => {
    tree.data = dataset;
    let id = '#leadership';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(false);
    tree.toggle(id);
    id = '#public-folders';
    node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    tree.toggle(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    tree.toggle(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
  });

  it.skip('should handle node click actions', () => {
    tree.data = dataset;
    let id = '#leadership';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(false);
    expect(tree.isSelected(id)).toEqual(false);
    node.elem.nodeContainer.click();
    expect(tree.isSelected(id)).toEqual(true);

    id = '#history';
    node = tree.getNode(id);
    expect(node.isGroup).toEqual(false);
    expect(node.elem.disabled).toEqual(true);
    expect(tree.isSelected(id)).toEqual(false);
    node.elem.nodeContainer.click();
    node = tree.getNode(id);
    expect(node.elem.disabled).toEqual(true);
    expect(tree.isSelected(id)).toEqual(false);

    tree.expandTarget = 'icon';
    id = '#public-folders';
    node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(tree.isSelected(id)).toEqual(false);
    expect(node.elem.expanded).toEqual(true);
    const icon = node.elem.nodeContainer.querySelector('.icon');
    icon?.click();
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    expect(tree.isSelected(id)).toEqual(false);
    const toggleIcon = node.elem.nodeContainer.querySelector('.toggle-icon');
    toggleIcon?.click();
    node = tree.getNode(id);
    expect(tree.isSelected(id)).toEqual(false);
    node.elem.nodeContainer.click();
    expect(tree.isSelected(id)).toEqual(true);

    id = '#home';
    node = tree.getNode(id);
    expect(node.isGroup).toEqual(false);
    expect(tree.isSelected(id)).toEqual(false);
    node.elem.nodeContainer.click();
    expect(tree.isSelected(id)).toEqual(true);
  });

  test('should toggle node and select on click', () => {
    tree.data = dataset;
    const id = '#public-folders';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    expect(tree.isSelected(id)).toEqual(false);
    node.elem.nodeContainer.click();
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    expect(tree.isSelected(id)).toEqual(true);
  });

  it.skip('should toggle node and select on keyup enter or space', async () => {
    tree.data = dataset;
    const id = '#public-folders';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    expect(tree.isSelected(id)).toEqual(false);
    let event = new KeyboardEvent('keyup', { code: 'Enter' });
    tree.container.dispatchEvent(event);

    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    expect(tree.isSelected(id)).toEqual(true);
    event = new KeyboardEvent('keyup', { code: 'Space' });
    tree.container.dispatchEvent(event);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
    expect(tree.isSelected(id)).toEqual(true);
  });

  it.skip('should moves focus on keydown Down Arrow', () => {
    tree.data = dataset;
    const tabbable = (n?: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n?: any, isNull?: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n?: any) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes: any = [];
    const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
    keys.forEach((key) => {
      nodes.push({ node: tree.getNode(`#${key}`) });
    });

    const attrNull = true;
    tabbable(nodes[0]);
    notTabbable(nodes[1], attrNull);
    dispatchEvent(nodes[0]);
    notTabbable(nodes[0]);
    tabbable(nodes[1]);

    tabbable(nodes[1]);
    notTabbable(nodes[2], attrNull);
    dispatchEvent(nodes[1]);
    notTabbable(nodes[1]);
    tabbable(nodes[2]);

    tabbable(nodes[2]);
    notTabbable(nodes[3], attrNull);
    notTabbable(nodes[4], attrNull);
    dispatchEvent(nodes[2]);
    notTabbable(nodes[2]);
    notTabbable(nodes[3], attrNull);
    tabbable(nodes[4]);

    tabbable(nodes[4]);
    notTabbable(nodes[5], attrNull);
    dispatchEvent(nodes[4]);
    notTabbable(nodes[4]);
    tabbable(nodes[5]);

    tabbable(nodes[5]);
    notTabbable(nodes[6], attrNull);
    dispatchEvent(nodes[5]);
    tabbable(nodes[5]);
    notTabbable(nodes[6], attrNull);
    dispatchEvent(nodes[6]);
    tabbable(nodes[6]);
  });

  it.skip('should moves focus on keydown Up Arrow', () => {
    tree.data = dataset;
    const tabbable = (n: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n: any, isNull?: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n: any) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes: any = [];
    const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
    keys.forEach((key) => {
      nodes.push({ node: tree.getNode(`#${key}`) });
    });

    const attrNull = true;
    notTabbable(nodes[4], attrNull);
    notTabbable(nodes[3], attrNull);
    notTabbable(nodes[2], attrNull);
    dispatchEvent(nodes[4]);
    tabbable(nodes[2]);
    notTabbable(nodes[4], attrNull);
    notTabbable(nodes[3], attrNull);

    tabbable(nodes[2]);
    notTabbable(nodes[1], attrNull);
    dispatchEvent(nodes[2]);
    tabbable(nodes[1]);
    notTabbable(nodes[2]);

    tabbable(nodes[1]);
    notTabbable(nodes[0]);
    dispatchEvent(nodes[1]);
    tabbable(nodes[0]);
    notTabbable(nodes[1]);

    tabbable(nodes[0]);
    dispatchEvent(nodes[0]);
    tabbable(nodes[0]);

    dispatchEvent(nodes[2]);
    notTabbable(nodes[2]);
    tabbable(nodes[1]);
    nodes[0].node.elem.disabled = true;
    dispatchEvent(nodes[1]);
    tabbable(nodes[1]);

    notTabbable(nodes[4], attrNull);
    dispatchEvent(nodes[5]);
    tabbable(nodes[4]);

    tree.collapse('#public-folders');
    expect(nodes[1].node.elem.expanded).toEqual(false);
    notTabbable(nodes[1]);
    dispatchEvent(nodes[5]);
    tabbable(nodes[1]);
  });

  it.skip('should moves focus on keydown Right Arrow', () => {
    tree.data = dataset;
    const tabbable = (n: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n: any, isNull?: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n: any) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes: any = [];
    const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
    keys.forEach((key) => {
      nodes.push({ node: tree.getNode(`#${key}`) });
    });

    const attrNull = true;
    expect(nodes[1].node.isGroup).toEqual(true);
    expect(nodes[1].node.elem.expanded).toEqual(true);
    notTabbable(nodes[1], attrNull);
    notTabbable(nodes[2], attrNull);
    dispatchEvent(nodes[1]);
    tabbable(nodes[2]);
    notTabbable(nodes[1], attrNull);

    expect(nodes[2].node.isGroup).toEqual(false);
    tabbable(nodes[2]);
    notTabbable(nodes[3], attrNull);
    notTabbable(nodes[1], attrNull);
    expect(nodes[1].node.elem.expanded).toEqual(true);
    dispatchEvent(nodes[2]);
    tabbable(nodes[2]);
    notTabbable(nodes[3], attrNull);
    notTabbable(nodes[1], attrNull);
    expect(nodes[1].node.elem.expanded).toEqual(true);

    expect(nodes[5].node.isGroup).toEqual(true);
    expect(nodes[5].node.elem.expanded).toEqual(false);
    notTabbable(nodes[5], attrNull);
    notTabbable(nodes[6], attrNull);
    dispatchEvent(nodes[5]);
    expect(nodes[5].node.elem.expanded).toEqual(true);
    notTabbable(nodes[6], attrNull);
    dispatchEvent(nodes[5]);
    tabbable(nodes[6]);

    notTabbable(nodes[5], attrNull);
    expect(nodes[5].node.elem.expanded).toEqual(true);
    tabbable(nodes[6]);
    dispatchEvent(nodes[6]);
    tabbable(nodes[6]);
    expect(nodes[5].node.elem.expanded).toEqual(true);
    notTabbable(nodes[5], attrNull);
  });

  it.skip('should moves focus on keydown Left Arrow', () => {
    tree.data = dataset;
    const tabbable = (n: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n: any, isNull?: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n: any) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes: any = [];
    const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
    keys.forEach((key) => {
      nodes.push({ node: tree.getNode(`#${key}`) });
    });

    const attrNull = true;
    expect(nodes[5].node.isGroup).toEqual(true);
    expect(nodes[5].node.elem.expanded).toEqual(false);
    notTabbable(nodes[5], attrNull);
    notTabbable(nodes[4], attrNull);
    notTabbable(nodes[3], attrNull);
    notTabbable(nodes[2], attrNull);
    notTabbable(nodes[1], attrNull);
    dispatchEvent(nodes[5]);
    expect(nodes[5].node.elem.expanded).toEqual(false);
    notTabbable(nodes[5], attrNull);
    notTabbable(nodes[4], attrNull);
    notTabbable(nodes[3], attrNull);
    notTabbable(nodes[2], attrNull);
    notTabbable(nodes[1], attrNull);

    expect(nodes[1].node.elem.expanded).toEqual(true);
    dispatchEvent(nodes[4]);
    tabbable(nodes[1]);
    expect(nodes[1].node.elem.expanded).toEqual(true);
    notTabbable(nodes[4], attrNull);

    dispatchEvent(nodes[1]);
    tabbable(nodes[1]);
    expect(nodes[1].node.elem.expanded).toEqual(false);

    dispatchEvent(nodes[1]);
    tabbable(nodes[1]);
    expect(nodes[1].node.elem.expanded).toEqual(false);
    notTabbable(nodes[0]);
  });

  test('should prevent keys', () => {
    tree.data = dataset;
    const nodes: any = [];
    const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
    keys.forEach((key) => {
      nodes.push({ node: tree.getNode(`#${key}`) });
    });
    expect(nodes[1].node.elem.expanded).toEqual(true);
    let event = new KeyboardEvent('keydown', { code: 'Space' });
    nodes[1].node.elem.nodeContainer.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { code: 'Test' });
    nodes[1].node.elem.nodeContainer.dispatchEvent(event);
    nodes[3].node.elem.nodeContainer.dispatchEvent(event);
    expect(nodes[1].node.elem.expanded).toEqual(true);
    event = new KeyboardEvent('keyup', { code: 'Test' });
    nodes[1].node.elem.nodeContainer.dispatchEvent(event);
    nodes[3].node.elem.nodeContainer.dispatchEvent(event);
    expect(nodes[1].node.elem.expanded).toEqual(true);
  });

  it.skip('should moves focus on keydown RTL', async () => {
    tree.data = dataset;
    await IdsGlobal.getLocale().setLanguage('ar');

    expect(tree.getAttribute('dir')).toEqual('rtl');

    const tabbable = (n: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n: any, isNull?: any) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n: any, eventKey: any) => {
      const event = new KeyboardEvent('keydown', { code: eventKey });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes: any = [];
    const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
    keys.forEach((key) => {
      nodes.push({ node: tree.getNode(`#${key}`) });
    });
    const attrNull = true;
    expect(nodes[1].node.isGroup).toEqual(true);
    expect(nodes[1].node.elem.expanded).toEqual(true);
    notTabbable(nodes[1], attrNull);
    notTabbable(nodes[2], attrNull);
    dispatchEvent(nodes[1], 'ArrowRight');
    expect(nodes[1].node.elem.expanded).toEqual(false);
    notTabbable(nodes[2], attrNull);

    dispatchEvent(nodes[1], 'ArrowLeft');
    expect(nodes[1].node.elem.expanded).toEqual(true);
    notTabbable(nodes[2], attrNull);

    dispatchEvent(nodes[1], 'ArrowLeft');
    expect(nodes[1].node.elem.expanded).toEqual(true);
    notTabbable(nodes[1], attrNull);
    tabbable(nodes[2]);
  });

  test('should veto before collapse response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforecollapsed, (e: any) => {
      e.detail.response(false); // veto
    });
    tree.data = dataset;
    const id = '#public-folders';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    tree.collapse(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
  });

  test('should trigger collapsed event', () => {
    tree.data = dataset;
    const mockCallback = jest.fn(() => { });
    tree.addEventListener(IdsTreeShared.EVENTS.collapsed, mockCallback);
    const id = '#public-folders';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    tree.collapse(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should veto before expand response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforeexpanded, (e: any) => {
      e.detail.response(false); // veto
    });
    tree.data = dataset;
    const id = '#icons';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(false);
    tree.expand(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
  });

  test('should trigger expanded event', () => {
    tree.data = dataset;
    const mockCallback = jest.fn(() => { });
    tree.addEventListener(IdsTreeShared.EVENTS.expanded, mockCallback);
    const id = '#icons';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(false);
    tree.expand(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should veto selection response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforeselected, (e: any) => {
      e.detail.response(false); // veto
    });
    tree.data = dataset;
    const id = '#leadership';
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(false);
  });

  test('should trigger selected event', () => {
    tree.data = dataset;
    const mockCallback = jest.fn(() => { });
    tree.addEventListener(IdsTreeShared.EVENTS.selected, mockCallback);
    const id = '#leadership';
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(true);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should veto unselection response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforeunselected, (e: any) => {
      e.detail.response(false); // veto
    });
    tree.data = dataset;
    const id = '#leadership';
    expect(tree.isSelected(id)).toEqual(false);
    tree.unselect(id);
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(true);
    tree.unselect(id);
    expect(tree.isSelected(id)).toEqual(true);
  });

  test('should trigger unselected event', () => {
    tree.data = dataset;
    const mockCallback = jest.fn(() => { });
    tree.addEventListener(IdsTreeShared.EVENTS.unselected, mockCallback);
    const id = '#leadership';
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(true);
    expect(mockCallback.mock.calls.length).toBe(0);
    tree.unselect(id);
    expect(tree.isSelected(id)).toEqual(false);
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
