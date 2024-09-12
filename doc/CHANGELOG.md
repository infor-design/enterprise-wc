# What's New with Enterprise Web Components

## 1.5.1

### 1.5.1 Features

- `[ExpandableArea]` Fix `toggle-btn` type in `ids-expandable-area` for Angular. ([#2730](https://github.com/infor-design/enterprise/issues/2730))

### 1.5.1 Fixes

- `[BarChart]` Fixed legend URL behavior when selectable attribute is true. ([#2494](https://github.com/infor-design/enterprise-wc/issues/2494))

## 1.5.0

### 1.5.0 Important Changes

- `[Datagrid]` Fix virtual-scroll performance on datagrid. ([#2472](https://github.com/infor-design/enterprise-wc/issues/2472))
- `[NotificationBanner]` Renamed `beforeNotificationRemove/notificationRemove/afterNotificationRemove` events to `beforeclose/close/afterclose` to match current event name structure. ([#2484](https://github.com/infor-design/enterprise-wc/issues/2484))

### 1.5.0 Features

- `[Card]` Adds `draggable` attribute to ids-card which allows card to be used in drag and drop scenarios. ([#2423](https://github.com/infor-design/enterprise-wc/issues/2423))
- `[Datagrid]` Fix Clear Row / Eraser button so that changes persist throughout pagination. ([#2615](https://github.com/infor-design/enterprise-wc/issues/2615))
- `[Dropdown|ListBox]` Fix `ids-dropdown` so that it doesn't lose track of it's value when `ids-list-box-option` is dynamically set in Angular. ([#2612](https://github.com/infor-design/enterprise-wc/issues/2612))
- `[Dropdown]` Fixed IdsDropdown default value.  There was a bug where the value property was not working properly with dynamic data. ([#2727](https://github.com/infor-design/enterprise-wc/issues/2727))
- `[Dropdown|Multiselect]` Fixed a bug where 0-indexed values were not being properly displayed in `ids-dropdown`. ([#2686](https://github.com/infor-design/enterprise-wc/issues/2686))
- `[Datagrid]` Fix Clear Row / Eraser button so that changes persist throughout pagination. ([#2615]https://github.com/infor-design/enterprise-wc/issues/2615)
- `[Datagrid]` Added async/await to beforecelledit. ([#2726]https://github.com/infor-design/enterprise-wc/issues/2726)
- `[NotificationBanner]` Added a notification service which can be used to manage notification banners on a page. ([#2160]https://github.com/infor-design/enterprise-wc/issues/2160)
- `[Datagrid]` Fix Clear Row / Eraser button so that changes persist throughout pagination. ([#2615](https://github.com/infor-design/enterprise-wc/issues/2615))
- `[Dropdown]` Add `data` setter to dropdown to load options. ([#2689](https://github.com/infor-design/enterprise-wc/issues/2689))
- `[LoadingIndicator]` Added a setting `contained` which confines the loading indicator within it's nearest parent. ([#2256](https://github.com/infor-design/enterprise-wc/issues/2256))
- `[NotificationBanner]` Added a notification service which can be used to manage notification banners on a page. ([#2160](https://github.com/infor-design/enterprise-wc/issues/2160))
- `[Popup]` Fixed a bug where in Angular the click events cause menus to open when navigating. ([#2747](https://github.com/infor-design/enterprise-wc/issues/2747))
- `[SegmentedControl]` Added the IdsSegmentedControl component. ([#2180]https://github.com/infor-design/enterprise-wc/issues/2180)
- `[Switch]` Added a label position setting that allows positioning the label on either the right or left side of the slider. ([#2579](https://github.com/infor-design/enterprise-wc/issues/2579))
- `[Themes]` Added a setting `IdsGlobal.themePath` that you can use to set the location of the theme files. ([#2125](https://github.com/infor-design/enterprise-wc/issues/2125))
- `[Themes]` Added latest round of semantic tokens. ([#2471](https://github.com/infor-design/enterprise-wc/issues/2471))
- `[Validation]` Improved the validation message to prevent it from overflowing the field area. ([#2706](https://github.com/infor-design/enterprise-wc/issues/2706))

### 1.5.0 Fixes

- `[Breadcrumb]` Fixed bug where the current item could be clicked. ([#/2780](https://github.com/infor-design/enterprise/issues//2780))
- `[ColorPicker]` Fixed bug where custom colors were being overridden. ([#8964](https://github.com/infor-design/enterprise/issues/8964))
- `[Datagrid]` Fixed bug where datagrid mutates original data passed in by user. ([#2724](https://github.com/infor-design/enterprise-wc/issues/2724))
- `[Datagrid]` Fixed bug where the custom select-color is lost during row-recycling/virtual-scrolling. ([#1392](https://github.com/infor-design/enterprise-wc/issues/1392))
- `[Datagrid]` Fixed bug editor dropdown can't be re-opened after closing. ([#2589](https://github.com/infor-design/enterprise-wc/issues/2589))
- `[Dropdown]` Made the `typeahead` setting true by default. ([#2770](https://github.com/infor-design/enterprise-wc/issues/2770))
- `[Homepage]` Converted home page tests to playwright. ([#1940](https://github.com/infor-design/enterprise-wc/issues/1940))
- `[Input]` Fixed position of password button and text color in dark mode. ([#4665](https://inforwiki.atlassian.net/browse/IDS-4665))
- `[LayoutGrid]` Fixed recursion issue in maxWidth setter. ([#2470]https://github.com/infor-design/enterprise-wc/issues/2470)
- `[Listbuilder]` Fixed buggy builder styles. ([#2701](https://github.com/infor-design/enterprise-wc/issues/2701))
- `[Listbuilder]` Fixed an issue where clicking the row in the wrong spot would edit the wrong row. ([#2701](https://github.com/infor-design/enterprise-wc/issues/2701))
- `[Locale]` Fixed translation issue of `small` into Spanish. ([#8962](https://github.com/infor-design/enterprise-wc/issues/8962))
- `[Locale]` Fixed translation issue of `Available` into Thai and Italian. ([#8786](https://github.com/infor-design/enterprise-wc/issues/8786))
- `[Listbuilder]` Fixed buggy builder styles. ([#2701](https://github.com/infor-design/enterprise-wc/issues/2701))
- `[Listbuilder]` Fixed an issue where clicking the row in the wrong spot would edit the wrong row. ([#2701](https://github.com/infor-design/enterprise-wc/issues/2701))
- `[Locale]` Fixed translation issue of `small` into Spanish. ([#8962](https://github.com/infor-design/enterprise-wc/issues/8962))
- `[Locale]` Fixed translation issue of `Available` into Thai and Italian. ([#8786](https://github.com/infor-design/enterprise-wc/issues/8786))
- `[Modal]` Fixed missing border between modal buttons. ([#4660](https://inforwiki.atlassian.net/browse/IDS-4660))
- `[Multiselect]` Added `placeholder` attribute to `ids-multiselect` to allow for a placeholder value. ([#2758](https://github.com/infor-design/enterprise-wc/issues/2758))
- `[Multiselect]` Converted multiselect tests to playwright. ([#1957](https://github.com/infor-design/enterprise-wc/issues/1957))
- `[Popup]` Fixed an issue where the popup took up space when initially loaded. ([#2777](https://github.com/infor-design/enterprise-wc/issues/2777))
- `[PopupMenu/Datagrid]` Fixed an issue where popupmenu is not in the correct position on modals or action panels. ([#4264](https://inforwiki.atlassian.net/browse/IDS-4264))
- `[Pager]` Fixed an issue where the disabled attribute of navigation buttons was overridden by the pager. ([#2738](https://github.com/infor-design/enterprise-wc/issues/2738))
- `[Radio]` Fixed an issue where the radio group could not set checked for radio elements when using Angular's FormControl and value binding. ([#2700](https://github.com/infor-design/enterprise-wc/issues/2700))
- `[Splitter]` Converted datagrid popups to fixed to go over splitter panes. ([#2499](https://github.com/infor-design/enterprise-wc/issues/2499))
- `[Splitter]` Fixed an issue where position was not retained when expanding and collapsing. ([#2527](https://github.com/infor-design/enterprise-wc/issues/2527))
- `[Switch]` Fixed an issue where switch triggered `change` event twice. ([#2681](https://github.com/infor-design/enterprise-wc/issues/2681))
- `[Tabs]` Fixed color issues in dark mode. ([#4716](https://inforwiki.atlassian.net/browse/IDS-4716))

## 1.4.2

### 1.4.2 Features

- `[Editor]` Added the ability to set the editor value with a `value` attribute. ([#2526](https://github.com/infor-design/enterprise-wc/issues/2526))

### 1.4.2 Fixes

- `[Accordion]` Fixed a bug where triggering a child component event would cause the accordion pane to collapse.([#2562](https://github.com/infor-design/enterprise-wc/issues/2562))
- `[Button]` Fixed a bug in the lifecycle where inner classes where not refreshed in some frameworks.([#2627](https://github.com/infor-design/enterprise-wc/issues/2627))
- `[Button]` Fixed an issue where Button layout looks off in smaller viewport. ([#2652](https://github.com/infor-design/enterprise-wc/issues/2652))
- `[Checkbox]` Fixed an issue where native events were triggered multiple times in single selection. ([#2385](https://github.com/infor-design/enterprise-wc/issues/2385))
- `[Datagrid]` If no options the datagrid will still show the value, defaulting the options that may load later. ([#2386](https://github.com/infor-design/enterprise-wc/issues/2386))
- `[Dropdown]` Converted dropdown tests to playwright. ([#1846](https://github.com/infor-design/enterprise-wc/issues/1846))
- `[Dropdown]` Fixed an issue where disabling typeahead allowed typing in the input. ([#2662](https://github.com/infor-design/enterprise-wc/issues/2662))
- `[Editor]` Removed internal hard coded id since it was causing duplicate ids if multiple editors are used. ([#2630](https://github.com/infor-design/enterprise-wc/issues/2630))
- `[Editor]` Updated docs around `labels`. ([#2649](https://github.com/infor-design/enterprise-wc/issues/2649))
- `[General]` Updated readme docs to remove redundant usage, updated readme titles for all components, copyedits for some settings.([#2482](https://github.com/infor-design/enterprise-wc/issues/2482))
- `[ListBuilder]` Converted list builder tests to playwright. ([#1873](https://github.com/infor-design/enterprise-wc/issues/1873))
- `[ListView]` Resolved an issue where the list can't be navigated using up and down arrows. ([#2595](https://github.com/infor-design/enterprise-wc/issues/2595))
- `[MenuButton]` Fixed an issue where the popup menu was not placed correctly in Angular/production build. ([#2669](https://github.com/infor-design/enterprise-wc/issues/2669))
- `[SwapList]` Converted swap list tests to playwright. ([#1974](https://github.com/infor-design/enterprise-wc/issues/1974))
- `[Tabs]` Fixed an issue where overflow menu group popup is full width. ([#2656](https://github.com/infor-design/enterprise-wc/issues/2656))
- `[TimPicker]` Converted time picker tests to playwright. ([#1982](https://github.com/infor-design/enterprise-wc/issues/1982))
- `[Tree]` Refactor IdsTree to allow rendering of large dataset. ([#2504](https://github.com/infor-design/enterprise-wc/issues/2504))

## 1.4.1

### 1.4.1 Fixes

- `[Multiselect]` Added typeahead improvements. ([#2432](https://github.com/infor-design/enterprise-wc/issues/2432))
- `[NotificationBanner]` Added `line-clamp` setting to notification banner to allow custom message truncation. ([#2138](https://github.com/infor-design/enterprise-wc/issues/2138))
- `[SwapList]` ReFix: Made the search portion of the swaplist sticky when scrolling. ([#2559](https://github.com/infor-design/enterprise-wc/issues/2559))
- `[Splitter]` Fix issue where pane's scrollbar didn't appear on overflow. ([#2583](https://github.com/infor-design/enterprise-wc/issues/2583))

## 1.4.0

### 1.4.0 Features

- `[Datagrid]` Added search feature to datagrid via `searchable` and `search-term-min-size` attributes. ([#2449](https://github.com/infor-design/enterprise-wc/issues/2449))
- `[Datagrid]` Added a new `grouped` rows setting to group rows. Also added the personalization dialog feature. ([#2271](https://github.com/infor-design/enterprise-wc/issues/2271))
- `[ListView]` Added grouped headers and a `appendToBottom` method. ([#2626](https://github.com/infor-design/enterprise-wc/issues/2626))

### 1.4.0 Fixes

- `[Accordion]` Added css variables to customization accordion header padding. ([#2529](https://github.com/infor-design/enterprise-wc/issues/2529))
- `[Button]` Added notification badges. ([#2323](https://github.com/infor-design/enterprise-wc/issues/2323))
- `[Card|Datagrid]` Fixed `ids-card` styles when `ids-data-grid` is embedded within a card-content slot. ([#2382](https://github.com/infor-design/enterprise-wc/issues/2382))
- `[ColorPicker]` Converted color picker tests to playwright. ([#1922](https://github.com/infor-design/enterprise-wc/issues/1922))
- `[ColorPicker]` Fixed an issue where the picker's swatch focus is causing the page to scroll. ([#2502](https://github.com/infor-design/enterprise-wc/issues/2502))
- `[Datagrid]` Fixed problem with `searchable` datagrid where eraser button was not persisting on search-filtered rows. ([#2449](https://github.com/infor-design/enterprise-wc/issues/2449))
- `[Datagrid]` Added new method `resetDirtyRow` allowing to reset dirty state for an specific row. ([#2586](https://github.com/infor-design/enterprise-wc/issues/2586))
- `[Datagrid]` Fixed problem with `searchable` datagrid where eraser button was not persisting on search-filtered rows. ([#2449](https://github.com/infor-design/enterprise-wc/issues/2449))
- `[Dropdown]` Fix dropdown size setting for angular. ([#2248](https://github.com/infor-design/enterprise-wc/issues/2248))
- `[Dropdown]` Fix dropdown position in datagrid in tabs. ([#2582](https://github.com/infor-design/enterprise-wc/issues/2582))
- `[Editor]` Fixed bug where the modals would not close. ([#2650](https://github.com/infor-design/enterprise-wc/issues/2650))
- `[Empty Message]` Converted empty message tests to playwright. ([#2337](https://github.com/infor-design/enterprise-wc/issues/2337))
- `[Icon]` Create icon example with tooltips. ([#2257](https://github.com/infor-design/enterprise-wc/issues/2257))
- `[Icon]` Fixed misplaced setting icon ([#2636](https://github.com/infor-design/enterprise-wc/issues/2636))
- `[CheckBox]` Fixed checkbox layout ([#2648](https://github.com/infor-design/enterprise-wc/issues/2648))
- `[ListView]` Fixed an issue where selected event is not being triggered on `ids-list-view-item`. ([#2565](https://github.com/infor-design/enterprise-wc/issues/2565))
- `[Locale]` Converted locale tests to playwright. ([#1948](https://github.com/infor-design/enterprise-wc/issues/1948))
- `[ModuleNav]` Fixed an issue where the text in the nav bar is not visible when added dynamically. ([#2517](https://github.com/infor-design/enterprise-wc/issues/2517))
- `[PopupMenu]` Added `offset-container` setting to allow adjustment to container types that affect fixed positioned popups. ([#2566](https://github.com/infor-design/enterprise-wc/issues/2566))
- `[Searchfield]` Fixed an issue where the clear button is visible on collapse. ([#2505](https://github.com/infor-design/enterprise-wc/issues/2505))
- `[Searchfield]` Fixed issue where search icon is shifted `17px`. ([#2639](https://github.com/infor-design/enterprise-wc/issues/2639))
- `[Splitter]` Fix issue where text in closed panes overlapped the other side. ([#2583](https://github.com/infor-design/enterprise-wc/issues/2583))
- `[Splitter]` Fix issue initializing size and collapsed at the same time. ([#2585](https://github.com/infor-design/enterprise-wc/issues/2585))
- `[Splitter]` Fix initialization issues when in angular apps. ([#2590](https://github.com/infor-design/enterprise-wc/issues/2590))
- `[Splitter]` Fix issue where text in closed panes overlapped the other side. ([#2583](https://github.com/infor-design/enterprise-wc/issues/2583))
- `[Splitter]` Fix issue where pane's scrollbar didn't appear on overflow. ([#2583](https://github.com/infor-design/enterprise-wc/issues/2583))
- `[Splitter]` Fix issue initializing size and collapsed at the same time. ([#2585](https://github.com/infor-design/enterprise-wc/issues/2585))
- `[Splitter]` Fix initialization issues when in angular apps. ([#2590](https://github.com/infor-design/enterprise-wc/issues/2590))
- `[Splitter]` Fix issue where text in closed panes overlapped the other side. ([#2583](https://github.com/infor-design/enterprise-wc/issues/2583))
- `[SwapList]` Made the search portion of the swaplist sticky when scrolling. ([#2559](https://github.com/infor-design/enterprise-wc/issues/2559))
- `[Themes]` Fixed path for `esbuild` script to include `themes/` in `dist` development/production builds. ([#2641](https://github.com/infor-design/enterprise-wc/issues/2641))
- `[Tooltip]` Increase tooltip z-index. ([#2462](https://github.com/infor-design/enterprise-wc/issues/2462))

## 1.3.0

### 1.3.0 Features

- `[Fonts]` The source sans pro font should no longer be used in `googleapis` instead serve it locally. Updated examples to do this. See docs on [including locale fonts](https://github.com/infor-design/ids-foundation/blob/main/fonts/README.md). ([#2283](https://github.com/infor-design/enterprise/issues/2283))
- `[Dates]` Added a new `twoDigitYear` setting to set the locale system to set the dates cut over for two digit years, note that two digit years should be avoided. ([#2425](https://github.com/infor-design/enterprise-wc/issues/2425))
- `[LayoutGrid]` Adds an example of a responsive grid layout inside a splitter component. ([#2411](https://github.com/infor-design/enterprise-wc/issues/2411))
- `[Switch]` Updated switch design. ([#2347](https://github.com/infor-design/enterprise-wc/issues/2347))

### 1.3.0 Fixes

- `[Accordion]` Fix accordion panel expanded/icon states when inserted dynamically. ([#2406](https://github.com/infor-design/enterprise-wc/issues/2406))
- `[Accordion]` Fix nested accordion fires common event between all headers. ([#2408](https://github.com/infor-design/enterprise-wc/issues/2408))
- `[Accordion]` Added css variables to customization accordion header padding. ([#2529](https://github.com/infor-design/enterprise-wc/issues/2529))
- `[Button]` Changed `GenAi` Button in dark mode background color. ([#2509](https://github.com/infor-design/enterprise-wc/issues/2509))
- `[Datagrid]` Added search feature to datagrid via `searchable` and `search-term-min-size` attributes. ([#2449](https://github.com/infor-design/enterprise-wc/issues/2449))
- `[Datagrid]` Fixed a bug where when no `id` column or `idColumn` setting remove row removed the wrong row.. ([#2355](https://github.com/infor-design/enterprise-wc/issues/2355))
- `[Dropdown]` Fix dropdown bug where input is empty when option text is dynamic. ([#2362](https://github.com/infor-design/enterprise-wc/issues/2362))
- `[Dropdown]` Fix dropdown width when size is `full`. ([#2001](https://github.com/infor-design/enterprise-wc/issues/2001))
- `[Dropdown]` Fix dropdown in expandable header. ([#2441](https://github.com/infor-design/enterprise-wc/issues/2441))
- `[Dropdown]` Fix dropdown in action panel. ([#2431](https://github.com/infor-design/enterprise-wc/issues/2431))
- `[Multiselect]` Fix multiselect width when size is `full`. ([#2248](https://github.com/infor-design/enterprise-wc/issues/2248))
- `[Datagrid]` Fix `save-user-settings` so that it works in Angular. ([#2383](https://github.com/infor-design/enterprise-wc/issues/2383))
- `[Image]` Fix `src` setting in example. ([#2300](https://github.com/infor-design/enterprise-wc/issues/2300))
- `[LayoutGrid]` Adds attribute to define row structure of grid layout. ([#2454](https://github.com/infor-design/enterprise-wc/issues/2454))
- `[ListView|VirtualScroll]` Fix scroll-behavior of `ids-list-view` when used within `ids-virtual-scroll`. ([#2322](https://github.com/infor-design/enterprise-wc/issues/2322))
- `[ListView]` Fix bug where, after a list-view-item is selected, search-field keeps losing focus while typing. ([#2296](https://github.com/infor-design/enterprise-wc/issues/2296))
- `[ListView|VirtualScroll]` Fix scroll-behavior of `ids-list-view` when used within `ids-virtual-scroll`. ([#2322](https://github.com/infor-design/enterprise-wc/issues/2322))
- `[LoadingIndicator]` Added fixes to some properties that could not be set on the fly. ([#2429](https://github.com/infor-design/enterprise-wc/issues/2429))
- `[Message]` Converted message tests to playwright. ([#1954](https://github.com/infor-design/enterprise-wc/issues/1954))
- `[Modal]` Fixed an issue where string interpolation didn't work for the modal title in Angular examples. ([#2325](https://github.com/infor-design/enterprise-wc/issues/2325))
- `[MonthView]` Converted month view tests to playwright. ([#1956](https://github.com/infor-design/enterprise-wc/issues/1956))
- `[PopupMenu]` Removed timer and redundant flag for production issue. ([#2457](https://github.com/infor-design/enterprise-wc/issues/2457))
- `[Tabs]` Fix tab content visible state when added dynamically. ([#2393](https://github.com/infor-design/enterprise-wc/issues/2393))
- `[Text]` Properly vertically-align `ids-alert` text when placed inside `ids-text`. ([#2327](https://github.com/infor-design/enterprise-wc/issues/2327))
- `[Tooltip]` Converted tooltip tests to playwright. ([#1985](https://github.com/infor-design/enterprise-wc/issues/1985))
- `[TriggerButton]` Fixed style issues. Trigger start spacing, readonly hover, inline border radius. ([#2303](https://github.com/infor-design/enterprise-wc/issues/2303))
- `[WeekView]` Added more input handling for `startHour`, `endHour`, and `timelineInterval`. ([#2446](https://github.com/infor-design/enterprise-wc/issues/2446))
- `[WeekView]` Converted week view tests to playwright. ([#1993](https://github.com/infor-design/enterprise-wc/issues/1993))

## 1.2.0

### 1.2.0 Fixes

- `[About]` Removed mobile info from about page. ([#8502](https://github.com/infor-design/enterprise/issues/8502))
- `[AppMenu]` Added background color to selected item. ([#2048](https://github.com/infor-design/enterprise/issues/2048))
- `[Datagrid]` Add row highlight background on hover with setting to disable. ([#2169](https://github.com/infor-design/enterprise-wc/issues/2169))
- `[Datagrid]` Wrong value being used when adding rows. This was already fixed in WC #1506. Added test and demo. ([#2253](https://github.com/infor-design/enterprise-wc/issues/2253))
- `[Datagrid]` Fix cursor on inline editor. ([#2388](https://github.com/infor-design/enterprise-wc/issues/2388))
- `[DatePicker]` Fix datepicker value syncing with manual input changes. ([#2207](https://github.com/infor-design/enterprise-wc/issues/2207))
- `[Drawer]` Converted drawer tests to playwright. ([#1930](https://github.com/infor-design/enterprise-wc/issues/1930))
- `[Dropdown]` Added additional fixes so that typeahead works in the angular examples. ([#2249](https://github.com/infor-design/enterprise-wc/issues/2249))
- `[ExpandableArea]` Converted expandable area tests to playwright. ([#1935](https://github.com/infor-design/enterprise/issues/1935))
- `[Form]` Fixed the issue where submit event not being attached in the angular examples. ([#2022](https://github.com/infor-design/enterprise-wc/issues/2022))
- `[Hierarchy]` Converted hierarchy tests to playwright. ([#1939](https://github.com/infor-design/enterprise-wc/issues/1939))
- `[Hyperlink]` Converted hyperlink tests to playwright. ([#1941](https://github.com/infor-design/enterprise/issues/1941))
- `[Input|Textarea]` Fixed bug where `ids-input` and `ids-textarea` DOM values were not updating on change. ([#2028](https://github.com/infor-design/enterprise/issues/2028))
- `[ListBox]` Adding support for `disabled` attribute to `ids-list-box-option` element. ([#2389](https://github.com/infor-design/enterprise-wc/issues/2389))
- `[Masthead]` Converted masthead tests to playwright. ([#1951](https://github.com/infor-design/enterprise-wc/issues/1951))
- `[MenuButton]` Fix popup aligned edge position on open. ([#2285](https://github.com/infor-design/enterprise-wc/issues/2285))
- `[MenuButton]` Fix reattachment issue (down-arrow disappeared and wedge positioned out of place). ([#2136](https://github.com/infor-design/enterprise-wc/issues/2136))
- `[Multiselect]` Fix so that options with long text will now show tooltip and also fit properly inside input-field. ([#2264](https://github.com/infor-design/enterprise-wc/issues/2264))
- `[Multiselect]` Fixed an issue where the change event was not firing in Angular. ([#2365](https://github.com/infor-design/enterprise-wc/issues/2365))
- `[Pager]` Fix `ids-pager-button` so that it can be enabled if `page-total` is unknown or not provided. ([#1506](https://github.com/infor-design/enterprise-wc/issues/1506))
- `[Pie Chart]` Converted pie chart tests to playwright. ([#1960](https://github.com/infor-design/enterprise-wc/issues/1960))
- `[Popup]` Fix return of `bleed` property. ([#2360][https://github.com/infor-design/enterprise-wc/issues/2360])
- `[Popup]` Converted popup test to playwright. ([#1962][https://github.com/infor-design/enterprise-wc/issues/1962])
- `[PopupMenu]` Fix popupmenu truncation bug for menu items with shortcuts. ([#2250](https://github.com/infor-design/enterprise-wc/issues/2250))
- `[Popupmenu]` Changed the `position-style` default to `fixed` this causes better placement in scroll containers. ([#2289](https://github.com/infor-design/enterprise-wc/issues/2289))
- `[Popupmenu]` Converted popup menu test to playwright. ([#1961][https://github.com/infor-design/enterprise-wc/issues/1961])
- `[Process Indicator]` Converted process indicator tests to playwright. ([#1963](https://github.com/infor-design/enterprise-wc/issues/1963))
- `[Progress Bar]` Converted progress bar tests to playwright. ([#1964](https://github.com/infor-design/enterprise-wc/issues/1964))
- `[Progress Chart]` Converted progress chart tests to playwright. ([#1965](https://github.com/infor-design/enterprise-wc/issues/1965))
- `[SkipLink]` Converted skiplink tests to playwright. ([#1970](https://github.com/infor-design/enterprise-wc/issues/1970))
- `[Slider]` Converted slider tests to playwright. ([#1971](https://github.com/infor-design/enterprise-wc/issues/1971))
- `[Step chart]` Converted skiplink tests to playwright. ([#1973](https://github.com/infor-design/enterprise-wc/issues/1973))
- `[Swappable]` Converted swappable tests to playwright. ([#1975](https://github.com/infor-design/enterprise-wc/issues/1975))
- `[Tabs]` Fixed an issue where first tab is not being selected when using production build on a html page. ([#2338](https://github.com/infor-design/enterprise-wc/issues/2338))
- `[Tabs]` Fixed position of more menu in production/angular build. ([#2352](https://github.com/infor-design/enterprise-wc/issues/2352))
- `[Toolbar]` Converted toolbar tests to playwright. ([#1984](https://github.com/infor-design/enterprise-wc/issues/1984))
- `[Upload Advance]` Converted upload advance tests to playwright. ([#1990](https://github.com/infor-design/enterprise-wc/issues/1990))
- `[Tabs]` Converted Tabs tests to playwright. ([#1979](https://github.com/infor-design/enterprise-wc/issues/1979))
- `[Text]` Fixed lifecycle issues with text translation in angular.. ([#2324](https://github.com/infor-design/enterprise-wc/issues/2324))
- `[Upload]` Converted upload tests to playwright. ([#1991](https://github.com/infor-design/enterprise-wc/issues/1991))
- `[Theme Switcher]` Converted theme switcher tests to playwright. ([#1981](https://github.com/infor-design/enterprise-wc/issues/1981))
- `[TokenTable]` Update the table to show color previews at all tiers. ([#2420](https://github.com/infor-design/enterprise-wc/issues/2420))
- `[TokenTable]` Update the token table labels to be Modes instead of Themes. ([#2415](https://github.com/infor-design/enterprise-wc/issues/2415))
- `[TokenTable]` Use fixed with on the token value and token name columns in the token table. ([#2400](https://github.com/infor-design/enterprise-wc/issues/2400))
- `[TokenTable]` Rename the Type column to Tier. ([#2397](https://github.com/infor-design/enterprise-wc/issues/2397))
- `[TokenTable]` Fix bug where component names were incomplete in the table. ([#2401](https://github.com/infor-design/enterprise-wc/issues/2401))
- `[TokenTable]` Added a column display the token's css name. ([#2402](https://github.com/infor-design/enterprise-wc/issues/2402))
- `[Toolbar]` Converted toolbar tests to playwright. ([#1984](https://github.com/infor-design/enterprise-wc/issues/1984))

## 1.1.0

### 1.1.0 Features

- `[Accordion|Lookup]` Fix bug where `IdsLookup` modal was not appearing fully within `IdsAccordion`. ([#2212](https://github.com/infor-design/enterprise-wc/issues/2212))
- `[Autocomplete]` Added `value-field` attribute to indicate what field from the dataset to return in selected event details. ([#1817](https://github.com/infor-design/enterprise-wc/issues/1817))
- `[Datagrid]` Added the ability to dynamically set the `icon` and `text` column options on some formatters. ([#2122](https://github.com/infor-design/enterprise-wc/issues/2122))
- `[Datagrid]` Added the ability to create multiline header text [see docs](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-data-grid#multiline-header-code-examples) for details. ([#1793](https://github.com/infor-design/enterprise-wc/issues/1793))
- `[Datagrid]` Fix problem with datagrid pagination where setting the `pageTotal` property causes some of the rows to be incorrectly sorted. ([#2232](https://github.com/infor-design/enterprise-wc/issues/2232))
- `[Datagrid]` Fixed bugged where adding `pageTotal` to datagrid messed up data order. ([#2232](https://github.com/infor-design/enterprise-wc/issues/2232))
- `[Datagrid]` Fix grid popup alignment issues, by removing children if there are more than one instance of the child. ([#2246](https://github.com/infor-design/enterprise-wc/issues/2246))
- `[FilterField]` Added `IdsFilterField` component. ([#1906](https://github.com/infor-design/enterprise-wc/issues/1906))
- `[Splitter]` If the panel is resized to 0, it will have `collapsed` attribute, enabling it to expand to its original position. ([#2083](https://github.com/infor-design/enterprise-wc/issues/2083))

### 1.1.0 Fixes

- `[Accordion]` Added setting to keep the default expander type for sub-level accordion headers. ([#2290](https://github.com/infor-design/enterprise-wc/issues/2290))
- `[Autocomplete]` Fixed the popup is not attached when using the `autocomplete` attribute to set it. ([#2173](https://github.com/infor-design/enterprise-wc/issues/2173))
- `[ActionPanel]` Fixed a bug that clicking the header closed the panel, also added a new hover state. ([#2294](https://github.com/infor-design/enterprise-wc/issues/2294))
- `[AxisChart]` Fix `IdsAxisChart` so that it properly reloads when removed from the DOM and then reattached. ([#2111](https://github.com/infor-design/enterprise-wc/issues/2111))
- `[Button]` Updated focus state on tertiary buttons. ([#2239](https://github.com/infor-design/enterprise-wc/issues/2239))
- `[Breadcrumb]` Fixed truncating to work better when parent size is set. ([#2317](https://github.com/infor-design/enterprise-wc/issues/2317))
- `[Container]` Switch from `vh` to `dvh` units. ([#2268](https://github.com/infor-design/enterprise-wc/issues/2268))
- `[Datagrid]` Fixed row expanded/collapsed events triggering with the `allowOneExpandedRow` option. ([#2275](https://github.com/infor-design/enterprise-wc/issues/2275))
- `[Datagrid]` Fixed internal width of the input element in an editable input cell. ([#2265](https://github.com/infor-design/enterprise-wc/issues/2265))
- `[Dropdown]` Fixed issues using typeahead in a compiled script. ([#2249](https://github.com/infor-design/enterprise-wc/issues/2249))
- `[Dropdown]` Fixed hover color on items in dark mode. ([#2293](https://github.com/infor-design/enterprise-wc/issues/2293))
- `[Header]` Fixed inconsistency on header background color. ([#2242](https://github.com/infor-design/enterprise-wc/issues/2242))
- `[BarChart]` Converted bar chart tests to playwright. ([#1919](https://github.com/infor-design/enterprise-wc/issues/1919))
- `[BreadCrumb/Hyperlink]` Fix focus state on click bug. ([#2238](https://github.com/infor-design/enterprise-wc/issues/2238))
- `[Dropdown]` Fixed dropdown positioning logic so it works on modals and popups, and better opens up if it does not fit. ([#2165](https://github.com/infor-design/enterprise-wc/issues/2165))
- `[Editor]` Converted editor tests to playwright. ([#1931](https://github.com/infor-design/enterprise-wc/issues/1931))
- `[Listview]` Converted listview tests to playwright. ([#1947](https://github.com/infor-design/enterprise-wc/issues/1947))
- `[Toast]` Converted toast tests to playwright. ([#1983](https://github.com/infor-design/enterprise-wc/issues/1983))
- `[Editor]` Fix bug where html editor edits weren't being stored. ([#2261](https://github.com/infor-design/enterprise-wc/issues/2261))
- `[Input]` Fixed required validation triggered when assigning an empty value on initial component mount in React and Angular examples. ([#2233](https://github.com/infor-design/enterprise-wc/issues/2233))
- `[Menu]` Converted menu tests to playwright. ([#1953](https://github.com/infor-design/enterprise-wc/issues/1953))
- `[Modal]` Removed zoom in animation on modal based on design feedback and technical constraints. ([#2165](https://github.com/infor-design/enterprise-wc/issues/2165))
- `[PopupMenu]` Fixed an issue where a submenu is in the wrong position when using production build on a html page ([#2216](https://github.com/infor-design/enterprise-wc/issues/2216))
- `[Toolbar]` Fix so that menus and submenu popup positions are correct when using `IdsToolbar` inside `IdsAppMenu` (and `IdsHeader`). ([#1806](https://github.com/infor-design/enterprise-wc/issues/1806))
- `[Tree]` Add ability to have expandIcon and toggleIcon display together. ([#2151](https://github.com/infor-design/enterprise-wc/issues/2151))
- `[Tree]` Fixed bug where redraw did not trigger when assigning an empty array. ([#2227](https://github.com/infor-design/enterprise-wc/issues/2227))
- `[Tree]` Converted tree tests to playwright. ([#1986](https://github.com/infor-design/enterprise-wc/issues/1986))
- `[TriggerButton]` Converted trigger button tests to playwright. ([#1988](https://github.com/infor-design/enterprise-wc/issues/1988))
- `[TriggerField]` Converted trigger field tests to playwright. ([#1989](https://github.com/infor-design/enterprise-wc/issues/1989))
- `[Upload]` Fixed trigger-button focus state. ([#2186](https://github.com/infor-design/enterprise-wc/issues/2186))
- `[Upload Advanced]` Fixed duplicated upload status banners after reattach. ([#2073](https://github.com/infor-design/enterprise-wc/issues/2073))
- `[VirtualScroll]` Converted virtual scroll tests to playwright. ([#1992](https://github.com/infor-design/enterprise-wc/issues/1992))

## 1.0.0

### 1.0.0 Features

- `[About]` Added the ability to copy stats to the clipboard with a button. ([#2176](https://github.com/infor-design/enterprise-wc/issues/2176))
- `[AppMenu/ModuleNav]` Added examples showing content like masthead and tabs can move the menu container down. ([#2074](https://github.com/infor-design/enterprise-wc/issues/2074))
- `[Datagrid]` Add `allow-one-expanded-row` attribute to data-grid to limit expandable-rows to one. ([#1998](https://github.com/infor-design/enterprise-wc/issues/1998))
- `[SearchField]` Added collapsible setting to IdsSearchField. ([#403](https://github.com/infor-design/enterprise-wc/issues/403))
- `[Swaplist]` Added search feature to `IdsSwapList`. ([#1702](https://github.com/infor-design/enterprise-wc/issues/1702))
- `[Wizard]` Added disabled attribute to the steps. ([#2192](https://github.com/infor-design/enterprise-wc/issues/2192))

### 1.0.0 Fixes

- `[AreaChart]` Converted area chart tests to playwright. ([#1917](https://github.com/infor-design/enterprise-wc/issues/1917))
- `[DataGrid]` Fixed placement of tree expand buttons in the tree grid. ([#1603](https://github.com/infor-design/enterprise-wc/issues/1603))
- `[Editor]` Fixed style of some buttons and the height of the toolbar. ([#2188](https://github.com/infor-design/enterprise-wc/issues/2188))
- `[Forms]` Fixed issues with tabbing and layout issues in compact mode on forms. ([#2128](https://github.com/infor-design/enterprise-wc/issues/2128))
- `[Header]` Changed the header color setting to work separate from personalization. ([#2050](https://github.com/infor-design/enterprise-wc/issues/2050))
- `[Hierarchy]` Fixed the issue where a popup appeared behind the field. ([#2191](https://github.com/infor-design/enterprise-wc/issues/2191))
- `[LayoutGrid]` Added fixes for background fill color in contrast mode. ([#2189](https://github.com/infor-design/enterprise-wc/issues/2189))
- `[ListView]` Updated listview sortable styles. ([#1733](https://github.com/infor-design/enterprise-wc/issues/1733))
- `[Message]` Fixed mobile IdsMessage behavior. ([#2183](https://github.com/infor-design/enterprise-wc/issues/2183))
- `[Modal]` Fixed invisible button in dark mode modals. ([#2197](https://github.com/infor-design/enterprise-wc/issues/2197))
- `[NotificationBanner]` Fixed issue with the link attribute not being updated in the setter. ([#2209](https://github.com/infor-design/enterprise-wc/issues/2209))
- `[Pager]` Fixed an error when creating an ids-pager-dropdown via document.createElement. ([#2193](https://github.com/infor-design/enterprise-wc/issues/2193))
- `[Personalizations]` Added a method to reset the personalization color to the default. ([#2054](https://github.com/infor-design/enterprise-wc/issues/2054))
- `[Slider]` Step number has been changed to the number of steps between start and end step. ([#2091](https://github.com/infor-design/enterprise-wc/issues/2091))
- `[TextArea]` Converted textarea tests to playwright. ([#1980](https://github.com/infor-design/enterprise-wc/issues/1980))
