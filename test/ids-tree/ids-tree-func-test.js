/**
 * @jest-environment jsdom
 */
import IdsTree from '../../src/components/ids-tree/ids-tree';
import IdsTreeShared from '../../src/components/ids-tree/ids-tree-shared';
import IdsContainer from '../../src/components/ids-container/ids-container';

const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resolve);
  });
});

describe('IdsTree Component', () => {
  let container;
  let tree;
  let dataset;

  beforeEach(async () => {
    const elem = new IdsTree();
    container = new IdsContainer();
    container.appendChild(elem);
    document.body.appendChild(container);
    tree = container.querySelector('ids-tree');
    tree.language = 'en';
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

  afterEach(async () => {
    document.body.innerHTML = '';
    dataset = null;
  });

  it('renders with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-tree label="testing tree">
        <ids-tree-node id="node1">Test (node1)</ids-tree-node>
        <ids-tree-node id="node2" label="Test Folders (node2)">
          <ids-badge slot="badge" color="info" shape="round">5</ids-badge>
          <ids-tree-node id="node3" label="Test Folders (node3)">
            <ids-tree-node id="node4">Test (node4)</ids-tree-node>
            <ids-tree-node id="node5">Test (node5)</ids-tree-node>
          </ids-tree-node>
        </ids-tree-node>
      </ids-tree>`;
    tree = template.content.childNodes[0];
    document.body.appendChild(tree);
    await processAnimFrame();
    tree.remove();
    expect(document.querySelectorAll('ids-tree').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should sets the tree group collapse icon', () => {
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

  it('should sets the tree as disabled', () => {
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

  it('should sets the tree group expand icon', () => {
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

  it('should sets the tree as expanded', () => {
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

  it('should sets the tree node icon', () => {
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

  it('should sets the tree aria label text', () => {
    const label = 'testing tree';
    expect(tree.getAttribute('label')).toEqual(null);
    expect(tree.container.getAttribute('aria-label')).toEqual(IdsTreeShared.TREE_ARIA_LABEL);
    tree.label = label;
    expect(tree.getAttribute('label')).toEqual(label);
    expect(tree.container.getAttribute('aria-label')).toEqual(label);
    tree.label = null;
    expect(tree.getAttribute('label')).toEqual(null);
    expect(tree.container.getAttribute('aria-label')).toEqual(IdsTreeShared.TREE_ARIA_LABEL);
  });

  it('should sets the tree selectable', () => {
    let selectable = 'single';
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

  it('should update toggle collapse icon', () => {
    tree.data = dataset;
    tree.useToggleTarget = true;
    const icon = 'chevron-right';
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(null);
    expect(tree.toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    tree.toggleCollapseIcon = icon;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(icon);
    expect(tree.toggleCollapseIcon).toEqual(icon);
  });

  it('should sets the tree toggle collapse icon', () => {
    const icon = 'chevron-right';
    tree.useToggleTarget = true;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(null);
    expect(tree.toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    tree.toggleCollapseIcon = icon;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(icon);
    expect(tree.toggleCollapseIcon).toEqual(icon);
    tree.toggleCollapseIcon = null;
    expect(tree.getAttribute('toggle-collapse-icon')).toEqual(null);
    expect(tree.toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
  });

  it('should sets the tree toggle expand icon', () => {
    const icon = 'chevron-down';
    tree.useToggleTarget = true;
    expect(tree.getAttribute('toggle-expand-icon')).toEqual(null);
    expect(tree.toggleExpandIcon).toEqual(IdsTreeShared.DEFAULTS.toggleExpandIcon);
    tree.toggleExpandIcon = icon;
    expect(tree.getAttribute('toggle-expand-icon')).toEqual(icon);
    expect(tree.toggleExpandIcon).toEqual(icon);
    tree.toggleExpandIcon = null;
    expect(tree.getAttribute('toggle-expand-icon')).toEqual(null);
    expect(tree.toggleExpandIcon).toEqual(IdsTreeShared.DEFAULTS.toggleExpandIcon);
  });

  it('should sets the tree toggle icon rotate', () => {
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

  it('should sets the tree to use toggle target', () => {
    expect(tree.getAttribute('use-toggle-target')).toEqual(null);
    expect(tree.useToggleTarget).toEqual(IdsTreeShared.DEFAULTS.useToggleTarget);
    tree.useToggleTarget = true;
    expect(tree.getAttribute('use-toggle-target')).toEqual('true');
    expect(tree.useToggleTarget).toEqual(true);
    tree.useToggleTarget = false;
    expect(tree.getAttribute('use-toggle-target')).toEqual('false');
    expect(tree.useToggleTarget).toEqual(false);
    tree.useToggleTarget = null;
    expect(tree.getAttribute('use-toggle-target')).toEqual(null);
    expect(tree.useToggleTarget).toEqual(IdsTreeShared.DEFAULTS.useToggleTarget);
  });

  it('should sets the tree to use dataset', () => {
    tree.data = 'test';
    expect(tree.data).toEqual(expect.arrayContaining([]));
    expect(tree.data.length).toEqual(0);
    tree.data = [];
    expect(tree.data).toEqual(expect.arrayContaining([]));
    expect(tree.data.length).toEqual(0);
    tree.data = dataset;
    expect(tree.getNode('#home')).toEqual(expect.objectContaining({
      data: dataset[0],
      isGroup: false,
      level: 1,
      posinset: 1,
      setsize: 3
    }));
    expect(tree.getNode('#public-folders')).toEqual(expect.objectContaining({
      data: dataset[1],
      isGroup: true,
      level: 1,
      posinset: 2,
      setsize: 3
    }));
    expect(tree.getNode('#leadership')).toEqual(expect.objectContaining({
      data: dataset[1].children[0],
      isGroup: false,
      level: 2,
      posinset: 1,
      setsize: 3
    }));
    expect(tree.getNode('#history')).toEqual(expect.objectContaining({
      data: dataset[1].children[1],
      isGroup: false,
      level: 2,
      posinset: 2,
      setsize: 3
    }));
    expect(tree.getNode('#careers-last')).toEqual(expect.objectContaining({
      data: dataset[1].children[2],
      isGroup: false,
      level: 2,
      posinset: 3,
      setsize: 3
    }));
    expect(tree.getNode('#icons')).toEqual(expect.objectContaining({
      data: dataset[2],
      isGroup: true,
      level: 1,
      posinset: 3,
      setsize: 3
    }));
    expect(tree.getNode('#audio')).toEqual(expect.objectContaining({
      data: dataset[2].children[0],
      isGroup: false,
      level: 2,
      posinset: 1,
      setsize: 1
    }));
  });

  it('should sets init icons', () => {
    tree.icon = 'tree-node';
    tree.collapseIcon = 'closed-folder';
    tree.expandIcon = 'open-folder';
    tree.data = dataset;
  });

  it('should sets the tree node single selection', () => {
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

  it('should gets the tree node for selection multiple', () => {
    tree.data = dataset;
    const selectable = 'multiple';
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual(selectable);
    expect(tree.selectable).toEqual(selectable);
    expect(tree.selected).toEqual(expect.arrayContaining([]));
    expect(tree.selected.length).toEqual(0);
  });

  it('should gets the tree node for selection false', () => {
    tree.data = dataset;
    const selectable = 'false';
    tree.selectable = selectable;
    expect(tree.getAttribute('selectable')).toEqual(selectable);
    expect(tree.selectable).toEqual(false);
    expect(tree.selected).toEqual(null);
  });

  it('should collapse all attached nodes', () => {
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

  it('should expand all attached nodes', () => {
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

  it('should collapse node', () => {
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

  it('should call expand node', () => {
    tree.data = dataset;
    const id = '#icons';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(false);
    tree.expand(id);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
  });

  it('should toggle node', () => {
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

  it('should handle node click actions', () => {
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

    tree.useToggleTarget = true;
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

  it('should toggle node and select on click', () => {
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

  it('should toggle node and select on keyup enter or space', () => {
    tree.data = dataset;
    const id = '#public-folders';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    expect(tree.isSelected(id)).toEqual(false);
    let event = new KeyboardEvent('keyup', { code: 'Enter' });
    node.elem.nodeContainer.dispatchEvent(event);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    expect(tree.isSelected(id)).toEqual(true);
    event = new KeyboardEvent('keyup', { code: 'Space' });
    node.elem.nodeContainer.dispatchEvent(event);
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);
    expect(tree.isSelected(id)).toEqual(true);
  });

  it('should moves focus on keydown Down Arrow', () => {
    tree.data = dataset;
    const tabbable = (n) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n, isNull) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes = [];
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

  it('should moves focus on keydown Up Arrow', () => {
    tree.data = dataset;
    const tabbable = (n) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n, isNull) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes = [];
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

  it('should moves focus on keydown Right Arrow', () => {
    tree.data = dataset;
    const tabbable = (n) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n, isNull) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes = [];
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

  it('should moves focus on keydown Left Arrow', () => {
    tree.data = dataset;
    const tabbable = (n) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n, isNull) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n) => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes = [];
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

  it('should prevent keys', () => {
    tree.data = dataset;
    const nodes = [];
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

  it('should moves focus on keydown RTL', () => {
    tree.data = dataset;
    tree.language = 'ar';
    expect(tree.getAttribute('dir')).toEqual('rtl');
    expect(tree.container.getAttribute('dir')).toEqual('rtl');

    const tabbable = (n) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual('true');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('0');
    };
    const notTabbable = (n, isNull) => {
      expect(n.node.elem.getAttribute('tabbable')).toEqual(isNull ? null : 'false');
      expect(n.node.elem.nodeContainer.getAttribute('tabindex')).toEqual('-1');
    };
    const dispatchEvent = (n, eventKey) => {
      const event = new KeyboardEvent('keydown', { code: eventKey });
      n.node.elem.nodeContainer.dispatchEvent(event);
    };
    const nodes = [];
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

  it('should update with container language change', () => {
    tree.data = dataset;
    tree.language = 'en';
    const language = { before: 'en', after: 'ar' };
    const mockCallback = jest.fn((e) => {
      expect(e.detail.language.name).toEqual(language.after);
    });

    expect(tree.language.name).toEqual(language.before);
    container.addEventListener('languagechange', mockCallback);
    const event = new CustomEvent('languagechange', {
      detail: { language: { name: language.after } }
    });
    container.dispatchEvent(event);
    tree.dispatchEvent(event);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should veto before collapse response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforecollapsed, (e) => {
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

  it('should trigger collapsed event', () => {
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

  it('should veto before expand response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforeexpanded, (e) => {
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

  it('should trigger expanded event', () => {
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

  it('should veto selection response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforeselected, (e) => {
      e.detail.response(false); // veto
    });
    tree.data = dataset;
    const id = '#leadership';
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(false);
  });

  it('should trigger selected event', () => {
    tree.data = dataset;
    const mockCallback = jest.fn(() => { });
    tree.addEventListener(IdsTreeShared.EVENTS.selected, mockCallback);
    const id = '#leadership';
    expect(tree.isSelected(id)).toEqual(false);
    tree.select(id);
    expect(tree.isSelected(id)).toEqual(true);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should veto unselection response', () => {
    tree.data = dataset;
    tree.addEventListener(IdsTreeShared.EVENTS.beforeunselected, (e) => {
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

  it('should trigger unselected event', () => {
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

  it('should call tree template', () => {
    tree.disabled = true;
    tree.template();
    dataset[0].badge = {};
    dataset[0].label = 'Home';
    dataset[1].label = 'Public Folders';
    dataset[1].selected = true;
    dataset[1].children[0].text = null;
    tree.data = dataset;
    expect(tree.isSelected('#home')).toEqual(true);
    expect(tree.isSelected('#public-folders')).toEqual(false);
  });

  it('should set node selectable', () => {
    tree.data = dataset;
    const id = '#home';
    expect(tree.getNode(id).elem.selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
    expect(tree.isSelected(id)).toEqual(true);
    tree.getNode(id).elem.selectable = 'false';
    expect(tree.getNode(id).elem.selectable).toEqual(false);
    expect(tree.isSelected(id)).toEqual(false);
    tree.getNode(id).elem.selectable = 'test';
    expect(tree.getNode(id).elem.selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
  });

  it('should set node null attributes', () => {
    tree.data = dataset;
    const node = tree.getNode('#home');
    node.elem.label = null;
    node.elem.icon = null;
    node.elem.expanded = null;
    node.elem.expandIcon = null;
    node.elem.disabled = null;
    node.elem.collapseIcon = null;
    node.elem.useToggleTarget = null;
    expect(node.elem.useToggleTarget).toEqual(false);
    expect(node.elem.label).toEqual('');
    expect(node.elem.toggleIcon).toEqual('');
  });

  it('should expand/collapse tree node', () => {
    tree.data = dataset;
    let id = '#home';
    let node = tree.getNode(id);
    expect(node.isGroup).toEqual(false);
    tree.expand(id);

    id = '#public-folders';
    node = tree.getNode(id);
    tree.useToggleTarget = null;
    expect(node.elem.useToggleTarget).toEqual(false);
    tree.useToggleTarget = 'true';
    expect(tree.getAttribute('use-toggle-target')).toEqual('true');
    node.elem.tree = tree;
    tree.useToggleTarget = 'true';
    expect(node.isGroup).toEqual(true);
    expect(node.elem.useToggleTarget).toEqual(true);
    expect(node.elem.expanded).toEqual(true);
    node.elem.expanded = 'false';
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(false);
    node.elem.expanded = 'true';
    node = tree.getNode(id);
    expect(node.elem.expanded).toEqual(true);

    const mockCallback = jest.fn(() => { });
    let event = new CustomEvent('transitionend', { bubbles: true, detail: {} });
    node.elem.groupNodesEl.addEventListener('transitionend', mockCallback);
    node.elem.groupNodesEl.dispatchEvent(event);
    expect(mockCallback.mock.calls.length).toBe(1);

    const toggleIconEl = node.elem.shadowRoot?.querySelector('.toggle-icon');
    event = new CustomEvent('webkitAnimationEnd', { bubbles: true, detail: {} });
    toggleIconEl.addEventListener('webkitAnimationEnd', mockCallback);
    toggleIconEl.dispatchEvent(event);
    expect(mockCallback.mock.calls.length).toBe(2);
  });

  it('should renders characters and symbols', () => {
    const data = [{
      id: 'cs-1',
      text: '<online onload="alert()">'
    }, {
      id: 'cs-2',
      text: `< > & "
        &#33; &#34; &#35; &#36; &#37; &#38; &#39;
        &#40; &#41; &#42; &#43; &#44; &#45; &#46; &#47;
        &#161;, &#162;, &#163;, &#164;, &#165;, &#166;, &#167;, &#169;`
    }];
    tree.data = data;
    let node = tree.getNode('#cs-1');
    expect(node.elem.textContent).toContain('onload="alert()">');
    node = tree.getNode('#cs-2');
    expect(node.elem.textContent).toContain('< > & "');
    expect(node.elem.textContent).toContain('¢, £, ¤, ¥');
  });

  it('should renders with markup', async () => {
    document.body.innerHTML = `
      <ids-tree label="testing tree" use-toggle-target="true" toggle-icon-rotate="false">
        <ids-tree-node id="node0" selected="true">Test (node0)</ids-tree-node>
        <ids-tree-node id="node1">Test (node1)</ids-tree-node>
        <ids-tree-node id="node2" label="Test Folders (node2)">
          <ids-badge slot="badge" color="info" shape="round">5</ids-badge>
          <ids-tree-node id="node3" label="Test Folders (node3)">
            <ids-tree-node id="node4" disabled="true" icon="tree-node">Test (node4)</ids-tree-node>
            <ids-tree-node id="node5">Test (node5)</ids-tree-node>
          </ids-tree-node>
        </ids-tree-node>
        <ids-tree-node id="node6" label="Test Folders (node6)"
          collapse-icon="closed-folder"
          expand-icon="open-folder"
          expanded="false">
          <ids-tree-node id="node7" selected="true" tabbable="true">Test (node7)</ids-tree-node>
        </ids-tree-node>
      </ids-tree>`;
    await processAnimFrame();
    tree = document.querySelector('ids-tree');
    expect(tree.isSelected('#node0')).toEqual(true);
    expect(tree.isSelected('#node7')).toEqual(false);
  });
});
