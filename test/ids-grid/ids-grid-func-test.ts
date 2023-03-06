import IdsGrid from '../../src/components/ids-grid/ids-grid';
// import IdsGridCell from '../../src/components/ids-grid/ids-grid-cell';

describe('IdsLayoutGrid Component', () => {
  let gridElem: IdsGrid;

  beforeEach(() => {
    gridElem = new IdsGrid();
    document.body.appendChild(gridElem);
  });

  afterEach(() => {
    // Clean up the component instance after each test
    document.body.removeChild(gridElem);
  });

  it('should set autoFit when value is truthy', () => {
    gridElem.autoFit = 'true';
    expect(gridElem.getAttribute('auto-fit')).toBe('');
  });

  it('should remove autoFit when value is falsy', () => {
    gridElem.autoFit = 'false';
    expect(gridElem.hasAttribute('auto-fit')).toBe(false);
  });

  it('should remove autoFit when value is null', () => {
    gridElem.autoFit = null;
    expect(gridElem.hasAttribute('auto-fit')).toBe(false);
  });

  it('should return true when autoFit is set to an empty string', () => {
    gridElem.setAttribute('auto-fit', '');
    expect(gridElem.autoFit).toBe(true);
  });

  it('should return false when autoFit is not set', () => {
    expect(gridElem.autoFit).toBe(false);
  });

  it('should return false when autoFit is set to a non-empty string', () => {
    gridElem.setAttribute('auto-fit', 'foo');
    expect(gridElem.autoFit).toBe(false);
  });

  it('should return null when autoFit is set to null', () => {
    gridElem.setAttribute('auto-fit', 'null');
    expect(gridElem.autoFit).toBe(null);
  });

  it('should set autoFill when value is truthy', () => {
    gridElem.autoFill = 'true';
    expect(gridElem.getAttribute('auto-fit')).toBe('');
  });

  it('should remove autoFill when value is falsy', () => {
    gridElem.autoFill = 'false';
    expect(gridElem.hasAttribute('auto-fit')).toBe(false);
  });

  it('should remove autoFill when value is null', () => {
    gridElem.autoFill = null;
    expect(gridElem.hasAttribute('auto-fit')).toBe(false);
  });

  it('should return true when autoFill is set to an empty string', () => {
    gridElem.setAttribute('auto-fit', '');
    expect(gridElem.autoFill).toBe(true);
  });

  it('should return false when autoFill is not set', () => {
    expect(gridElem.autoFill).toBe(false);
  });

  it('should return false when autoFill is set to a non-empty string', () => {
    gridElem.setAttribute('auto-fit', 'foo');
    expect(gridElem.autoFill).toBe(false);
  });

  it('should return null when autoFill is set to null', () => {
    gridElem.setAttribute('auto-fit', 'null');
    expect(gridElem.autoFill).toBe(null);
  });

  describe('cols attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.cols = '2';
      expect(gridElem.getAttribute('cols')).toBe('2');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.cols = null;
      expect(gridElem.hasAttribute('cols')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols', '3');
      expect(gridElem.cols).toBe('3');
    });
  });

  describe('colsXs attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.colsXs = '1';
      expect(gridElem.getAttribute('cols-xs')).toBe('1');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.colsXs = null;
      expect(gridElem.hasAttribute('cols-xs')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-xs', '2');
      expect(gridElem.colsXs).toBe('2');
    });
  });

  describe('colsSm attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.colsSm = '3';
      expect(gridElem.getAttribute('cols-sm')).toBe('3');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.colsSm = null;
      expect(gridElem.hasAttribute('cols-sm')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-sm', '4');
      expect(gridElem.colsSm).toBe('4');
    });
  });

  describe('colsMd attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.colsMd = '4';
      expect(gridElem.getAttribute('cols-md')).toBe('4');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.colsMd = null;
      expect(gridElem.hasAttribute('cols-md')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-md', '5');
      expect(gridElem.colsMd).toBe('5');
    });
  });

  describe('colsLg attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.colsLg = '5';
      expect(gridElem.getAttribute('cols-lg')).toBe('5');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.colsLg = null;
      expect(gridElem.hasAttribute('cols-lg')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-lg', '6');
      expect(gridElem.colsLg).toBe('6');
    });
  });

  describe('colsXl attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.colsXl = '6';
      expect(gridElem.getAttribute('cols-xl')).toBe('6');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.colsXl = null;
      expect(gridElem.hasAttribute('cols-xl')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-xl', '6');
      expect(gridElem.colsXl).toBe('6');
    });
  });

  describe('colsXxl attribute', () => {
    it('sets the attribute value correctly', () => {
      gridElem.colsXxl = '6';
      expect(gridElem.getAttribute('cols-xl')).toBe('6');
    });

    it('removes the attribute when null is passed', () => {
      gridElem.colsXxl = null;
      expect(gridElem.hasAttribute('cols-xl')).toBe(false);
    });

    it('returns the attribute value correctly', () => {
      gridElem.setAttribute('cols-xxl', '6');
      expect(gridElem.colsXxl).toBe('6');
    });
  });

  it('should set minColWidth correctly when a non-null value is provided', () => {
    gridElem.minColWidth = '200px';
    expect(gridElem.getAttribute('min-col-width')).toEqual('200px');
  });

  it('should remove minColWidth when a null value is provided', () => {
    gridElem.minColWidth = '200px';
    gridElem.minColWidth = null;
    expect(gridElem.hasAttribute('min-col-width')).toBeFalsy();
  });

  it('should return the correct value when minColWidth get function is called', () => {
    gridElem.minColWidth = '200px';
    expect(gridElem.minColWidth).toEqual('200px');
  });

  it('should set maxColWidth correctly when a non-null value is provided', () => {
    gridElem.maxColWidth = '200px';
    expect(gridElem.getAttribute('max-col-width')).toEqual('200px');
  });

  it('should remove maxColWidth when a null value is provided', () => {
    gridElem.maxColWidth = '200px';
    gridElem.maxColWidth = null;
    expect(gridElem.hasAttribute('max-col-width')).toBeFalsy();
  });

  it('should return the correct value when maxColWidth get function is called', () => {
    gridElem.maxColWidth = '200px';
    expect(gridElem.maxColWidth).toEqual('200px');
  });

  it('should set minRowHeight correctly when a non-null value is provided', () => {
    gridElem.minRowHeight = '200px';
    expect(gridElem.getAttribute('min-row-height')).toEqual('200px');
  });

  it('should remove minRowHeight when a null value is provided', () => {
    gridElem.minRowHeight = '200px';
    gridElem.minRowHeight = null;
    expect(gridElem.hasAttribute('min-row-height')).toBeFalsy();
  });

  it('should return the correct value when minRowHeight get function is called', () => {
    gridElem.minRowHeight = '200px';
    expect(gridElem.minRowHeight).toEqual('200px');
  });

  it('should set maxRowHeight correctly when a non-null value is provided', () => {
    gridElem.maxRowHeight = '200px';
    expect(gridElem.getAttribute('max-row-height')).toEqual('200px');
  });

  it('should remove maxRowHeight when a null value is provided', () => {
    gridElem.maxRowHeight = '200px';
    gridElem.maxRowHeight = null;
    expect(gridElem.hasAttribute('max-row-height')).toBeFalsy();
  });

  it('should return the correct value when maxRowHeight get function is called', () => {
    gridElem.maxRowHeight = '200px';
    expect(gridElem.maxRowHeight).toEqual('200px');
  });

  it('should correctly set the gap attribute', () => {
    test('setting valid gap value', () => {
      gridElem.gap = 'md';
      expect(gridElem.getAttribute('gap')).toBe('md');
    });

    test('setting null gap value', () => {
      gridElem.gap = null;
      expect(gridElem.getAttribute('gap')).toBe(null);
    });

    test('setting invalid gap value', () => {
      gridElem.gap = 'xxl';
      expect(gridElem.getAttribute('gap')).toBe(null);
    });

    test('getting gap value', () => {
      gridElem.setAttribute('gap', 'sm');
      expect(gridElem.gap).toBe('sm');
    });
  });

  it('should set margin attribute', () => {
    gridElem.margin = 'md';
    expect(gridElem.getAttribute('margin')).toBe('md');
  });

  it('should remove margin attribute when value is null', () => {
    gridElem.margin = null;
    expect(gridElem.getAttribute('margin')).toBeNull();
  });

  it('should remove margin attribute when value is not one of the allowed values', () => {
    gridElem.margin = 'invalid-value';
    expect(gridElem.getAttribute('margin')).toBeNull();
  });

  it('should set padding attribute', () => {
    gridElem.padding = 'md';
    expect(gridElem.getAttribute('padding')).toBe('md');
  });

  it('should remove padding attribute when value is null', () => {
    gridElem.padding = null;
    expect(gridElem.getAttribute('padding')).toBeNull();
  });

  it('should remove padding attribute when value is not one of the allowed values', () => {
    gridElem.padding = 'invalid-value';
    expect(gridElem.getAttribute('padding')).toBeNull();
  });
});
