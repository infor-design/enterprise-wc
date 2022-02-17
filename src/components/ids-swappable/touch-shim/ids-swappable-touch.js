import DataTransfer from './ids-swappable-transfer';

export default class DragDropWithTouchSupportShim {
  /**
   * Creates an instance of PolyfillDragDropWithTouchSupport
   * @param {object} args sds
   * @param {number} [args.threshold=5] sad
   * @param {number} [args.opacity=0.8] sdas
   * @param {number} [args.dblClick=500]
   * @param {number} [args.ctxMenu=900]
   * @param {number} [args.isPressHoldMode=400]
   * @param {number} [args.pressHoldAwait=400]
   * @param {number} [args.pressHoldMargin=25]
   * @param {number} [args.pressHoldThreshold=0]
  */
  constructor({
    threshold = 5,
    opacity = 0.8,
    dblClick = 500,
    ctxMenu = 900,
    isPressHoldMode = 400,
    pressHoldAwait = 400,
    pressHoldMargin = 25,
    pressHoldThreshold = 0,
  } = {}) {
    this.setting = {
      THRESHOLD: threshold,
      OPACITY: opacity,
      DBL_CLICK: dblClick,
      CTX_MENU: ctxMenu,
      IS_PRESS_HOLD_MODE: isPressHoldMode,
      PRESS_HOLD_AWAIT: pressHoldAwait,
      PRESS_HOLD_MARGIN: pressHoldMargin,
      PRESS_HOLD_THRESHOLD: pressHoldThreshold,
    };

    this.setInternalHoldersToDefault();

    this.removeAttributes = 'id,class,style,draggable'.split(',');
    this.keyboardProperties = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
    this.coordinateProperties = 'pageX,pageY,clientX,clientY,screenX,screenY'.split(',');

    document.addEventListener('touchstart', this.touchstart.bind(this), {
      passive: false,
      capture: false,
    });
    document.addEventListener('touchmove', this.touchmove.bind(this), {
      passive: false,
      capture: false,
    });
    document.addEventListener('touchend', this.touchend.bind(this));
    document.addEventListener('touchcancel', this.touchend.bind(this));
  }

  /**
   * Set the world
   */
  setInternalHoldersToDefault() {
    this.destroyImage();
    this.dragSource = null;
    this.lastTouch = null;
    this.lastTarget = null;
    this.ptDown = null;
    this.isDragEnabled = false;
    this.isDropZone = false;
    this.dataTransfer = new DataTransfer();
    clearInterval(this.pressHoldInterval);
  }

  touchstart(event) {
    if (this.shouldHandleEvent(event)) {
      // raise double-click and prevent zooming
      if (Date.now() - this.lastClick < this.setting.DBL_CLICK) {
        if (this.dispatchEvent(event, 'dblclick', event.target)) {
          event.preventDefault();
          this.setInternalHoldersToDefault();
          return;
        }
      }
      this.setInternalHoldersToDefault();
      const sourceElementThatIsDragging = this.findClosestDraggable(event);

      if (sourceElementThatIsDragging) {
        // give caller a chance to handle the hover/move events
        if (
          !this.dispatchEvent(event, 'mousemove', event.target) &&
          !this.dispatchEvent(event, 'mousedown', event.target)
        ) {
          // get ready to start dragging
          this.dragSource = sourceElementThatIsDragging;
          this.ptDown = this.getPoint(event);
          this.lastTouch = event;
          event.preventDefault();
          // show context menu if the user hasn't started dragging after a while
          setTimeout(() => {
            if (this.dragSource === sourceElementThatIsDragging && this.img == null) {
              if (this.dispatchEvent(event, 'contextmenu', sourceElementThatIsDragging)) {
                this.setInternalHoldersToDefault();
              }
            }
          }, this.setting.CTX_MENU);
          if (this.setting.IS_PRESS_HOLD_MODE) {
            this.pressHoldInterval = setTimeout(() => {
              this.isDragEnabled = true;
              this.touchmove(event);
            }, this.setting.PRESS_HOLD_AWAIT);
          }
        }
      }
    }
  }

