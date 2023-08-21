# What's New with Enterprise Web Components

## 1.0.0-beta.15

### 1.0.0-beta.15 Features

- `[DataGrid]` Prevent scroll when resize columns. ([#1209](https://github.com/infor-design/enterprise-wc/issues/1209))
- `[Editor]` Added new toolbar styles in all themes. ([#7606](https://github.com/infor-design/enterprise-wc/issues/7606))
- `[Editor]` Fixed issue where buttons are disabled in source view. ([#1195](https://github.com/infor-design/enterprise-wc/issues/1195))
- `[Message]` Fix modal button separator. ([#1414](https://github.com/infor-design/enterprise-wc/issues/1414))
- `[ModuleNav]` Added IdsModuleNav component with basic Role Switcher, Settings component. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Toolbar]` Added tooltip to the more button on toolbars. ([#1318](https://github.com/infor-design/enterprise-wc/issues/1318))

### 1.0.0-beta.15 Fixes

- `[DataGrid]` Added example that shows context-menu with option to activate cell edit-mode on right-click. ([#1319](https://github.com/infor-design/enterprise-wc/issues/1319))

## 1.0.0-beta.14

### 1.0.0-beta.14 Features

- `[Accordion]` Add `IdsAccordionSection` component with flexbox properties, used primarily by Module Nav. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Box]` Added new Box component. ([#1327](https://github.com/infor-design/enterprise/issues/1327))
- `[Button]` Add `contentAlign` property for setting text/icon alignment. ([#1226](https://github.com/infor-design/enterprise-wc/issues/1226))
- `[Cards/Widget/Box]` Separated the card component into a box, widget and card component, features moved around in each. ([#1327](https://github.com/infor-design/enterprise/issues/1327))
- `[DataGrid]` Fix scrollend event triggering in different zoom levels. ([#1396](https://github.com/infor-design/enterprise/issues/1396))
- `[DataGrid]` Fixes scroll jumping in virtual/infinite scroll. ([#1390](https://github.com/infor-design/enterprise-wc/issues/1390))
- `[DataGrid]` Fix scrollend event triggering in different zoom levels. ([#1396](https://github.com/infor-design/enterprise-wc/issues/1396))
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
- `[DataGrid]` Add contexct menu shortcut for header and filters. ([#1340](https://github.com/infor-design/enterprise-wc/issues/1340))
- `[DataGrid]` Fixed child-level data props when using `expandable-row-template` option. ([#1266](https://github.com/infor-design/enterprise-wc/issues/1266))
- `[DataGrid]` Fixed an issue with the newer `maxlength` setting as it was not working in safari. ([#1403](https://github.com/infor-design/enterprise-wc/issues/1403))
- `[DataGrid]` Added `column.showHeaderExpander` setting to `IdsDataGridColumn`. ([#1360](https://github.com/infor-design/enterprise-wc/issues/1360))
- `[DataGrid]` Fixed tooltip callback/async-callback does not show tooltip for the header. ([#1311](https://github.com/infor-design/enterprise-wc/issues/1311))
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
- `[Button]` Updated slate colors from the design team. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
- `[Colors]` Added new slate color palette with lower range colors. Some elements are updated. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
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
