# What's New with Enterprise Web Components

## 1.0.0-beta.22

### 1.0.0-beta.22 Features
- `[ActionSheet]` Converted ActionSheet tests. ([#1915](https://github.com/infor-design/enterprise-wc/issues/1915))
- `[Datagrid]` Add ability (and example) to set editor's column settings from server. ([#1714](https://github.com/infor-design/enterprise-wc/issues/1714))
- `[Dropdown]` Fix issue where required dropdowns were note rendering asterisk in React and Angular examples. ([#2023](https://github.com/infor-design/enterprise-wc/issues/2023))
- `[Input]` Added `checkOverflow()` check to `IdsInput` to ensure only showing tooltip when text-overflow ellipses. ([#1755](https://github.com/infor-design/enterprise-wc/issues/1755))
- `[Input]` Fix clearing input value manually. ([#2011](https://github.com/infor-design/enterprise-wc/issues/2011))
- `[ListBuilder]` Added a check to deselect the previously selected automatically upon adding a new item in a single-select ListBuilder. ([#1809](https://github.com/infor-design/enterprse-wc/issues/1809))
- `[Lookup]` Fix `IdsLookup` (for Angular) so that modal triggers are attached after the modal has been mounted/constructed. ([#1889](https://github.com/infor-design/enterprise-wc/issues/1889))
- `[ProcessIndicator]` Style fix prevent labels and icons from overlapping on initial page-load. ([#1730](https://github.com/infor-design/enterprise-wc/issues/1730))
- `[PopupMenu]` Added ability to load menu data in a callback with `beforeShow`. ([#1804](https://github.com/infor-design/enterprise-wc/issues/1804))
- `[TagList]` Added a new `ids-tag-list` layout and eventing component. ([#1903](https://github.com/infor-design/enterprise-wc/issues/1903))

### 1.0.0-beta.22 Fixes

- `[Calendar]` Fix issue where duplicate "Today" buttons were created if showToday set to true multiple times. ([#2056](https://github.com/infor-design/enterprise-wc/issues/2056))
- `[Card]` Fix selected state styles for dark mode. ([#1887](https://github.com/infor-design/enterprise-wc/issues/1887))
- `[Checkbox]` Converted checkbox tests to playwright. ([#1870](https://github.com/infor-design/enterprise-wc/issues/1870))
- `[Container]` Converted container tests to playwright. ([#1924](https://github.com/infor-design/enterprise-wc/issues/1924))
- `[Counts]` Converted counts tests to playwright. ([#1927](https://github.com/infor-design/enterprise-wc/issues/1927))
- `[Datagrid]` Fixed a display issue with the new loading indicator in firefox. ([#1617](https://github.com/infor-design/enterprise-wc/issues/1617))
- `[Datagrid]` Added custom validation for editable datagrid cells. ([#1791](https://github.com/infor-design/enterprise-wc/issues/1791))
- `[Datagrid]` Converted datagrid tests to playwright. ([#1845](https://github.com/infor-design/enterprise-wc/issues/1845))
- `[Docs]` Added docs page for IdsGlobal. Moved some subcomponents that should not be used directly into their main component area. ([#1896](https://github.com/infor-design/enterprise-wc/issues/1896))
- `[Dropdown]` Fix issue where tooltips were not shown if options were lazy loaded. ([#2051](https://github.com/infor-design/enterprise-wc/issues/2051))
- `[Fieldset]` Fixed issue that popups in the fieldset were cut off. ([#1896](https://github.com/infor-design/enterprise-wc/issues/1896))
- `[General]` Fixed issue in input, swaplist and dropdown where some things did not work when reattached. ([#2015](https://github.com/infor-design/enterprise-wc/issues/2015))
- `[Icon]` Fixed yellow and caution status colors. ([#1879](https://github.com/infor-design/enterprise-wc/issues/1879))
- `[Image]` Converted image tests to playwright. ([#1942](https://github.com/infor-design/enterprise-wc/issues/1942))
- `[Lookup]` Fix error that was thrown upon modal open after detach/reattach of lookup. ([#2059](https://github.com/infor-design/enterprise-wc/issues/2059))
- `[ListView]` Added support for attributes `tooltip`, `max-width` and `overflow="ellipses"`. ([#1637](https://github.com/infor-design/enterprise-wc/issues/1637))
- `[Modal]` Converted modal, about, error page, action panel tests. ([#1847](https://github.com/infor-design/enterprise-wc/issues/1847))
- `[Radio]` Converted radio tests to playwright. ([#1872](https://github.com/infor-design/enterprise-wc/issues/1872))
- `[Tree]` Fixed selected event returning incorrect node data after adding children through addNodes. ([#1851](https://github.com/infor-design/enterprise-wc/issues/1851))
- `[Wizard]` Fixed broken wizard component in angular framework. ([#1885](https://github.com/infor-design/enterprise-wc/issues/1885))
- `[Wizard]` Converted wizard tests to playwright. ([#1994](https://github.com/infor-design/enterprise-wc/issues/1994))
- `[Attributes/LayoutGridCell]` Corrected the values of `COL_END_*` constants from `col_start_*` to `col_end_*` along with the test coverage of the `IdsLayoutGridCell`. ([#2075](https://github.com/infor-design/enterprise-wc/issues/2075))
- `[LayoutFlex]` Converted layout flex tests to playwright. ([#1944](https://github.com/infor-design/enterprise-wc/issues/1944))

## 1.0.0-beta.21

### 1.0.0-beta.21 Features

- `[Button]` Added `generative-ai` buttons and loading indicator. ([#1805](https://github.com/infor-design/enterprise-wc/issues/1805))

### 1.0.0-beta.21 Fixes

- `[ColorPicker]` Fix Color Picker support for angular form controls. ([#1774](https://github.com/infor-design/enterprise-wc/issues/1774))
- `[DataGrid]` Fixed clear button not deleting or clearing rows from other pages. ([#1757](https://github.com/infor-design/enterprise-wc/issues/1757))
- `[DataGrid]` Added dirty tracker to checkbox editor. ([#1747](https://github.com/infor-design/enterprise-wc/issues/1747))
- `[DataGrid]` Fixed duplicate context menu selected events. ([#1813](https://github.com/infor-design/enterprise-wc/issues/1813))
- `[Dropdown]` Fixed incorrect form values in reactive forms. ([#1850](https://github.com/infor-design/enterprise-wc/issues/1850))
- `[Slider]` Rounded up the value to decimal to match the tooltip. ([#1746](https://github.com/infor-design/enterprise-wc/issues/1746))
- `[TimePicker/Calendar]` Fixed outside click when interacting with the popup. ([#1860](https://github.com/infor-design/enterprise-wc/issues/1860))

## 1.0.0-beta.20

### 1.0.0-beta.20 Breaking Changes

- `[Popup]` By default, the popup can be closed by clicking outside. ([#1816](https://github.com/infor-design/enterprise-wc/issues/1816))

### 1.0.0-beta.20 Fixes

- `[AppMenu]` Added an issue to reclaim space on app menu. ([#1563](https://github.com/infor-design/enterprise-wc/issues/1563))
- `[Dropdown]` Fix typeahead on `ids-dropdown`. ([#1737](https://github.com/infor-design/enterprise-wc/issues/1737))
- `[Dropdown]` Fixed position and styling issue on some frameworks (standalone examples). ([#1834](https://github.com/infor-design/enterprise-wc/issues/1834))
- `[Dropdown/Datagrid]` Added style fixes to position the dropdown better next to the cell. ([#1770](https://github.com/infor-design/enterprise-wc/issues/1770))
- `[Input/Textarea]` Fix double input and change events. ([#1765](https://github.com/infor-design/enterprise-wc/issues/1765))
- `[Lookup/Datagrid]` Fixed an issue where newer added primary key logic caused selection to select the first row in certain cases. ([#1751](https://github.com/infor-design/enterprise-wc/issues/1751))
- `[Lookup]` Fix "Apply" button on `ids-lookup` so that it properly closes modal. ([#1670](https://github.com/infor-design/enterprise-wc/issues/1670))
- `[ModuleNav]` Added an example with no header area to ensure it reclaims space. ([#1563](https://github.com/infor-design/enterprise-wc/issues/1563))
- `[Multiselect]` Fixed issue in `ids-multiselect` where deselection would cause options to lose their sort-order in Angular. ([#1709](https://github.com/infor-design/enterprise-wc/issues/1709))
- `[Popupmenu]` Fixed an issue where a popupmenu is in the wrong position on the filter row when in a modal. ([#1766](https://github.com/infor-design/enterprise-wc/issues/1766))
- `[Pager]` Fixed an issue in angular where the buttons were invisible. ([#1826](https://github.com/infor-design/enterprise-wc/issues/1826))
- `[Text]` Fix attribute order bug where a re-render ignores font weight. ([#1775](https://github.com/infor-design/enterprise-wc/issues/1775))
- `[Textarea]` Fixed an issue where could not type in textarea. ([#1827](https://github.com/infor-design/enterprise-wc/issues/1827))

### 1.0.0-beta.20 Features

- `[FocusCaptureMixin]` Added `auto-focus` setting. ([#1675](https://github.com/infor-design/enterprise-wc/issues/1675))

## 1.0.0-beta.19

### 1.0.0-beta.19 Breaking Changes

- `[ChartLegendMixin]` Added `none` as a legend placement setting and made it default, allowing the legend to be completely hidden. During the process, changed all current IdsAreaChart, IdsAxisChart, IdsBarChart, IdsLineChart, and IdsPieChart examples to explicitly use `legend-placement` attribute where a legend is needed. ([#1672](https://github.com/infor-design/enterprise-wc/issues/1672))
- `[Colors]` Any settings that use status colors now all use the same values of `error / warning / caution / info / success`, the settings `alert, good, danger` no longer will work. ([#1801](https://github.com/infor-design/enterprise-wc/issues/1801))
- `[Colors]` Any components that use colors as a setting now use a generic color names instead of previous color words. For example `azure=blue`, `ruby=red`, `amber=yellow` and all color numbers will use the 2x10 digit code (10-100). For example: `color="blue-60"` `color="yellow-60"`. For examples and color samples see the [color palette page](https://main.wc.design.infor.com/ids-color/palette.html). ([#1801](https://github.com/infor-design/enterprise-wc/issues/1801))
- `[Icons]` Not really breaking but be aware that all icons are changed to the newly designed icons. ([#1801](https://github.com/infor-design/enterprise-wc/issues/1801))
- `[Text]` `IdsText` was not showing tooltip when tooltip attribute was set dynamically. ([#1638](https://github.com/infor-design/enterprise-wc/issues/1638))

### 1.0.0-beta.19 Features

- `[InputGroup]` Added `IdsInputGroup` component to handle group validation warnings. ([#1673](https://github.com/infor-design/enterprise-wc/issues/1673))
- `[PopupMenu]` Added ability to set `arrow` on the IdsPopupMenu so that it filters down to IdsPopup underneath, can now disable or change arrow direction. ([#1290](https://github.com/infor-design/enterprise-wc/issues/1290))

### 1.0.0-beta.19 Fixes

- `[ActionPanel]` Fixed slide from bottom animation style ([#1820](https://github.com/infor-design/enterprise-wc/issues/1820)) ([#1787](https://github.com/infor-design/enterprise-wc/issues/1787))
- `[AxisChart]` Fixed position of labels in RTL mode. ([#1716](https://github.com/infor-design/enterprise-wc/issues/1716))
- `[Datagrid]` Datagrid fix for left/right arrow-keys to work inside editable-cell. ([#1588](https://github.com/infor-design/enterprise-wc/issues/1588))
- `[Dropdown|Multiselect]` Broken Dropdown and Multiselect fixed in Angular. ([#1762](https://github.com/infor-design/enterprise-wc/issues/1762))
- `[Dropdown]` Prevent dropdown from auto scrolling view when list box is opened. ([#1681](https://github.com/infor-design/enterprise-wc/issues/1681))
- `[Datagrid]` Fix for empty-data text still showing after adding a grid row. ([#1580](https://github.com/infor-design/enterprise-wc/issues/1580))
- `[Datagrid]` Fix for RTL direction of datagrid filter header. ([#1669](https://github.com/infor-design/enterprise-wc/issues/1669))
- `[Checkbox]` Adjust the label to be positioned in the center. ([#1738](https://github.com/infor-design/enterprise-wc/issues/1738))
- `[Editor]` Fix hyerplink action for safari and firefox. ([#982](https://github.com/infor-design/enterprise-wc/issues/982))
- `[Editor]` Fix font style and alignment action for safari. ([#983](https://github.com/infor-design/enterprise-wc/issues/983))
- `[Editor]` Fix text color action for safari. ([#1079](https://github.com/infor-design/enterprise-wc/issues/1079))
- `[Icon]` Fixed a bug where setting `color` did not work. ([#1790](https://github.com/infor-design/enterprise-wc/issues/1790))
- `[Input]` Renamed internal labels and fixed routines that look for labels to fix an issue with missing labels. ([#1752](https://github.com/infor-design/enterprise-wc/issues/1752))
- `[ListBuilder]` Fixed spacebar on IdsListBuilder so that input-field properly displays spaces. ([#1768](https://github.com/infor-design/enterprise-wc/issues/1768))
- `[LoadingIndicator]` Fixed an issue where the inner bars within the loader where not the same size. ([#1768](https://github.com/infor-design/enterprise-wc/issues/1768))
- `[Locale]` Changed all `zh` time formats to 24hr as suggested by native speakers. ([#8313](https://github.com/infor-design/enterprise-wc/issues/8313))
- `[Lookup]` Fixed the size of the datagrid on lookups in responsive and normal mode. ([#1736](https://github.com/infor-design/enterprise-wc/issues/1736))
- `[NotificationBanner]` Made the message text updatable to fix rendering issues. ([#1782](https://github.com/infor-design/enterprise-wc/issues/1782))
- `[Slider]` Fixed issue with setting value through attribute. ([#1667](https://github.com/infor-design/enterprise-wc/issues/1667))
- `[Tabs]` Fixed `selected` attribute occasionally not working.  ([#1705](https://github.com/infor-design/enterprise-wc/issues/1705))
- `[Treemap]` Fixed label and value position in RTL. ([#1731](https://github.com/infor-design/enterprise-wc/issues/1731))
- `[Tooltip]` Added `tooltip-placement` attribute to `IdsTooltipMixin` so any element inheriting from it can set tooltip's placement. ([#1639](https://github.com/infor-design/enterprise-wc/issues/1639))
- `[Widget]` Added css part to the widget body element. ([#1771](https://github.com/infor-design/enterprise-wc/issues/1771))

## 1.0.0-beta.18

### 1.0.0-beta.18 Breaking Changes

- `[Listview]` Add fixes to ensure all selection and activation events work properly. During the process renamed the `itemactivated` events to `activated`. ([#1543](https://github.com/infor-design/enterprise-wc/issues/1543))

### 1.0.0-beta.18 Features

- `[Calendar]` Add `eventsrendered` event and slot `custom-legend` for custom legends. ([#1564](https://github.com/infor-design/enterprise-wc/issues/1564))
- `[LoadingIndicator]` Added new settings and example to show a full page loading indicator with page blocking. ([#1520](https://github.com/infor-design/enterprise-wc/issues/1520))
- `[TriggerField]` Added an example showing a menu on trigger button click. ([#1697](https://github.com/infor-design/enterprise-wc/issues/1697))
- `[Text]` Added code to line up an icon with text in the IdsText component. ([#1759](https://github.com/infor-design/enterprise-wc/issues/1759))

### 1.0.0-beta.18 Fixes

- `[AxisChart]` Re-added a responsive example. ([#1676](https://github.com/infor-design/enterprise-wc/issues/1676))
- `[AxisChart]` Now hides the legend item if the `name` field is left off. ([#1720](https://github.com/infor-design/enterprise-wc/issues/1720))
- `[Breadcrumb]` Fixed toolbar alignment, removed `add` and `remove` instead made the breadcrumb update correctly on `slotchange`. Also added more Angular examples. ([#1640](https://github.com/infor-design/enterprise-wc/issues/1640))
- `[Breadcrumb]` Fixed an issue where appended breadcrumbs did not get the correct styles. ([#1717](https://github.com/infor-design/enterprise-wc/issues/1717))
- `[Calendar]` Added `suppress-form` setting to allow custom user UI for calendar event forms. ([#1474](https://github.com/infor-design/enterprise-wc/issues/1474))
- `[Checkbox]` Fixed checkbox and checkbox-group so that values are properly reflected in Angular when using `ngDefaultControl`. ([#1693](https://github.com/infor-design/enterprise-wc/issues/1693))
- `[DataGrid]` Enabled row selection across paged datasets in both server-side and client-side. ([#1565](https://github.com/infor-design/enterprise-wc/issues/1565))
- `[DataGrid]` Fixed dropdown cells to no longer open their lists inside cells (attach to grid instead). ([#1600](https://github.com/infor-design/enterprise-wc/issues/1600))
- `[Checkbox]` Fixed checkbox and checkbox-group so that values are properly reflected in Angular when using `ngDefaultControl`. ([#1693](https://github.com/infor-design/enterprise-wc/issues/1693))
- `[DataGrid]` Fixed dropdown cells to no longer open their lists inside cells (attach to grid instead). ([#1600](https://github.com/infor-design/enterprise-wc/issues/1600))
- `[DataGrid]` Added number mask to pager input. ([#1613](https://github.com/infor-design/enterprise-wc/issues/1613))
- `[DataGrid]` Fixed dirty indicator alignment for `xxs` row height. ([#1602](https://github.com/infor-design/enterprise-wc/issues/1602))
- `[DataGrid]` Fixed an issue where empty message permanently removes the datagrid container height. ([#1664](https://github.com/infor-design/enterprise-wc/issues/1664))
- `[DataGrid]` Fixed an issue with the dirty indicator cell data after column reorder. ([#1601](https://github.com/infor-design/enterprise-wc/issues/1601))
- `[DataGrid]` Fixed empty space issue when filtering with virtual scroll enabled. ([#1711](https://github.com/infor-design/enterprise-wc/issues/1711))
- `[DataSource]` Implement create/update/delete operations and primary key setting. ([#1565](https://github.com/infor-design/enterprise-wc/issues/1565))
- `[General]` Fixed an issue where some properties did not work in safari. To do this changed the order of where styles and templates are appended in the lifecycle. ([#1599](https://github.com/infor-design/enterprise-wc/issues/1599))
- `[ListView|ListBulider]` Improved `IdsListView` and `IdsListBuilder` integration with new `IdsListViewItem` child-component. ([#1400](https://github.com/infor-design/enterprise-wc/issues/1400))
- `[ScrollView]` Fixed circle button display/placement when re-rendering with a new dataset.  ([#1577](https://github.com/infor-design/enterprise-wc/issues/1577))
- `[General]` Fixed an issue where some properties did not work in safari. To do this changed the order of where styles and templates are appended in the lifecycle. ([#1599](https://github.com/infor-design/enterprise-wc/issues/1599))
- `[ListView/ListBulider]` Improved `IdsListView` and `IdsListBuilder` integration with new `IdsListViewItem` child-component. ([#1400](https://github.com/infor-design/enterprise-wc/issues/1400))
- `[ListView/ListBulider]` Added tests for selection and activation events and fixed duplicate click events. ([#1543](https://github.com/infor-design/enterprise-wc/issues/1543))
- `[Modal]` Fix rendering issues in Angular environments. ([#1744](https://github.com/infor-design/enterprise-wc/issues/1744))
- `[ModuleNav]` Add support for User area (IdsModuleNavUser). ([#1677](https://github.com/infor-design/enterprise-wc/issues/1677))
- `[ScrollView]` Fixed circle button display/placement when re-rendering with a new dataset.  ([#1577](https://github.com/infor-design/enterprise-wc/issues/1577))
- `[Spinbox]` Now allows steps to be created out of step range.  ([#695](https://github.com/infor-design/enterprise-wc/issues/695))
- `[Spinbox]` Now corrects values when type over the min and max range.  ([#1678](https://github.com/infor-design/enterprise-wc/issues/1678))
- `[Spinbox]` Now masks input to make sure its a number.  ([#1578](https://github.com/infor-design/enterprise-wc/issues/1578))
- `[Text]` Added text example with line-clamp setting. ([#1585](https://github.com/infor-design/enterprise-wc/issues/1585))
- `[Tabs]` Fixed `x` button alignment in module tabs.  ([#1696](https://github.com/infor-design/enterprise-wc/issues/1696))
- `[Tabs]` Fixed `selected` attribute occasionally not working.  ([#1705](https://github.com/infor-design/enterprise-wc/issues/1705))
- `[Tabs]` Fixed missing tab imports in the bundle.  ([#1718](https://github.com/infor-design/enterprise-wc/issues/1718))
- `[Tree]` Fixed a bug where the tree `label` did not work on parent folder nodes.  ([#1683](https://github.com/infor-design/enterprise-wc/issues/1683))
- `[Tree]` Fixed a maximum call stack error when dynamically adding nodes to tree. ([#1649](https://github.com/infor-design/enterprise-wc/issues/1649))
- `[Tree]` Fixed an issue that events are missing data on `addNodes` from a root node element. ([#1721](https://github.com/infor-design/enterprise-wc/issues/1721))
- `[Toolbar]` Fixed right aligned toolbar sections bug in firefox.  ([#1698](https://github.com/infor-design/enterprise-wc/issues/1698))

## 1.0.0-beta.17

### 1.0.0-beta.17 Breaking Changes

- `[Locale]` All locale data is now `json` not `js`, this may require you to re-copy the locale data if you made a copy of it. This removed the .js files from the bundles so they are truly dynamic now. ([#1596](https://github.com/infor-design/enterprise-wc/issues/1596))

### 1.0.0-beta.17 Features

- `[General]` Added an initial migration guide. ([#1561](https://github.com/infor-design/enterprise-wc/issues/1561))
- `[Locale]` Added `localeDataPath` to retrieve locale data from an alternate location to the default. ([#1622](https://github.com/infor-design/enterprise-wc/issues/1622))
- `[Tree]` Added `addNodes` method to dynamically add tree nodes. ([#1517](https://github.com/infor-design/enterprise-wc/issues/1517))
- `[Tree]` Added `beforeExpanded` async loading pattern to dynamically add tree children. ([#1516](https://github.com/infor-design/enterprise-wc/issues/1516))
- `[Tree]` Renamed `useToggleTarget` to `expandTarget`, now available as a setting to toggle tree nodes only when clicking the icon. ([#1528](https://github.com/infor-design/enterprise-wc/issues/1528))
- `[Tests]` Changed test framework to playwright. ([#1225](https://github.com/infor-design/enterprise-wc/issues/1225))
- `[ValidationMixin]` Added a `required` attribute that can be used separately from `validate="required"` simply to display a required indicator. ([#1553](https://github.com/infor-design/enterprise-wc/issues/1553))

### 1.0.0-beta.17 Fixes

- `[AxisChart]` Improved sizing behavior in a widget and improved responsive example. ([#1555](https://github.com/infor-design/enterprise-wc/issues/1555))
- `[Calendar]` Fix multiple `beforerendermonth` events. ([#1464](https://github.com/infor-design/enterprise-wc/issues/1464))
- `[Calendar]` Add `afterrendermonth` event to calendar and month view. ([#1465](https://github.com/infor-design/enterprise-wc/issues/1465))
- `[Calendar]` Add `disableSettings` property to calendar. ([#1471](https://github.com/infor-design/enterprise-wc/issues/1471))
- `[Calendar]` Fix cut off border for calendar event popup on small screens. ([#1544](https://github.com/infor-design/enterprise-wc/issues/1544))
- `[DataGrid]` Added `lookup` type to `IdsDataGridEditor` so that ids-lookup field can be used as editable datagrid cell. ([#1478](https://github.com/infor-design/enterprise-wc/issues/1478))
- `[DataGrid]` Fix setting `rtl` direction on component init. ([#1501](https://github.com/infor-design/enterprise-wc/issues/1501))
- `[DataGrid]` Make hyperlink cells clickable when `rowNavigation` is enabled. ([#1523](https://github.com/infor-design/enterprise-wc/issues/1523))
- `[DataGrid]` Fix virtual scrolling for tree grids. ([#1573](https://github.com/infor-design/enterprise-wc/issues/1573))/([#1587](https://github.com/infor-design/enterprise-wc/issues/1587))
- `[DataGrid]` Add `filterAlign` setting to columns for independently aligning filter row contents. ([#1575](https://github.com/infor-design/enterprise-wc/issues/1575))
- `[DataGrid]` Fix an issue where inline-editable cells in the first column were not considered when navigating the grid in edit mode with the Tab key. ([#1616](https://github.com/infor-design/enterprise-wc/issues/1616))
- `[DatePicker]` Set trigger field's value with today's date when today button is clicked. ([#1614](https://github.com/infor-design/enterprise-wc/issues/1614))
- `[DatePicker]` Fixed time picker value change is not reflected dynamically in date time picker trigger field. ([#1576](https://github.com/infor-design/enterprise-wc/issues/1576))
- `[FlexLayout]` Added a flex example using IdsButtons and IdsInputs. ([#1395](https://github.com/infor-design/enterprise-wc/issues/1395))
- `[Input]` Fixed input allowing to enter not number characters when mask is number. ([#1608](https://github.com/infor-design/enterprise-wc/issues/1608))
- `[Inputs]` Fixed removing `readonly` and `disabled` not working after form additions. ([#1570](https://github.com/infor-design/enterprise-wc/issues/1570))
- `[Inputs]` Fixed label setting for `ellipsis` which was not working. ([#1554](https://github.com/infor-design/enterprise-wc/issues/1554))
- `[Menu]` Add menu fixes for angular dynamic examples. ([#1641](https://github.com/infor-design/enterprise-wc/issues/1641))
- `[Modal]` Add `showCloseButton` setting to modal. ([#1527](https://github.com/infor-design/enterprise-wc/issues/1527))
- `[Modal]` Fix `fullsize` setting on init. ([#1525](https://github.com/infor-design/enterprise-wc/issues/1525))
- `[Modal]` Fix problems with slotting scrollable components and resize behavior. ([#1529](https://github.com/infor-design/enterprise-wc/issues/1529)/[#1530](https://github.com/infor-design/enterprise-wc/issues/1530))
- `[Modal]` Fix `showCloseButton` setting to default to top-right corner. ([#1647](https://github.com/infor-design/enterprise-wc/issues/1647))
- `[Module Nav]` Small improvements to better enable usage in an Angular codebase. ([#1597](https://github.com/infor-design/enterprise-wc/issues/1597))
- `[Multiselect]` Fix `rerender` logic so that state is maintained while using `ngFor` directive in Angular. ([#1411](https://github.com/infor-design/enterprise-wc/issues/1411))
- `[Pager]` Fix datagrid standalone pager html override. ([#1615](https://github.com/infor-design/enterprise-wc/issues/1615))
- `[PopupMenu]` Fix arrow icon direction in RTL. ([#1545](https://github.com/infor-design/enterprise-wc/issues/1545))
- `[Radio]` Fix incorrect focus state, remove colored radio buttons. ([#1568](https://github.com/infor-design/enterprise-wc/issues/1568))
- `[Tabs]` Sync component with Figma design changes related to Alabaster default theme. ([#1050](https://github.com/infor-design/enterprise-wc/issues/1050))
- `[Text]` Fixed wrong status warning color. ([#1619](https://github.com/infor-design/enterprise-wc/issues/1619))
- `[Textarea]` Made sure strings are translated and fixed `character-count`` setting. ([#1598](https://github.com/infor-design/enterprise-wc/issues/1598))
- `[Tooltip]` Adds a check on the `tooltip` attribute to fix event handling in Angular environments. ([#1625](https://github.com/infor-design/enterprise-wc/issues/1625))
- `[Trigger Field]` Fixed side by side example. ([#1586](https://github.com/infor-design/enterprise-wc/issues/1586))

## 1.0.0-beta.16

### 1.0.0-beta.16 Breaking Changes

- `[Checkbox/Radio]` Removed the dirty tracker feature from checkbox and radio buttons. We want to limit how much the dirty indicator is used and the UI for these components just does not work. ([#1489](https://github.com/infor-design/enterprise-wc/issues/1489))

### 1.0.0-beta.16 Features

- `[AxisCharts]` Added a `ticks` setting to control the number of ticks on the y axis. ([#1494](https://github.com/infor-design/enterprise-wc/issues/1494))
- `[Module Nav]` Bring into feature parity with Soho (4.x) Module Nav ([#1518](https://github.com/infor-design/enterprise-wc/issues/1518))
- `[Module Nav]` Add mobile breakpoint responsive behavior ([#1536](https://github.com/infor-design/enterprise-wc/issues/1536))
- `[TextArea]` Added min/max width/height settings, integrating them with the `autogrow` and resizable settings. ([#1482](https://github.com/infor-design/enterprise-wc/issues/1482))
- `[Themes]` For theme switching added logic to check for a `<base href="">` tag. ([#1498](https://github.com/infor-design/enterprise-wc/issues/1498))

### 1.0.0-beta.16 Fixes

- `[AxisChart]` Fixed responsive axis charts `inherit` setting value. ([#1458](https://github.com/infor-design/enterprise-wc/issues/1458))
- `[Button]` Fixed an issue with padding when enterprise is loaded on the page. ([#1513](https://github.com/infor-design/enterprise-wc/issues/1513))
- `[Calendar]` Fixed calendar `firstDayOfWeek` setting. ([#1467](https://github.com/infor-design/enterprise-wc/issues/1467))
- `[Calendar]` Allow propagation of `dayselected` event from calendar. ([#1470](https://github.com/infor-design/enterprise-wc/issues/1470))
- `[Colors]` Updated neutral-10 to `#f5f5f5` to make it darker. ([#8067](https://github.com/infor-design/enterprise/pull/8067))
- `[DataGrid]` Added `wrap` attribute to `IdsMenuGroup` so large `contextmenu` menu-items can be wrapped into a column view. ([#1410](https://github.com/infor-design/enterprise-wc/issues/1410))
- `[DataGrid]` Fixed `contextmenu` focused menu item in datagrid. ([#1453](https://github.com/infor-design/enterprise-wc/issues/1453))
- `[DataGrid]` Add alignment rules and row-height specific padding to checkbox formatters. ([#1481](https://github.com/infor-design/enterprise-wc/issues/1481))
- `[DataGrid]` Fixed a bug on the size of the `xxs` filter row inputs. ([#1456](https://github.com/infor-design/enterprise-wc/issues/1456))
- `[DataGrid]` Fixed runtime- error on tree-grid when `IdsDataGrid.expandAll()` is executed. ([#1485](https://github.com/infor-design/enterprise-wc/issues/1485))
- `[DataGrid]` Improve/implement style for inline-editable data grid cells. ([#1229](https://github.com/infor-design/enterprise-wc/issues/1229))
- `[DataGrid]` Fixed runtime-error on tree-grid when `IdsDataGrid.expandAll()` is executed. ([#1485](https://github.com/infor-design/enterprise-wc/issues/1485))
- `[DataGrid]` Fixed blank rows on tree-grid after `IdsDataGrid.collapseAll()` is executed. ([#1486](https://github.com/infor-design/enterprise-wc/issues/1486))
- `[General]` Update side by side examples to latest enterprise version for bug fixes. ([#1549](https://github.com/infor-design/enterprise-wc/issues/1549))
- `[Input]` Fixed input elements (checkbox, radio-group, switch) so values are properly reflected in Angular Forms when using `ngModel` directive. ([#1505](https://github.com/infor-design/enterprise-wc/issues/1505))
- `[Icons]` Fixed how icon sizes are applied to correct a bug where icons in safari are the wrong size. ([#1519](https://github.com/infor-design/enterprise-wc/issues/1519))
- `[Message]` Fixed missing status icon in safari. ([#1541](https://github.com/infor-design/enterprise-wc/issues/1541))
- `[Modal]` Removed overflow constraint on modal content area to enable proper display of lists/popups attached to inner components. ([#1436](https://github.com/infor-design/enterprise-wc/issues/1436))
- `[Modal]` Changed the way z-index counting works to prevent a TypeScript/Angular compiler bug. ([#1476](https://github.com/infor-design/enterprise-wc/issues/1476))
- `[Pager]` Fix ability to set empty label to pager dropdowns. ([#1507](https://github.com/infor-design/enterprise-wc/issues/1507))
- `[Pager]` Added `pageSizes` setting to IdsPager. ([#1508](https://github.com/infor-design/enterprise-wc/issues/1508))
- `[Themes]` Fixed duplicate requests for theme files. ([#1491](https://github.com/infor-design/enterprise-wc/issues/1491))

## 1.0.0-beta.15

### 1.0.0-beta.15 Features

- `[AppNav]` Fixed an issue when loading in angular templates/router-outlets. ([#1428](https://github.com/infor-design/enterprise-wc/issues/1428))
- `[Calendar]` Fix hiding legend in mobile view. ([#1473](https://github.com/infor-design/enterprise-wc/issues/1473))
- `[Calendar]` Fix calendar dependency on ids container. ([#1359](https://github.com/infor-design/enterprise-wc/issues/1359))
- `[DataGrid]` Tree grid `appendData()` no longer breaks rendering of existing rows, and `scrollend` triggers properly. ([#1425](https://github.com/infor-design/enterprise-wc/issues/1425))
- `[DataGrid]` Prevent scroll when resize columns. ([#1209](https://github.com/infor-design/enterprise-wc/issues/1209))
- `[DataGrid]` Added new colored header and related styles. ([#1285](https://github.com/infor-design/enterprise-wc/issues/1285))
- `[DataGrid]` Fix virtual/infinite scroll when max rows in DOM reached. ([#1454](https://github.com/infor-design/enterprise-wc/issues/1454))
- `[DataGrid]` Fix rowStart scrollbar position on load. ([#1497](https://github.com/infor-design/enterprise-wc/issues/1497))
- `[Editor]` Added new toolbar styles in all themes. ([#7606](https://github.com/infor-design/enterprise-wc/issues/7606))
- `[Editor]` Fixed issue where buttons are disabled in source view. ([#1195](https://github.com/infor-design/enterprise-wc/issues/1195))
- `[Icons]` Fixes for new icons pipeline, new icons and cleanup. ([#518](https://github.com/infor-design/design-system/issues/518))
- `[Input]` Fixed input elements so values are properly reflected in Angular Reactive Forms. ([#1455](https://github.com/infor-design/enterprise-wc/issues/1455))
- `[ListView]` Added example to show that loading different dataset properly refreshes list-view and doesn't break custom events. ([#1352](https://github.com/infor-design/enterprise-wc/issues/1352))
- `[Locale]` Made Locale a global instance and moved it off ids-container and related fixes. ([#663](https://github.com/infor-design/enterprise-wc/issues/663))
- `[Message]` Fix modal button separator. ([#1414](https://github.com/infor-design/enterprise-wc/issues/1414))
- `[ModuleNav]` Added IdsModuleNav component with basic Role Switcher, Settings component. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[ModuleNav]` Add Dark/Contrast themes, app icons, tooltip support, and other features to IdsModuleNav. ([#1417](https://github.com/infor-design/enterprise-wc/issues/1414))
- `[NotificationBanner]` Added `wrap` setting for notification banner. ([#1435](https://github.com/infor-design/enterprise-wc/issues/1435))
- `[Personalization]` Added a personalization API and adjusted some components to work with it. ([#1394](https://github.com/infor-design/enterprise-wc/issues/1394))
- `[PopupMenu]` Add support for RTL. ([#1429](https://github.com/infor-design/enterprise-wc/issues/1429))
- `[Toolbar]` Added tooltip to the more button on toolbars. ([#1318](https://github.com/infor-design/enterprise-wc/issues/1318))

### 1.0.0-beta.15 Fixes

- `[DataGrid]` Fixed duplicate filter menus ([#1258](https://github.com/infor-design/enterprise-wc/issues/1258))
- `[DataGrid]` Fixed missing/incorrect event handling in some cases with built-in filter menus/pickers. ([#1291](https://github.com/infor-design/enterprise-wc/issues/1291))
- `[DataGrid]` Fixed incorrect placement of slotted filter menus/pickers. ([#1297](https://github.com/infor-design/enterprise-wc/issues/1297))
- `[DataGrid]` Added example that shows context-menu with option to activate cell edit-mode on right-click. ([#1319](https://github.com/infor-design/enterprise-wc/issues/1319))
- `[DataGrid]` Added example demonstrating `setActiveCell()` behavior under certain conditions. ([#1456](https://github.com/infor-design/enterprise-wc/issues/1456))

## 1.0.0-beta.14

### 1.0.0-beta.14 Features

- `[Accordion]` Add `IdsAccordionSection` component with flexbox properties, used primarily by Module Nav. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Box]` Added new Box component. ([#1327](https://github.com/infor-design/enterprise/issues/1327))
- `[Button]` Add `contentAlign` property for setting text/icon alignment. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Cards/Widget/Box]` Separated the card component into a box, widget and card component, features moved around in each. ([#1327](https://github.com/infor-design/enterprise/issues/1327))
- `[DataGrid]` Fix `scrollend` event triggering in different zoom levels. ([#1396](https://github.com/infor-design/enterprise/issues/1396))
- `[DataGrid]` Fixes scroll jumping in virtual/infinite scroll. ([#1390](https://github.com/infor-design/enterprise-wc/issues/1390))
- `[DataGrid]` Fix `scrollend` event triggering in different zoom levels. ([#1396](https://github.com/infor-design/enterprise-wc/issues/1396))
- `[DataGrid]` Added a `beforerowselected` and `beforeredeselected` event that can be vetoed to both lookup and datagrid. ([#1304](https://github.com/infor-design/enterprise-wc/issues/1304))
- `[DropDown/DropDownList]` Add `showListItemIcon` setting for Module Nav component. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Input]` Adds `module-nav` color variant. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Popup]` Adds `module-nav` type. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Stats]` Added new Stats component. ([#1326](https://github.com/infor-design/enterprise/issues/1326))
- `[Widget]` Added new Widget component. ([#1327](https://github.com/infor-design/enterprise/issues/1327))

### 1.0.0-beta.14 Fixes

- `[Button]` Fixed mismatch on secondary and primary button (internal) height. ([#1376](https://github.com/infor-design/enterprise/issues/1376))
- `[Card]` Fixed bug with placement of card footer. ([#1240](https://github.com/infor-design/enterprise-wc/issues/1240))
- `[Datagrid]` Removed the internal second parameter from the scrollRowIntoView so it cant be used. ([#1367](https://github.com/infor-design/enterprise-wc/issues/1367))
- `[DataGrid]` Added `uppercase` and `maxlength` settings to editors and filters (text only). ([#1309](https://github.com/infor-design/enterprise-wc/issues/1309))
- `[DataGrid]` Adds guards to Datagrid's `this.header` value because it is being referenced in some places before it is loaded in DOM. ([#1250](https://github.com/infor-design/enterprise-wc/issues/1250))
- `[DataGrid]` Adjusted header cell height for `xxs` row size. ([#1369](https://github.com/infor-design/enterprise-wc/issues/1369))
- `[DataGrid]` Add context menu shortcut for header and filters. ([#1340](https://github.com/infor-design/enterprise-wc/issues/1340))
- `[DataGrid]` Fixed child-level data props when using `expandable-row-template` option. ([#1266](https://github.com/infor-design/enterprise-wc/issues/1266))
- `[DataGrid]` Fixed an issue with the newer `maxlength` setting as it was not working in safari. ([#1403](https://github.com/infor-design/enterprise-wc/issues/1403))
- `[DataGrid]` Added `column.showHeaderExpander` setting to `IdsDataGridColumn`. ([#1360](https://github.com/infor-design/enterprise-wc/issues/1360))
- `[DataGrid]` Fixed tooltip callback/async-callback does not show tooltip for the header. ([#1311](https://github.com/infor-design/enterprise-wc/issues/1311))
- `[DataGrid]` Fixed cut-off Date/Time picker popups. ([#1298](https://github.com/infor-design/enterprise-wc/issues/1298))
- `[General]` Fixed issue with camel casing for HTML intellisense. ([#1385](https://github.com/infor-design/enterprise-wc/issues/1385))
- `[LayoutGrid]` Added breakpoint sizes for the flow attribute in the grid-layout. ([#1405](https://github.com/infor-design/enterprise-wc/issues/1405))
- `[ListView]` Added support for `ids-list-view-item` child component. ([#1042](https://github.com/infor-design/enterprise-wc/issues/1042))
- `[Multiselect]` Fixed margin-top on tags. ([#1349](https://github.com/infor-design/enterprise-wc/issues/1349))
- `[Radio]` Fix asterisk position on horizontal radio group with validation=required. ([#1363](https://github.com/infor-design/enterprise/issues/1363))
- `[Tabs]` Add alabaster changes to module tabs and header. ([#1339](https://github.com/infor-design/enterprise/issues/1339))
- `[ScrollView]` Fix scroll view to observe slot changes. ([#1372](https://github.com/infor-design/enterprise/issues/1372))
- `[Swaplist]` Refactor swaplist component to connect datasource to UI. ([#1313](https://github.com/infor-design/enterprise-wc/issues/1313))
- `[Wizard]` Fix wizard step click. ([#1221](https://github.com/infor-design/enterprise/issues/1221))

## 1.0.0-beta.13

### 1.0.0-beta.13 Fixes

- `[Build]` Added custom-elements schema data and visual code schema data for intellisense. ([#1010](https://github.com/infor-design/enterprise-wc/issues/1010))
- `[Button]` Fixed a bug on static width buttons. ([#1334](https://github.com/infor-design/enterprise-wc/issues/1334))
- `[Button]` Updated neutral colors from the design team. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
- `[Colors]` Added new neutral color palette with lower range colors. Some elements are updated. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
- `[DataGrid]` Fixed `scrollend` event firing. ([#1305](https://github.com/infor-design/enterprise-wc/issues/1305))
- `[DataGrid]` Add ability to refresh row/cell after updating dataset. ([#1303](https://github.com/infor-design/enterprise-wc/issues/1303))
- `[DataGrid]` Fixed keeping virtual scroll selected/deselected states. ([#1329](https://github.com/infor-design/enterprise-wc/issues/1329))
- `[DataGrid]` Fixed virtual scroll showing blank when scrolling fast. ([#1341](https://github.com/infor-design/enterprise-wc/issues/1341))
- `[DataGrid]` Fixed `scrollend` event firing. ([#1305](https://github.com/infor-design/enterprise-wc/issues/1305))
- `[DataGrid]` Prevent header filter activating editor cell. ([#1320](https://github.com/infor-design/enterprise-wc/issues/1320))
- `[DataGrid]` Add ability to multi select with shift key. ([#1330](https://github.com/infor-design/enterprise-wc/issues/1330))
- `[DataGrid]` Fix tree not selecting or collapsing all children in AngularJS. ([#1284](https://github.com/infor-design/enterprise-wc/issues/1284))
- `[DataGrid]` Fix tree collapse/expand state while sorting. ([#1284](https://github.com/infor-design/enterprise-wc/issues/1284))
- `[DataGrid]` Fixed a bug in the filter header where text selection in the inputs would cause accidental dragging. ([#1321](https://github.com/infor-design/enterprise-wc/issues/1321))
- `[Themes]` Added theme switcher to side-by-side examples and ability to switch 4.x themes in the `ids-theme-switcher `component. ([#939](https://github.com/infor-design/enterprise-wc/issues/939))
- `[Tooltip]` Changed the tooltip heights to match. ([#7509](https://github.com/infor-design/enterprise/issues/7509))

## 1.0.0-beta.12

### 1.0.0-beta.12 Fixes

- `[About]` Changed the icon to a non logo icon. ([#1331](https://github.com/infor-design/enterprise-wc/issues/1331))
- `[DataGrid]` Suppress extraneous `filtered` events when date-filter or time-filter used. ([#1248](https://github.com/infor-design/enterprise-wc/issues/1248))
- `[DataGrid]` Added support and example for filtering two digit years. ([#1247](https://github.com/infor-design/enterprise-wc/issues/1247))
- `[DataGrid]` Added calculation for left and right offset when dragging columns. ([#1241](https://github.com/infor-design/enterprise-wc/issues/1241))
- `[DataGrid]` Fixed RTL order / typing in RTL in filter mode with text align right. ([#1302](https://github.com/infor-design/enterprise-wc/issues/1302))
- `[DataGrid]` Add support for uppercase, disabled rows, collapse/expand all and `afterrendered` event. ([#1244](https://github.com/infor-design/enterprise-wc/issues/1244))
- `[DataGrid]` Added `xxs` row height for edge cases where you need a really crowded UI. ([#1199](https://github.com/infor-design/enterprise-wc/issues/1072))
- `[DataGrid]` Fixed `scrollRowIntoView()` row alignment. ([#1275](https://github.com/infor-design/enterprise-wc/issues/1275))
- `[DataGrid]` Fixed a bug in `rowStart` that made it not start on the right row in some cases. ([#1310](https://github.com/infor-design/enterprise-wc/issues/1310))
- `[DatePicker]` Added `showWeekNumbers()` setting and feature. ([#1296](https://github.com/infor-design/enterprise-wc/issues/1296))
- `[SearchField]` Added categories to search-field. ([#700](https://github.com/infor-design/enterprise-wc/issues/700))
- `[Themes]` Added the possibility to set the theme as a css file in link for more dynamic configuration. ([#1301](https://github.com/infor-design/enterprise-wc/issues/1301))

## 1.0.0-beta.11

### 1.0.0-beta.11 Fixes

- `[Build]` Fixed missing theme css files in the build and improved build logic. ([#294](https://github.com/infor-design/enterprise-wc/issues/294))

## 1.0.0-beta.10

### 1.0.0-beta.10 Fixes

- `[DataGrid]` Added rowStart setting to data grid. ([#1199](https://github.com/infor-design/enterprise-wc/issues/1199))
- `[DataGrid]` Fixed pressing enter on a column header filter input field was executing the column-s click callback for hyperlinks. ([#1228](https://github.com/infor-design/enterprise-wc/issues/1228))
- `[DataGrid]` Fixed an error where dragging something onto the data grid header filter inputs would give an error. ([#1276](https://github.com/infor-design/enterprise-wc/issues/1276))
- `[DataGrid]` Fixed an error where dragging something onto the data grid header filter would show the arrows as if a column was dragged and allow dropping text and arrow keys to work. ([#1242](https://github.com/infor-design/enterprise-wc/issues/1242))
- `[DatePicker]` Improved accessibility (A11Y) calendar was not properly accessible through screen reader. ([#1031](https://github.com/infor-design/enterprise-wc/issues/1031))
- `[DateUtils]` Fixed a `weekNumber()` bug that returned 0 value for all weeks. ([#1243](https://github.com/infor-design/enterprise-wc/issues/1243))
- `[Draggable]` Removed the `ids-` from the event names. ([#1328](https://github.com/infor-design/enterprise-wc/issues/1328))
- `[Icons]` Added new icons. ([#7510](https://github.com/infor-design/enterprise/issues/7510)
- `[Locale]` Added new translations. ([#7512](https://github.com/infor-design/enterprise/issues/7512)
- `[LayoutGrid]` Added support for max-width and centering. ([1308](https://github.com/infor-design/enterprise-wc/issues/1308))
- `[Themes]` Added theme support and css variables for all components. These can be used for customizing components and creating themes. See ([CUSTOMIZING.md](../doc/CUSTOMIZING.md)) for details. Note that with the `<ids-theme-switcher>` its now better to use the full theme name `<ids-theme-switcher theme="default-light">`. ([#1118](https://github.com/infor-design/enterprise-wc/issues/1118))
- `[Splitter]` Added new designs and minor fixes. ([#1328](https://github.com/infor-design/enterprise-wc/issues/1328))
- `[SwapList]` Refactored to use new icons. ([#7511](https://github.com/infor-design/enterprise/issues/7511)

## 1.0.0-beta.9

### 1.0.0-beta.9 Fixes

- `[Button]` Renamed "type" attribute to "appearance", mapped a new "type" attribute that sets HTMLButtonElement's "type" attribute. ([#1062](https://github.com/infor-design/enterprise-wc/issues/1062))
- `[ColorPicker]` Fix change event firing multiple times. ([#1181](https://github.com/infor-design/enterprise-wc/issues/1181))
- `[DataGrid]` Fixed text overflow for editable cells with data grid. ([#1175](https://github.com/infor-design/enterprise-wc/issues/1175))
- `[DataGrid]` Fix `IdsDataGrid.ScrollRowIntoView()` so that it finds correct row after infinite-scrolling. ([#1198](https://github.com/infor-design/enterprise-wc/issues/1198))
- `[Docs]` Added some documentation on ways to customize a component. ([#970](https://github.com/infor-design/enterprise-wc/issues/970))
- `[Dropdown]` Fixed unable to close the popup if selecting with the keyboard. ([#1236](https://github.com/infor-design/enterprise-wc/issues/1236))
- `[Input]` Added support for label wrap. ([#1223](https://github.com/infor-design/enterprise-wc/issues/1223))
- `[Input/TriggerField]` Web component now displays as `inline`, similar to HTMLInputElement. ([#1157](https://github.com/infor-design/enterprise-wc/issues/1157))
- `[LayoutGrid]` Added support for align items. ([#1223](https://github.com/infor-design/enterprise-wc/issues/1223))
- `[Popup]` Unset text align coming from HTML attribute. ([#1200](https://github.com/infor-design/enterprise-wc/issues/1200))
- `[PopupMenu]` Added scrollable behavior to `max-height`-enabled popup menus. ([#1205](https://github.com/infor-design/enterprise-wc/issues/1205))
- `[PopupMenu]` Added code to hide enterprise context menus when web context menus open and vise versa. ([#1179](https://github.com/infor-design/enterprise-wc/issues/1179))
- `[PopupMenu]` Fixed IdsPopupMenu doesn't move to the clicked location on right click. ([#1222](https://github.com/infor-design/enterprise-wc/issues/1222))
- `[ScrollView]` Fixed to remove hash links for navigation. ([#904](https://github.com/infor-design/enterprise-wc/issues/904))
- `[TimePicker]` Fixed formatting when day period goes first in the time format. ([#1189](https://github.com/infor-design/enterprise-wc/issues/1189))

## 1.0.0-beta.8

### 1.0.0-beta.8 Fixes

- `[Button/Input/Dropdown]` Added ability to show loading indicator. ([#1048](https://github.com/infor-design/enterprise-wc/issues/1048))
- `[Card/Widget]` Added borderless setting for card/widget. ([#1169](https://github.com/infor-design/enterprise-wc/issues/1169))
- `[Datagrid]` Added feature to export data grid to excel xlsx or csv file. ([#153](https://github.com/infor-design/enterprise-wc/issues/153))
- `[DataGrid]` Added support for double click event. ([#1154](https://github.com/infor-design/enterprise-wc/issues/1154))
- `[Datagrid]` Fixed event-handling bug where `contextmenu` event listeners were never cleaned up, causing multiple selection events to occur. ([#1174](https://github.com/infor-design/enterprise-wc/issues/1174))
- `[Datagrid/Dropdown]` Separated IdsDropdownList into its own component, re-integrated the new component into IdsDropdown, and fixed containment/cutoff issues in IdsDataGrid using the new list component. ([#1065](https://github.com/infor-design/enterprise-wc/issues/1065))
- `[Data Source]` Changed the default sort function to behave more like Excel, sorting separately numbers, strings, and empty space. ([#1158](https://github.com/infor-design/enterprise-wc/issues/1158))
- `[Datagrid]` Fixed broken validation styling in editable cells. ([#1171](https://github.com/infor-design/enterprise-wc/issues/1171))
- `[DatePicker]` Fixed broken date parsing in different locales. ([#1114](https://github.com/infor-design/enterprise-wc/issues/1114))
- `[Dropdown]` Added functionality to select an option by keyboard input. ([#1144](https://github.com/infor-design/enterprise-wc/issues/1144))
- `[ListBuilder]` Fixed drag to first row, drag multi select items, toolbar styles, added support to drag while in edit mode, and added support to custom toolbar. ([#926](https://github.com/infor-design/enterprise-wc/issues/926))
- `[ListView]` Added support for search to filter list. ([#763](https://github.com/infor-design/enterprise-wc/issues/763)
- `[Menu/Popup Menu]` Added Shortcut Key display feature to IdsMenuItem. ([#1108](https://github.com/infor-design/enterprise-wc/issues/1108))

## 1.0.0-beta.7

### 1.0.0-beta.7 Fixes

- `[Alert]` Added the ability to use any icon and set any alert color on the alerts. ([#1138](https://github.com/infor-design/enterprise-wc/issues/1138))
- `[Badge]` Fixed uneven shape on badge icons. ([#1014](https://github.com/infor-design/enterprise-wc/issues/1014))
- `[Build]` Updated `esbuild` to fix issues with import order. ([#1140](https://github.com/infor-design/enterprise-wc/issues/1140))
- `[Calendar]` Added a `beforeeventrendered` and `aftereventrendered` event. ([#1131](https://github.com/infor-design/enterprise-wc/issues/1131))
- `[Checkbox]` Fixed required indicator was not placed correctly when RTL. ([#1111](https://github.com/infor-design/enterprise-wc/issues/1111)
- `[DataGrid]` Fixed dynamic left top alignment, removed arrow and improved api for context menu. ([#1110](https://github.com/infor-design/enterprise-wc/issues/1110))
- `[DataGrid]` Improved the event support for context menu. ([#1113](https://github.com/infor-design/enterprise-wc/issues/1113))
- `[DataGrid]` Fixed overflow to display all items with context menu. ([#1119](https://github.com/infor-design/enterprise-wc/issues/1119))
- `[DataGrid]` Add events for `scrollstart` and `scrollend`. ([#1102](https://github.com/infor-design/enterprise-wc/issues/1102))
- `[DataGrid]` Fixed tooltip to show without text overflow. ([#1126](https://github.com/infor-design/enterprise-wc/issues/1126)
- `[DataGrid]` Placed the empty message at the center of the component. ([#1100](https://github.com/infor-design/enterprise-wc/issues/1100))
- `[DataGrid/TimePicker]` IdsDataGrid now uses the IdsTimePickerPopup component inside Time-based filters. ([#1064](https://github.com/infor-design/enterprise-wc/issues/1064))
- `[Icons]` Changed the way custom icons work so they can be used only at one time and from a file. ([#1122](https://github.com/infor-design/enterprise-wc/issues/1122))
- `[Icons]` Clean up examples for icons. ([#509](https://github.com/infor-design/enterprise-wc/issues/509))
- `[Icons]` Changed the way custom icons work so they can be used only at one time and from a file. ([#1122](https://github.com/infor-design/enterprise-wc/issues/1122))
- `[Icons]` Clean up examples for icons. ([#509](https://github.com/infor-design/enterprise-wc/issues/509))
- `[Locale]` Locale information files and messages are now separate from the build. They must be served as assets from the `node_modules/ids-enterprise-wc/locale-data` folder. ([#1107](https://github.com/infor-design/enterprise-wc/issues/1107))
- `[Month View]` Added a `beforeeventrendered` and `aftereventrendered` event. ([#1131](https://github.com/infor-design/enterprise-wc/issues/1131))
- `[PieChart]` Fixed tooltip arrow was not aligning the first time. ([#836](https://github.com/infor-design/enterprise-wc/issues/836))
- `[Text]` Fixed CSP style violation. ([#1152](https://github.com/infor-design/enterprise-wc/issues/1152))
- `[ThemeSwitcher]` Added ability to hide the theme switcher and still use it. ([#1136](https://github.com/infor-design/enterprise-wc/issues/1136))
- `[Trigger Field]` Fixed trigger field buttons padding. ([#1091](https://github.com/infor-design/enterprise-wc/issues/1091))
- `[Week View]` Changed `...render` to `...rendered` in the event name to match other components. ([#1131](https://github.com/infor-design/enterprise-wc/issues/1131))
- `[Week View]` Added a `beforeeventrendered` and `aftereventrendered` event. ([#1131](https://github.com/infor-design/enterprise-wc/issues/1131))

## 1.0.0-beta.6

### 1.0.0-beta.6 Fixes

- `[DataGrid]` Added more cell-formatters. ([#1021](https://github.com/infor-design/enterprise-wc/issues/1021))
- `[Build]` Fixed tsc errors running the build commands `npm run build:dist`. ([#1059](https://github.com/infor-design/enterprise-wc/issues/1059))
- `[Build]` Fixed errors using `new IdsComponentName()` when imported from the npm package. ([#971](https://github.com/infor-design/enterprise-wc/issues/971))
- `[Build]` All scripts in the npm package are now ES Modules and use lazy loading to reduce size and payload. Scripts must be imports as ES modules script `type="module"` ([#814](https://github.com/infor-design/enterprise-wc/issues/814))
- `[Build]` Npm package reduced in size from approximately 84 MB to 19 MB (Dev Version from 275 MB to 47 MB). ([#814](https://github.com/infor-design/enterprise-wc/issues/814))
- `[Build]` Beta 4-6 dropped due to mistake in package.json in test deploys ([#814](https://github.com/infor-design/enterprise-wc/issues/814))
- `[General]` Fixed to angular examples where attributes property binding was not work properly for ids-toggle-button, ids-app-menu, ids-menu-button, ids-pager, ids-text, ids-toolbar. ([#941](https://github.com/infor-design/enterprise-wc/issues/941))
- `[DataGrid]` Added an addition to the `ids-data-grid/tree-grid-custom-css.html` example to show a link in the tree expander cell. This required a change to the structure of the `click` callback so that the event data can be used to view the target element. The types did not match the function signature. ([#1076](https://github.com/infor-design/enterprise-wc/issues/1076))

## 1.0.0-beta.3

### 1.0.0-beta.3 Fixes

- `[DataGrid]` Added row-recycling pattern and caching to improve virtual-scroll performance. ([#972](https://github.com/infor-design/enterprise-wc/issues/972))
- `[DataGrid]` Fixed arrow-keys on virtual-scroll and added scrollRowIntoView() method. ([#929](https://github.com/infor-design/enterprise-wc/issues/929))
- `[General]` Fixed a list of issues in Safari browser. ([#956](https://github.com/infor-design/enterprise-wc/issues/956))
- `[About]` Chrome no longer shows minor version on the about info so this has been removed. ([#7067](https://github.com/infor-design/enterprise/issues/7067))
- `[AppMenu]` Updated main example to be consistent with 4.x. ([#852](https://github.com/infor-design/enterprise-wc/issues/852))
- `[BarChart]` Added support to flip horizontal. ([#963](https://github.com/infor-design/enterprise-wc/issues/893))
- `[Breadcrumb]` Fixed popup menu being cutoff in truncated example. ([#906](https://github.com/infor-design/enterprise-wc/issues/906))
- `[Button]` Removed named `text/icon` slots, re-worked the `iconAlign` setting to use only the default slot, and updated all examples/tests/docs to use only the default slot ([#839](https://github.com/infor-design/enterprise-wc/issues/839))
- `[Button]` Updated all button style variants to reflect new IDS designs. ([#1046](https://github.com/infor-design/enterprise-wc/issues/1046))
- `[Button/Tabs]` Added hide focus mixin. ([#1044](https://github.com/infor-design/enterprise-wc/issues/1044))
- `[Checkbox]` Fixed validate, dirty tracking and hitbox settings in Safari browser. ([#1013](https://github.com/infor-design/enterprise-wc/issues/1013))
- `[DataGrid]` Added support for empty message. ([#648](https://github.com/infor-design/enterprise-wc/issues/648))
- `[DataGrid]` Fixed some filter issues with datagrid. ([#932](https://github.com/infor-design/enterprise-wc/issues/932)
- `[Datagrid]` Prevented Date Picker Popup filter menus from being cut off by Data Grid's container overflow ([#667](https://github.com/infor-design/enterprise-wc/issues/667))
- `[DataGrid]` Added tree grid functionality. ([#737](https://github.com/infor-design/enterprise-wc/issues/737)
- `[DataGrid]` Added expandable row functionality. ([#737](https://github.com/infor-design/enterprise-wc/issues/737)
- `[DataGrid]` Fixed a bug that checkbox editors need to be clicked twice. ([#1095](https://github.com/infor-design/enterprise-wc/issues/1095)
- `[DataGrid]` Added suppress row click for selection functionality. ([#737](https://github.com/infor-design/enterprise-wc/issues/737)
- `[DataGrid]` Added support for context menu. ([#963](https://github.com/infor-design/enterprise-wc/issues/963))
- `[DataGrid]` Added support for editing. ([#991](https://github.com/infor-design/enterprise-wc/issues/991))
- `[DataGrid]` Added support for dropdown editing ([#1045](https://github.com/infor-design/enterprise-wc/issues/1045))
- `[DataGrid]` Added support for timepicker editing ([#1045](https://github.com/infor-design/enterprise-wc/issues/1045))
- `[DataGrid]` Added support for datepicker editing ([#1045](https://github.com/infor-design/enterprise-wc/issues/1045))
- `[DataGrid]` Added support to add multiple rows at given index ([#1045](https://github.com/infor-design/enterprise-wc/issues/1045))
- `[DataGrid]` Added `addNewAtEnd` setting ([#1045](https://github.com/infor-design/enterprise-wc/issues/1045))
- `[DataGrid]` Added `rowclick` and `rowdoubleclick` events. ([#994](https://github.com/infor-design/enterprise-wc/issues/994))
- `[DataGrid]` Added `ids-data-grid-cell`, `ids-data-grid-row` and `ids-data-grid-header` components and better code separation. ([#968](https://github.com/infor-design/enterprise-wc/issues/968))
- `[DataGrid]` Added support for save user settings. ([#992](https://github.com/infor-design/enterprise-wc/issues/992))
- `[DataGrid]` Added rowNavigation functionality. ([#993](https://github.com/infor-design/enterprise-wc/issues/993))
- `[DataGrid]` Added left and right padding (start and end) for row-heights. ([#996](https://github.com/infor-design/enterprise-wc/issues/996))
- `[DataGrid]` Fixed click function on columns is not firing when using the keyboard. ([#1005](https://github.com/infor-design/enterprise-wc/issues/1005))
- `[DataGrid]` Fixed a bug that when using disableClientFilter does not emit filtered event when empty. ([#1008](https://github.com/infor-design/enterprise-wc/issues/1008))
- `[DataGrid]` Fixed a bug that tree/expanded formatters could not be extended as the tree would not expand. ([#1018](https://github.com/infor-design/enterprise-wc/issues/1018))
- `[DataGrid]` Fixed bug where filtered event fired when calling setFilterCondition() ([#1006](https://github.com/infor-design/enterprise-wc/issues/1006))
- `[DataGrid]` Fixed placement of empty message was not centered horizontally. ([#1061](https://github.com/infor-design/enterprise-wc/issues/1061))
- `[DataGrid]` Added support for shift click selection. ([#1073](https://github.com/infor-design/enterprise-wc/issues/1073))
- `[DataGrid]` Fixed checkbox toggles value when clicking a row in editable datagrid ([#1105](https://github.com/infor-design/enterprise-wc/issues/1105))
- `[DatePicker]` Separated the "picker" portion of IdsDatePicker into its own component, allowing separate usage by other components. ([#958](https://github.com/infor-design/enterprise-wc/issues/958))
- `[DatePicker/MonthView]` Fixed a circular dependency issue between Date Pickers and Month Views. ([#959](https://github.com/infor-design/enterprise-wc/issues/959))
- `[DatePicker]` Fixed validation date error message in Safari browser. ([#1015](https://github.com/infor-design/enterprise-wc/issues/1015))
- `[Dropdown/Input]` Fixed dropdown menu is not the same size as its parent. ([#1078](https://github.com/infor-design/enterprise-wc/issues/1078))
- `[Hyperlink]` Added option to show styling when no href. ([#1075](https://github.com/infor-design/enterprise-wc/issues/1075))
- `[Icons]` All icons have padding on top and bottom effectively making them 4px smaller by design. This change may require some UI corrections to css. ([#6868](https://github.com/infor-design/enterprise/issues/6868))
- `[Icons]` Over 60 new icons and 126 new industry focused icons. ([#6868](https://github.com/infor-design/enterprise/issues/6868))
- `[Icons]` Added new empty state icons. ([#6934](https://github.com/infor-design/enterprise/issues/6934))
- `[Icons]` Added feature to add custom icons ([#990](https://github.com/infor-design/enterprise-wc/issues/990))
- `[ListView]` Fixed a bug where the component is showing errors when changing data by activating an item ([#1036](https://github.com/infor-design/enterprise-wc/issues/1036))
- `[Lookup]` Fixed dirty tracking in Safari browser. ([#1017](https://github.com/infor-design/enterprise-wc/issues/1017))
- `[Multiselect]` Added ellipsis and tooltip to overflowed text. ([#924](https://github.com/infor-design/enterprise-wc/issues/924))
- `[Pager]` Fixed page size dropdown selected popup item. ([#1034](https://github.com/infor-design/enterprise-wc/issues/1034))
- `[ScrollView]` Fixed buttons do not update after being clicked. ([#951](https://github.com/infor-design/enterprise-wc/issues/951))
- `[TimePicker]` Separated the time picker popup into its own web component. ([#1063](https://github.com/infor-design/enterprise-wc/issues/1063))
- `[Wizard]` Fixed dark/contrast mode colors. ([#1007](https://github.com/infor-design/enterprise-wc/issues/1007))

## 1.0.0-beta.2

### 1.0.0-beta.2 Fixes

- `[General]` Removed IdsRenderLoop and replaced its usage with timeout functions, async/await, and CSS animations. ([#897](https://github.com/infor-design/enterprise-wc/issues/897))
- `[General]` Fixed and added types for components, mixins, and tests. ([#650](https://github.com/infor-design/enterprise-wc/issues/650))
- `[AppMenu]` Removed the logo from the app menu component by design request. ([#851](https://github.com/infor-design/enterprise-wc/pull/v))
- `[Autocomplete]` Fixed the popup position when autocomplete results changing. ([#908](https://github.com/infor-design/enterprise-wc/issues/908))
- `[BarChart]` Added support for grouped and fixed grid lines. ([#859](https://github.com/infor-design/enterprise-wc/issues/859))
- `[Calendar]` Added calendar event add/update/remove via modal/API feature to calendar. ([#757](https://github.com/infor-design/enterprise-wc/pull/795))
- `[Charts]` Added the ability to rotate x axis labels in axis charts like line and bar. ([#738](https://github.com/infor-design/enterprise-wc/pull/738))
- `[Colorpicker]` Fixed warning in the console when typing a color. ([#866](https://github.com/infor-design/enterprise-wc/issues/866))
- `[DataGrid]` Added support for tooltips and header icon. ([#896](https://github.com/infor-design/enterprise-wc/issues/896))
- `[DataGrid]` Added the ability to append nested data to the data grid. ([#862](https://github.com/infor-design/enterprise-wc/pull/862))
- `[DataGrid]` Escaped datagrid data to avoid xss issues. ([#899](https://github.com/infor-design/enterprise-wc/pull/899))
- `[DataGrid]` Fixed issues with virtual scroll and selection (including event data) and keyboard. ([#737](https://github.com/infor-design/enterprise-wc/pull/737))
- `[DataGrid]` Added checkbox and custom formatter. ([#737](https://github.com/infor-design/enterprise-wc/pull/737))
- `[DataGrid]` Changed alternate row shading feature's color theming to behave similarly to the 4.x DataGrid's. ([#925](https://github.com/infor-design/enterprise-wc/issues/925))
- `[Datagrid]` Prevented filter menus from being cut off by Data Grid's container overflow ([#667](https://github.com/infor-design/enterprise-wc/issues/667))
- `[Editor]` Fixed not readable text in the toolbar in Safari browser. ([#922](https://github.com/infor-design/enterprise-wc/issues/922))
- `[Form]` Added new 'IdsForm' component. ([#357](https://github.com/infor-design/enterprise-wc/pull/357))
- `[Form]` Fixed compact mode was not working with all components. ([#863](https://github.com/infor-design/enterprise-wc/issues/863))
- `[Hierarchy]` Fixed hierarchy card submenus open in the wrong place. ([#832](https://github.com/infor-design/enterprise-wc/issues/832))
- `[Input]` Fixed show/hide button for Safari browser. ([#923](https://github.com/infor-design/enterprise-wc/issues/923))
- `[Input]` Fixed time validation. ([#805](https://github.com/infor-design/enterprise-wc/issues/805))
- `[Lookup]` Fixed the dirty tacker was not able to reset. ([#871](https://github.com/infor-design/enterprise-wc/issues/871))
- `[Pager]` Fixed the direction of the icons in RTL mode. ([#865](https://github.com/infor-design/enterprise-wc/issues/865))
- `[Popup]` Added ability to place the popup at any side of the align target ([#748](https://github.com/infor-design/enterprise-wc/issues/748))
- `[PopupMenu]` Fixed a problem where nested Popup Menus would sometimes be impossible to open. ([#930](https://github.com/infor-design/enterprise-wc/issues/930))
- `[Tabs]` Fixed styling for draggable tabs. ([#842](https://github.com/infor-design/enterprise-wc/issues/842))

## 1.0.0-beta.1

### 1.0.0-beta.1 Fixes

- `[General]` Many components have been changed to use `IdsLabelStateMixin` or `IdsLabelStateParentMixin` for setting label attributes. ([#637](https://github.com/infor-design/enterprise-wc/issues/637))
- `[ActionSheet]` Updated `btnText` to `cancelBtnText` and fixed the setter update to update the DOM text when called (which was not working). ([#505](https://github.com/infor-design/enterprise-wc/pull/505))
- `[About]` Fixed scrolling issue with pointer event and adjusted text to screen size. ([#701](https://github.com/infor-design/enterprise-wc/pull/701))
- `[ActionPanel]` Renamed `Contextual Action Panel` to `Action Panel`. ([#774](https://github.com/infor-design/enterprise-wc/pull/774))
- `[AppMenu]` Fixed the footer by creating two examples for the app menu, one only including the Infor logo and the other only including the toolbar options. ([#776](https://github.com/infor-design/enterprise-wc/pull/776))
- `[AxisChart]` Add support for axis labels all around bottom, end, start, top. ([#738](https://github.com/infor-design/enterprise-wc/issues/738))
- `[Breadcrumb]` Fixed a styling with the focus state and incorrect colors. ([#777](https://github.com/infor-design/enterprise-wc/pull/788))
- `[Card]` Fixed the `height` setting which was not working. ([#788](https://github.com/infor-design/enterprise-wc/pull/788))
- `[DatePicker]` Updated event path for clicking event and ensured appropriate date input for Range - Min(N) Days. ([#780](https://github.com/infor-design/enterprise-wc/pull/780))
- `[DatePicker]` Fixed keyboard events to accommodate to Firefox browser (which was not working). ([#779](https://github.com/infor-design/enterprise-wc/issues/779))
- `[DatePicker]` Fixed frozen page when "Enter" or "Shift" key is pressed when selecting month and year. ([#778](https://github.com/infor-design/enterprise-wc/issues/778))
- `[ListBuilder]` Fixed focus state after dragging item(s). ([#753](https://github.com/infor-design/enterprise-wc/issues/753))
- `[General]` Fixed the initialization lifecycle of all components. ([#789](https://github.com/infor-design/enterprise-wc/issues/789))
- `[PieChart]` Improved the tooltip placement logic and some cleanup. ([#736](https://github.com/infor-design/enterprise-wc/issues/736))
- `[PopupMenu]` Added `triggerElem` property for separating the element triggering a Popup from the element in which the Popup aligns against.  ([#769](https://github.com/infor-design/enterprise-wc/issues/769))
- `[Lookup]` Added new features showing paging, clearable, filtering and more test coverage and docs.  ([#686](https://github.com/infor-design/enterprise-wc/issues/686))
- `[Radio]` Fixed incorrect colors in contrast mode. ([#775](https://github.com/infor-design/enterprise-wc/pull/775))
- `[Splitter]` Added support for save position to local storage. ([#692](https://github.com/infor-design/enterprise-wc/issues/692))
- `[Tag]` Updated `x` and `>` icon color on colored tags when dismissible/clickable is true.([#848](https://github.com/infor-design/enterprise-wc/pull/848))
- `[Textarea]` Updated `start` and `end` for when text alignment is defined (not default).([#873](https://github.com/infor-design/enterprise-wc/pull/873))

## 1.0.0-beta.0

### 1.0.0-beta.0 Breaking Changes

All components in this version are now web components compared to 4.x. Each component can now be imported as a single JS file and used with encapsulated styles.
For more details on breaking changes see each component in the individual README.md files.

- `[Colorpicker]` The colorpicker component was bug fixed and enhanced to include features found in legacy codebase. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-color-picker/README.md) for details. ([#551](https://github.com/infor-design/enterprise-wc/issues/551))
- `[About]` The about component was converted. See the [README](https://github.com/infor-design/enterprise-wc/blob/todo-passthrough/src/components/ids-about/README.md#converting-from-previous-versions-breaking-changes) for details. ([#308](https://github.com/infor-design/enterprise-wc/issues/308))
- `[Accordion]` The accordion component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-accordion//README.md##converting-from-previous-versions) for details. ([#168](https://github.com/infor-design/enterprise-wc/issues/168))
- `[ActionSheet]` The action sheet component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-action-sheet/README.md#converting-from-previous-versions) for details. ([#348](https://github.com/infor-design/enterprise-wc/issues/348))
- `[Alert]` The alert component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-alert/README.md#converting-from-previous-versions) for details. ([#348](https://github.com/infor-design/enterprise-wc/issues/348))
- `[App Menu]` The app menu component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-app-menu/README.md#converting-from-previous-versions) for details. ([#130](https://github.com/infor-design/enterprise-wc/issues/130))
- `[AreaChart]` The Area Chart component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/blob/todo-passthrough/src/components/ids-area-chart/README.md#converting-from-previous-versions-breaking-changes)` for details. ([#400](https://github.com/infor-design/enterprise-wc/issues/400))
- `[Badge]` The badge component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-badge/README.md#converting-from-previous-versions) for details. ([#41](https://github.com/infor-design/enterprise-wc/issues/41))
- `[BarChart]` The bar Chart component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/blob/todo-passthrough/src/components/ids-bar-chart/README.md#converting-from-previous-versions-breaking-changes)` for details. ([#400](https://github.com/infor-design/enterprise-wc/issues/400))
- `[BlockGrid]` The block-grid component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-block-grid/README.md#converting-from-previous-versions) for details. ([#159](https://github.com/infor-design/enterprise-wc/issues/159))
- `[Breadcrumb]` The breadcrumb component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-bread-crumb/README.md#converting-from-previous-versions) for details. ([#137](https://github.com/infor-design/enterprise-wc/issues/137))
- `[Button]` The button component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-button/README.md#converting-from-previous-versions) for details. ([#173](https://github.com/infor-design/enterprise-wc/issues/173))
- `[Card]` The card component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-card/README.md#converting-from-previous-versions) for details. ([#419](https://github.com/infor-design/enterprise-wc/issues/419))
- `[Checkbox]` The checkbox component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-checkbox/README.md#converting-from-previous-versions for details. ([#164](https://github.com/infor-design/enterprise-wc/issues/164))
- `[Circle Pager]` The circle pager component has been renamed to [`IdsScrollView`](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-scroll-view/README.md)
- `[Colorpicker]` The card component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-color-picker/README.md#converting-from-previous-versions for details. ([#223](https://github.com/infor-design/enterprise-wc/issues/223))
- `[IdsContainer]` Added a new component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-containerr/README.md) for details.
- `[Action Panel / Contextual Action Panel]` The contextual action panel component was converted to a web component and renamed to Action Panel. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-contextual-action-panel/README.md#converting-from-previous-versions for details. ([#330](https://github.com/infor-design/enterprise-wc/issues/330))
- `[Counts]` The counts component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-counts/README.md#converting-from-previous-versions for details. ([#330](https://github.com/infor-design/enterprise-wc/issues/123))
- `[Datepicker]` The date picker component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-date-picker/README.md#converting-from-previous-versions for details. ([#330](https://github.com/infor-design/enterprise-wc/issues/183))
- `[Draggable]` The drag component is now a web component called `ids-draggable`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-draggable/README.md#converting-from-previous-versions for details. ([#253](https://github.com/infor-design/enterprise-wc/issues/253))
- `[Dropdown]` The dropdown component is now a web component called `ids-dropdown`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-dropdown/README.md#converting-from-previous-versions for details. ([#132](https://github.com/infor-design/enterprise-wc/issues/132))
- `[Editor]` The Editor component is now a web component called `ids-editor`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-editor/README.md#converting-from-previous-versions for details. ([#350](https://github.com/infor-design/enterprise-wc/issues/350))
- `[EmptyMessage]` The EmptyMessage component is now a web component called `ids-empty-message`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-empty-message`/README.md#converting-from-previous-versions for details. ([#281](https://github.com/infor-design/enterprise-wc/issues/281))
- `[ErrorPage]` The ErrorPage component is now a web component called `ids-error-page`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-error-page/README.md#converting-from-previous-versions for details. ([#352](https://github.com/infor-design/enterprise-wc/issues/352))
- `[ExpandableArea]` The Fieldset component is now a web component called `ids-expandable-area`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-expandable-area/README.md#converting-from-previous-versions for details. ([#168](https://github.com/infor-design/enterprise-wc/issues/168))
- `[Fieldset]` The Fieldset component is now a web component called `ids-fieldset`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-fieldset/README.md#converting-from-previous-versions for details. ([#138](https://github.com/infor-design/enterprise-wc/issues/138))
- `[Header]` The Header component is now a web component called `ids-header`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-header/README.md#converting-from-previous-versions for details. ([#134](https://github.com/infor-design/enterprise-wc/issues/134))
- `[Hidden/Visibility]` The visibility classes are now a web component called `ids-hidden`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-hidden/README.md#converting-from-previous-versions for details. ([#405](https://github.com/infor-design/enterprise-wc/issues/405))
- `[Hierarchy]` The Hierarchy component is now a web component called `ids-hierarchy`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-hierarchy/README.md#converting-from-previous-versions for details. ([#331](https://github.com/infor-design/enterprise-wc/issues/331))
- `[HomePage]` The HomePage component is now a web component called `ids-home-page`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-home-page/README.md#converting-from-previous-versions for details. ([#313](https://github.com/infor-design/enterprise-wc/issues/313))
- `[Hyperlink]` The Hyperlink component is now a web component called `ids-hyperlink`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-hyperlink/README.md#converting-from-previous-versions for details. ([#137](https://github.com/infor-design/enterprise-wc/issues/137))
- `[Icons]` The icon component is now a web component called `ids-icon`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-icon/README.md#converting-from-previous-versions for details. ([#581](https://github.com/infor-design/enterprise-wc/issues/581))
- `[Image]` The image css component is now a web component called `ids-image`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-image/README.md#converting-from-previous-versions for details. ([#360](https://github.com/infor-design/enterprise-wc/issues/360))
- `[Input]` The Input component is now a web component called `ids-input`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-image/README.md#converting-from-previous-versions for details. ([#171](https://github.com/infor-design/enterprise-wc/issues/171))
- `[LayoutGrid]` The Grid component is now a web component called `ids-layout-grid`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-layout-grid/README.md#converting-from-previous-versions for details. ([#180](https://github.com/infor-design/enterprise-wc/issues/180))
- `[LineChart]` The Line Chart component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/blob/todo-passthrough/src/components/ids-line-chart/README.md#converting-from-previous-versions-breaking-changes)` for details. ([#400](https://github.com/infor-design/enterprise-wc/issues/400))
- `[ListBuilder]` The List Builder component is now a web component called `ids-list-builder`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-list-builder/README.md#converting-from-previous-versions for details. ([#365](https://github.com/infor-design/enterprise-wc/issues/365))
- `[ListView]` The List View component is now a web component called `ids-list-view`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-list-view/README.md#converting-from-previous-versions for details. ([#174](https://github.com/infor-design/enterprise-wc/issues/174))
- `[LoadingIndicator]` The busy indicator component is now a web component called `ids-loading-indicator`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-loading-indicator/README.md#converting-from-previous-versions for details. ([#187](https://github.com/infor-design/enterprise-wc/issues/187))
- `[Locale]` The locale component has been changed to a mixin and added to many but not all components. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-locale/README.md#converting-from-previous-versions for details. ([#121](https://github.com/infor-design/enterprise-wc/issues/121))
- `[Mask]` The mask component has been changed to a mixin and added to IdsInput components. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-mask/README.md#converting-from-previous-versions-breaking-changes) for details. ([#125](https://github.com/infor-design/enterprise-wc/issues/125))
- `[Menu Button]` The menu button component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-menu-button/README.md#converting-from-previous-versions-breaking-changes) for details. ([#173](https://github.com/infor-design/enterprise-wc/issues/173))
- `[Lookup]` The Lookup component is now a web component called `ids-lookup`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-lookup/README.md#converting-from-previous-versions for details. ([#149](https://github.com/infor-design/enterprise-wc/issues/149))
- `[Masthead]` The masthead component is now a web component called `ids-masthead`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-masthead/README.md#converting-from-previous-versions for details. ([#362](https://github.com/infor-design/enterprise-wc/issues/362))
- `[Menu]` The menu component was converted to a web component called `ids-menu`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-menu/README.md#converting-from-previous-versions for details. ([#170](https://github.com/infor-design/enterprise-wc/issues/170))
- `[Menu Button]` The menu button component was converted to a web component called `ids-menu-button`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-menu-button/README.md#converting-from-previous-versions for details. ([#173](https://github.com/infor-design/enterprise-wc/issues/173))
- `[Message]` The Message is now a web component called ids-message. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-message/README.md#converting-from-previous-versions-breaking-changes) for details. ([#118](https://github.com/infor-design/enterprise-wc/issues/118))
- `[Modal]` The Modal component has been converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-modal/README.md#converting-from-previous-versions-breaking-changes) for details. ([#118](https://github.com/infor-design/enterprise-wc/issues/118))
- `[Modal Button]` A new component was created for standalone Modal buttons, extending IdsButton. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-modal-button/README.md#converting-from-previous-versions-breaking-changes) for details. ([#118](https://github.com/infor-design/enterprise-wc/issues/118))
- `[MonthView]` The Monthview is now a web component called ids-monthview. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-monthview/README.md#converting-from-previous-versions-breaking-changes) for details. ([#444](https://github.com/infor-design/enterprise-wc/issues/444))
- `[Multiselect]` Multiselect is now a web component called ids-multiselect. see the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-multiselect/README) for details. ([#363](https://github.com/infor-design/enterprise-wc/issues/363))
- `[NotificationBanner]` The Notification component is now a web component called ids-notification-banner. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-notification-banner/README.md#converting-from-previous-versions-breaking-changes) for details. ([#229](https://github.com/infor-design/enterprise-wc/issues/229))
- `[Pager]` The Pager component is now a web component called ids-pager. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-pager/README.md#converting-from-previous-versions-breaking-changes) for details. ([#148](https://github.com/
- `[PieChart]` The Pie Chart component was converted to a web component. See the [README](https://github.com/infor-design/enterprise-wc/blob/todo-passthrough/src/components/ids-pie-chart/README.md#converting-from-previous-versions-breaking-changes)` for details. ([#400](https://github.com/infor-design/enterprise-wc/issues/400))
- `[Place]` The Place component has been replaced by [IdsPopup](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-popup/README.md#converting-from-previous-versions-breaking-changes).
- `[Popup]` Added a new Popup component that serves as a base element for absolute/fixed-position elements. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-popup/README.md#converting-from-previous-versions-breaking-changes) for details. ([#139](https://github.com/infor-design/enterprise-wc/issues/139))
- `[Popup Menu]` The Popup Menu has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-popup-menu/README.md#converting-from-previous-versions-breaking-changes) for details. ([#170](https://github.com/infor-design/enterprise-wc/issues/170))
- `[Process Indicator]` The Process Indicator component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-process-indicator/README.md#converting-from-previous-versions-breaking-changes) for details. ([#333](https://github.com/infor-design/enterprise-wc/issues/333))
- `[Progress (Bar)]` The Progress component has been changed to a web component and renamed to `ids-progress-bar`. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-progress-bar/README.md#converting-from-previous-versions-breaking-changes) for details. ([#187](https://github.com/infor-design/enterprise-wc/issues/187))
- `[Progress (Chart)]` A new component that combines various similar chart types (Completion, Targeted Achievement, etc) has been added. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-progress-chart/README.md#converting-from-previous-versions-breaking-changes) for details. ([#268](https://github.com/infor-design/enterprise-wc/issues/268))
- `[Radio]` The Radio component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-radio/README.md#converting-from-previous-versions-breaking-changes) for details. ([#169](https://github.com/infor-design/enterprise-wc/issues/169))
- `[Rating]` The Rating component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-rating/README.md#converting-from-previous-versions-breaking-changes) for details. ([#119](https://github.com/infor-design/enterprise-wc/issues/119))
- `[RenderLoop]` The RenderLoop component has been implemented as a mixin. ([#172](https://github.com/infor-design/enterprise-wc/issues/172))
- `[ScrollView]` A new component that replaces Circle Pager from the previous version and adds touch gestures like swiping. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-scroll-view/README.md#converting-from-previous-versions-breaking-changes) for details. ([#199](https://github.com/infor-design/enterprise-wc/issues/199))
- `[Search Field]` The Search Field component has been converted.  See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-search-field/README.md#converting-from-previous-versions-breaking-changes) for details. ([#314](https://github.com/infor-design/enterprise-wc/issues/314))
- `[Separator]` A new component was created for use in IdsToolbar and IdsMenu to visually separate content. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-separator/README.md#converting-from-previous-versions-breaking-changes) for details. *(N/A)*
- `[Skip Link]` The Skip Link component has been converted.  See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-skip-link/README.md#converting-from-previous-versions-breaking-changes) for details. *(N/A)*
- `[Slider]` The Slider component has been converted.  See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-slider/README.md#converting-from-previous-versions-breaking-changes) for details. ([#304](https://github.com/infor-design/enterprise-wc/issues/304))
- `[Spinbox]` The Spinbox component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-spinbox/README.md#converting-from-previous-versions-breaking-changes) for details. ([#139](https://github.com/infor-design/enterprise-wc/issues/139))
- `[Splitter]` The Splitter component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-splitter/README.md#converting-from-previous-versions-breaking-changes) for details. ([#143](https://github.com/infor-design/enterprise-wc/issues/143))
- `[Step Chart]` The Step Chart has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-step-chart/README.md#converting-from-previous-versions-breaking-changes) for details. ([#273](https://github.com/infor-design/enterprise-wc/issues/273))
- `[SwapList]` The SwapList component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-swaplist/README.md#converting-from-previous-versions-breaking-changes) for details. ([#368](https://github.com/infor-design/enterprise-wc/issues/368))
- `[Swappable/Arange]` The Arrange component was converted to IdsSwappable. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-swappable/README.md#converting-from-previous-versions-breaking-changes) for details. ([#487](https://github.com/infor-design/enterprise-wc/issues/487))
- `[Swipe Action]` A new component that lets you swipe left or right and select an action. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-swipe-action/README.md) for details. ([#133](https://github.com/infor-design/enterprise-wc/issues/133))
- `[Switch]` The Switch component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-switch/README.md#converting-from-previous-versions-breaking-changes) for details.([#169](https://github.com/infor-design/enterprise-wc/issues/169))
- `[Tabs]` The Tabs component has been converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-tabs/README.md#converting-from-previous-versions-breaking-changes) for details.([#120](https://github.com/infor-design/enterprise-wc/issues/120))
- `[Tags]` The Tag component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-tag/README.md#converting-from-previous-versions-breaking-changes) for details. *(N/A)*
- `[Targeted Achievement]` - The functionality of this chart has been rolled into [IdsProgressChart](../ids-progress-chart/README.md#converting-from-previous-versions-breaking-changes).
- `[Textarea]` The Textarea component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-time-picker/README.md#converting-from-previous-versions-breaking-changes) for details. ([#162](https://github.com/infor-design/enterprise-wc/issues/162))
- `[Time Picker]` The Time Picker component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-time-picker/README.md#converting-from-previous-versions-breaking-changes) for details. ([#151](https://github.com/infor-design/enterprise-wc/issues/151))
- `[Toast]` The Toast component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-toast/README.md#converting-from-previous-versions-breaking-changes) for details. ([#129](https://github.com/infor-design/enterprise-wc/issues/129))
- `[Toolbar]` The Toolbar component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-toolbar/README.md#converting-from-previous-versions-breaking-changes) for details. ([#163](https://github.com/infor-design/enterprise-wc/issues/163))
- `[Tooltip]` The Tooltip component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-tooltip/README.md#converting-from-previous-versions-breaking-changes) for details. ([#124](https://github.com/infor-design/enterprise-wc/issues/124))
- `[Tree]` The Tree component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-treemap/README.md#converting-from-previous-versions-breaking-changes) for details. ([#235](https://github.com/infor-design/enterprise-wc/issues/235))
- `[Treemap]` The Treemap component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-treemap/README.md#converting-from-previous-versions-breaking-changes) for details. ([#369](https://github.com/infor-design/enterprise-wc/issues/369))
- `[Trigger Field]` A new trigger field component has been added. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-trigger-field/README.md) for details. ([#178](https://github.com/infor-design/enterprise-wc/issues/178))
- `[Upload]` The file upload component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-upload/README.md#converting-from-previous-versions-breaking-changes) for details. ([#166](https://github.com/infor-design/enterprise-wc/issues/166))
- `[Upload Advanced]` The file upload advanced component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-upload-advanced/README.md#converting-from-previous-versions-breaking-changes) for details. ([#161](https://github.com/infor-design/enterprise-wc/issues/161))
- `[Week View]` The week view component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-week-view/README.md#converting-from-previous-versions-breaking-changes) for details. ([#371](https://github.com/infor-design/enterprise-wc/issues/371))
- `[Wizard]` The wizard component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-wizard/README.md#converting-from-previous-versions-breaking-changes) for details. ([#126](https://github.com/infor-design/enterprise-wc/issues/126))