  touchmove(event) {
    if (this.shouldCancelPressHoldMove(event)) {
      this.setInternalHoldersToDefault();
      return;
    }
    if (this.shouldHandleMove(event) || this.shouldHandlePressHoldMove(event)) {
      // see if target wants to handle move
      const target = this.getDragOverTarget(event);

      if (this.dispatchEvent(event, 'mousemove', target)) {
        this.lastTouch = event;
        event.preventDefault();
        return;
      }
      // start dragging
      if (this.dragSource && !this.img && this.shouldStartDragging(event)) {
        this.dispatchEvent(event, 'dragstart', this.dragSource);
        this.createImage(event);
        this.dispatchEvent(event, 'dragenter', target);
      }
      // continue dragging
      if (this.img) {
        this.lastTouch = event;
        event.preventDefault(); // prevent scrolling
        if (target !== this.lastTarget) {
          this.dispatchEvent(this.lastTouch, 'dragleave', this.lastTarget);
          this.dispatchEvent(event, 'dragenter', target);
          this.lastTarget = target;
        }
        this.moveImage(event);
        this.isDropZone = this.dispatchEvent(event, 'dragover', target);
      }
    }
  }

  touchend(event) {
    if (this.shouldHandleEvent(event)) {
      // see if target wants to handle up
      if (this.dispatchEvent(this.lastTouch, 'mouseup', event.target)) {
        event.preventDefault();
        return;
      }
      // user clicked the element but didn't drag, so clear the source and simulate a click
      if (!this.img) {
        this.dragSource = null;
        this.dispatchEvent(this.lastTouch, 'click', event.composedPath()[0]);
        this.lastClick = Date.now();
      }
      // finish dragging
      this.destroyImage();

      if (this.dragSource) {
        if (event.type.indexOf('cancel') < 0) {
          this.dispatchEvent(this.lastTouch, 'drop', this.lastTarget);
        }
        this.dispatchEvent(this.lastTouch, 'dragend', this.dragSource);
        this.setInternalHoldersToDefault();
      }
    }
  }

  /**
   * Whether we should this is a touch event we should handle
   * @param {Event} event
   * @returns {Boolean}
   */
  shouldHandleEvent(event) {
    return event && !event.defaultPrevented && event.touches && event.touches.length < 2;
  }

  // use regular condition outside of press & hold mode
  shouldHandleMove(event) {
    return !this.setting.IS_PRESS_HOLD_MODE && this.shouldHandleEvent(event);
  }

  /**
   * allow to handle moves that involve many touches for press & hold
   * @param {*} event
   * @returns
   */
  shouldHandlePressHoldMove(event) {
    return (
      this.setting.IS_PRESS_HOLD_MODE && this.isDragEnabled && event && event.touches && event.touches.length
    );
  }

  // reset data if user drags without pressing & holding
  shouldCancelPressHoldMove(event) {
    return (
      this.setting.IS_PRESS_HOLD_MODE && !this.isDragEnabled && this.getDelta(event) > this.setting.PRESS_HOLD_MARGIN
    );
  }

  /**
   * start dragging when specified delta is detected
   * @param {*} event
   * @returns
   */
  shouldStartDragging(event) {
    const delta = this.getDelta(event);
    return (
      delta > this.setting.THRESHOLD || (this.setting.IS_PRESS_HOLD_MODE && delta >= this.setting.PRESS_HOLD_THRESHOLD)
    );
  }

  // get point for a touch event
  getPoint(event, page) {
    if (event && event.touches) {
      event = event.touches[0];
    }
    return {
      x: page ? event.pageX : event.clientX,
      y: page ? event.pageY : event.clientY,
    };
  }

  // get distance between the current touch event and the first one
  _getDelta(event) {
    if (this.setting.IS_PRESS_HOLD_MODE && !this.ptDown) {
      return 0;
    }
    const p = this.getPoint(event);
    return Math.abs(p.x - this.ptDown.x) + Math.abs(p.y - this.ptDown.y);
  }

