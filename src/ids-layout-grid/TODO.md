# TODO on IDS Layout Grid

## Features

- [] Need to re-visit responsiveness as we begin to test complex layouts.
- [] Add a breakpoint properties for example:
  - `<ids-layout-grid cols="2" md-cols="4" lg-cols="8">` or
  - `<ids-layout-grid cols="{sm: 2, md: 4, lg: 8}">`
- [] Add fixed unit sizing options for cells and rows.
- [] Add `minColWidth` property. For auto-responsive grids that use `auto-fit` and `minmax` there could be a setting to control where the reflow happens `<ids-layout-grid minColWidth="120px">`
- [ ] Make `--grid-min-col-width` at https://github.com/infor-design/enterprise-wc/blob/main/src/ids-layout-grid/ids-layout-grid.scss#L17 a setting