  /**
   * Find what we're actually dragging over
   * @param {Event} event
   * @returns {HTMLElement}
   */
  getDragOverTarget(event) {
    let element;

    // find what we're looking for in the composed path that isn't a slot or a
    // fragment
    const found = event.composedPath().find(i => {
      if (i.nodeType === 1 && i.nodeName !== 'SLOT') {
        return i;
      }
    });

    if (found) {
      // find the shadow root for our target
      const theLowestShadowRoot = found.getRootNode();
      const pointFromTouchEvent = this.getPoint(event);
      element = theLowestShadowRoot.elementFromPoint(pointFromTouchEvent.x, pointFromTouchEvent.y);
    }
    return element;
  }

  // create drag image from source element
  _createImage(event) {
    // just in case...
    if (this.img) {
      this.destroyImage();
    }
    // create drag image from custom element or drag source
    const src = this.imgCustom || this.dragSource;
    this.img = src.cloneNode(true);
    this.copyStyle(src, this.img);
    this.img.style.top = this.img.style.left = '-9999px';
    // if creating from drag source, apply offset and opacity
    if (!this.imgCustom) {
      const rc = src.getBoundingClientRect();
      const pt = this.getPoint(event);
      this.imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
      this.img.style.opacity = this.setting.OPACITY.toString();
    }
    // add image to document
    this.moveImage(event);
    document.body.appendChild(this.img);
  }

  // dispose of drag image element
  _destroyImage() {
    if (this.img && this.img.parentElement) {
      this.img.parentElement.removeChild(this.img);
    }
    this.img = null;
    this.imgCustom = null;
  }

  // move the drag image element
  _moveImage(event) {
    requestAnimationFrame(() => {
      if (this.img) {
        const pt = this.getPoint(event, true);
        const s = this.img.style;
        s.position = 'absolute';
        s.pointerEvents = 'none';
        s.zIndex = '999999';
        s.left = `${Math.round(pt.x - this.imgOffset.x)}px`;
        s.top = `${Math.round(pt.y - this.imgOffset.y)}px`;
      }
    });
  }

  // copy properties from an object to another
  _copyProps(dst, src, props) {
    for (let i = 0; i < props.length; i++) {
      const p = props[i];
      dst[p] = src[p];
    }
  }

  _copyStyle(src, dst) {
    // remove potentially troublesome attributes
    this.removeAttributes.forEach(att => {
      dst.removeAttribute(att);
    });

    // copy canvas content
    if (src instanceof HTMLCanvasElement) {
      const cSrc = src;
      const cDst = dst;
      cDst.width = cSrc.width;
      cDst.height = cSrc.height;
      cDst.getContext('2d').drawImage(cSrc, 0, 0);
    }

    // copy style (without transitions)
    const cs = getComputedStyle(src);
    for (let i = 0; i < cs.length; i++) {
      const key = cs[i];
      if (key.indexOf('transition') < 0) {
        dst.style[key] = cs[key];
      }
    }
    dst.style.pointerEvents = 'none';
    // and repeat for all children
    for (let i = 0; i < src.children.length; i++) {
      this.copyStyle(src.children[i], dst.children[i]);
    }
  }

  _dispatchEvent(event, type, target) {
    if (event && target) {
      const evt = document.createEvent('Event');
      const t = event.touches ? event.touches[0] : event;
      evt.initEvent(type, true, true);
      evt.button = 0;
      evt.which = evt.buttons = 1;
      try {
        this.copyProps(evt, event, this.keyboardProperties);
        this.copyProps(evt, t, this.coordinateProperties);
      } catch (e) {}
      evt.dataTransfer = this.dataTransfer;
      target.dispatchEvent(evt);
      return evt.defaultPrevented;
    }
    return false;
  }

  /**
   * Find the closest draggable within the composedPath
   * @param {Event} event sads
   * @returns {HTMLElement} sad
   */
  findClosestDraggable(event) {
    return event.composedPath().find(i => {
      if (i.attributes) {
        return i.hasAttribute('draggable');
      }
    });
  }
}
