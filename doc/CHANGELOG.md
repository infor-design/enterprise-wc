# What's New with Enterprise Web Components

## 1.4.3

## 1.4.3 Features

- `[Themes]` Added a setting `IdsGlobal.themePath` that you can use to set the location of the theme files. ([#2125]https://github.com/infor-design/enterprise-wc/issues/2125)

### 1.4.3 Fixes

- `[Homepage]` Converted home page tests to playwright. ([#1940](https://github.com/infor-design/enterprise-wc/issues/1940))
- `[Listbuilder]` Fixed buggy builder styles. ([#2701]https://github.com/infor-design/enterprise-wc/issues/2701)
- `[Listbuilder]` Fixed an issue where clicking the row in the wrong spot would edit the wrong row. ([#2701]https://github.com/infor-design/enterprise-wc/issues/2701)

## 1.4.2

### 1.4.2 Features

- `[Editor]` Added the ability to set the editor value with a `value` attribute. ([#2526](https://github.com/infor-design/enterprise-wc/issues/2526))

### 1.4.2 Fixes

- `[Accordion]` Fixed a bug where triggering a child component event would cause the accordion pane to collapse.([#2562]https://github.com/infor-design/enterprise-wc/issues/2562)
- `[Button]` Fixed a bug in the lifecycle where inner classes where not refreshed in some frameworks.([#2627]https://github.com/infor-design/enterprise-wc/issues/2627)
- `[Button]` Fixed an issue where Button layout looks off in smaller viewport. ([#2652](https://github.com/infor-design/enterprise-wc/issues/2652))
- `[Checkbox]` Fixed an issue where native events were triggered multiple times in single selection. ([#2385](https://github.com/infor-design/enterprise-wc/issues/2385))
- `[Datagrid]` If no options the datagrid will still show the value, defaulting the options that may load later. ([#2386](https://github.com/infor-design/enterprise-wc/issues/2386))
- `[Dropdown]` Converted dropdown tests to playwright. ([#1846](https://github.com/infor-design/enterprise-wc/issues/1846))
- `[Dropdown]` Fixed an issue where disabling typeahead allowed typing in the input. ([#2662](https://github.com/infor-design/enterprise-wc/issues/2662))
- `[Editor]` Removed internal hard coded id since it was causing duplicate ids if multiple editors are used. ([#2630](https://github.com/infor-design/enterprise-wc/issues/2630))
- `[Editor]` Updated docs around `labels`. ([#2649](https://github.com/infor-design/enterprise-wc/issues/2649))
- `[General]` Updated readme docs to remove redundant usage, updated readme titles for all components, copyedits for some settings.([#2482]https://github.com/infor-design/enterprise-wc/issues/2482)
- `[ListBuilder]` Converted list builder tests to playwright. ([#1873](https://github.com/infor-design/enterprise-wc/issues/1873))
- `[ListView]` Resolved an issue where the list can't be navigated using up and down arrows. ([#2595](https://github.com/infor-design/enterprise-wc/issues/2595))
- `[MenuButton]` Fixed an issue where the popup menu was not placed correctly in Angular/production build. ([#2669](https://github.com/infor-design/enterprise-wc/issues/2669))
- `[SwapList]` Converted swap list tests to playwright. ([#1974](https://github.com/infor-design/enterprise-wc/issues/1974))
- `[Tabs]` Fixed an issue where overflow menu group popup is full width. ([#2656](https://github.com/infor-design/enterprise-wc/issues/2656))
- `[TimPicker]` Converted time picker tests to playwright. ([#1982](https://github.com/infor-design/enterprise-wc/issues/1982))

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

## 1.0.0-beta.23

### 1.0.0-beta.23 Ui Changes

- `[General]` Changed the ids on trigger and input fields for the internal input element to be unique. They will use the assigned id plus `-internal`. ([#1852](https://github.com/infor-design/enterprise-wc/issues/1852))
- `[Tokens]` UI design changes to popups, buttons, toggle button, menu button, cards (minor), and darker text. Contrast mode is now white. ([#1680](https://github.com/infor-design/enterprise-wc/issues/1680))

### 1.0.0-beta.23 Features

- `[DataGrid]` Added the ability to link a button formatter to a menu see example `ids-data-grid/columns-formatters.html` and data grid docs. ([#1933](https://github.com/infor-design/enterprise-wc/issues/1933))
- `[ListBuilder]` Added a check to deselect the previously selected automatically upon adding a new item in a single-select ListBuilder. ([#1809](https://github.com/infor-design/enterprse-wc/issues/1809))
- `[Modal]` Added `click-outside-to-close` attribute allowing the modal to close by clicking outside. ([#1892](https://github.com/infor-design/enterprise-wc/issues/1892))
- `[Separator]` Fixed issue rendering vertical separator. ([#1891](https://github.com/infor-design/enterprise-wc/issues/1891))
- `[Splitter]` Added `height` attribute to `IdsSplitter` as workaround to to remove unnecessary vertical scrollbar. ([#1926](https://github.com/infor-design/enterprise-wc/issues/1926))
- `[Tokens]` Integrate tokens with figma/ids-foundation. ([#1680](https://github.com/infor-design/enterprise-wc/issues/1680))

### 1.0.0-beta.23 Fixes

- `[AppMenu]` Fix open/close events after reattach. ([#2070](https://github.com/infor-design/enterprise-wc/issues/2070))
- `[Button]` Added updated button designs from the tokens. ([#1680](https://github.com/infor-design/enterprise-wc/issues/1680))
- `[Button]` Fixed layout issues when buttons are next to each other. ([#1999](https://github.com/infor-design/enterprise-wc/issues/1999))
- `[Button]` Fixed some buttons types from requiring a `span`. ([#2080](https://github.com/infor-design/enterprise-wc/issues/2080))
- `[Button]` Removed ripple effects and mixin on all buttons. ([#1680](https://github.com/infor-design/enterprise-wc/issues/1680))
- `[Button]` Improved vertical alignment. ([#2079](https://github.com/infor-design/enterprise-wc/issues/2079))
- `[Checkbox]` Fixed required icon placement when checkbox wraps. ([#1983](https://github.com/infor-design/enterprise-wc/issues/1983))
- `[Checkbox]` Fixed checked attribute being set to `false` when checked. ([#2020](https://github.com/infor-design/enterprise-wc/issues/2020))
- `[CheckboxGroups]` Moved component into checkbox component. Fixed bug with `selectedCheckboxes. ([#2021](https://github.com/infor-design/enterprise-wc/issues/2021))
- `[Datagrid]` Converted datagrid tests to playwright. ([#1845](https://github.com/infor-design/enterprise-wc/issues/1845))
- `[DirtyTrackerMixin]` Added `dirty`, `pristine`, `afterresetdirty` events to dirty tracker. ([#2003](https://github.com/infor-design/enterprise-wc/issues/2003))
- `[Datagrid]` Fix so that filter-types that use the integer formatter allow numbers with leading-zero and additional numbers after the leading-zeros. ([#1877](https://github.com/infor-design/enterprise-wc/issues/1877))
- `[Datagrid]` Fix maintaining editable cell text spaces. ([#2069](https://github.com/infor-design/enterprise-wc/issues/2069))
- `[Datagrid]` Fix datagrid bugs found in converted tests. ([#2115](https://github.com/infor-design/enterprise-wc/issues/2115))
- `[Docs]` Fix broken links in README.md files. ([#2147](https://github.com/infor-design/enterprise-wc/issues/2147))
- `[Draggable]` Converted draggable tests to playwright. ([#1929](https://github.com/infor-design/enterprise-wc/issues/1929))
- `[Dropdown]` Fix issue where required dropdowns were note rendering asterisk in React and Angular examples. ([#2023](https://github.com/infor-design/enterprise-wc/issues/2023))
- `[Dropdown]` Fix issue where dropdown wouldn't open in safari via click. ([#2096](https://github.com/infor-design/enterprise-wc/issues/2096))
- `[Dropdown]` Fix issue where tooltips were not shown if options were lazy loaded. ([#2051](https://github.com/infor-design/enterprise-wc/issues/2051))
- `[Dropdown]` Fix displaying preselected value in angular. ([#1880](https://github.com/infor-design/enterprise-wc/issues/1880))
- `[Dropdown]` Prevent Enter key (and other meta keys) from opening the `IdsDropdown`. ([#1878](https://github.com/infor-design/enterprise-wc/issues/1878))
- `[Form]` Converted form tests to playwright. ([#1936](https://github.com/infor-design/enterprise-wc/issues/1936))
- `[Hyperlink]` Fix so that disabled `ids-hyperlink` will no longer fire click events. ([#1849](https://github.com/infor-design/enterprise-wc/issues/1849))
- `[Input]` Converted input tests to Playwright. ([#1943](https://github.com/infor-design/enterprise-wc/issues/1943))
- `[Input]` Fix clearing input value manually. ([#2011](https://github.com/infor-design/enterprise-wc/issues/2011))
- `[Input]` Fix autocomplete popup menu is not closing on select. ([#2072](https://github.com/infor-design/enterprise-wc/issues/2072))
- `[LayoutFlex]` Converted layout flex tests to playwright. ([#1944](https://github.com/infor-design/enterprise-wc/issues/1944))
- `[LayoutGrid/LayoutFlex]` Added missing classes for standalone css. ([#1763](https://github.com/infor-design/enterprise-wc/issues/1763))
- `[LayoutGridCell/Attributes]` Corrected the values of `COL_END_*` constants from `col_start_*` to `col_end_*` along with the test coverage of the `IdsLayoutGridCell`. ([#2075](https://github.com/infor-design/enterprise-wc/issues/2075))
- `[LayoutGridCell]` Fix the minHeight and height attributes to default to px units. ([#2041](https://github.com/infor-design/enterprise-wc/issues/2041))
- `[Lookup]` Fix `IdsLookup` (for Angular) so that modal triggers are attached after the modal has been mounted/constructed. ([#1889](https://github.com/infor-design/enterprise-wc/issues/1889))
- `[Lookup]` Fixed single row selection behavior. ([#1808](https://github.com/infor-design/enterprise-wc/issues/1808))
- `[Modal]` Enable scroll support for content on initial load if scrollable. ([#2049](https://github.com/infor-design/enterprise-wc/issues/2049))
- `[ModuleNav]` Fix icons on `IdsModuleNav` for Angular. ([#1881](https://github.com/infor-design/enterprise-wc/issues/1881))
- `[Pager]` Converted pager tests to playwright. ([#1959](https://github.com/infor-design/enterprise-wc/issues/1959))
- `[Personalization]` Fixed infinite loop on using personalization via an import. ([#2046](https://github.com/infor-design/enterprise-wc/issues/2046))
- `[Searchfield]` Converted form tests to playwright. ([#1969](https://github.com/infor-design/enterprise-wc/issues/1969))
- `[Switch]` Fixed problems setting the value attribute (you should use checked). ([#2045](https://github.com/infor-design/enterprise-wc/issues/2045))
- `[Tree|Splitter]` Fixed horizontal scrollbar showing on tree-grid even after tree is collapsed and no longer in need of scrollbar. ([#1836](https://github.com/infor-design/enterprise-wc/issues/1836))
- `[Tree]` Re-Fixed selected event returning incorrect node data after adding children through addNodes. ([#1851](https://github.com/infor-design/enterprise-wc/issues/1851))
- `[LineChart]` Converted line chart tests to playwright. ([#1946](https://github.com/infor-design/enterprise-wc/issues/1946))
- `[SwipeAction]` Converted swipe action tests to playwright. ([#1976](https://github.com/infor-design/enterprise-wc/issues/1976))

## 1.0.0-beta.22

### 1.0.0-beta.22 Features

- `[Accordion]` Add ability to use custom title in the accordion panel title attribute. ([#1996](https://github.com/infor-design/enterprise-wc/issues/1996))
- `[ActionSheet]` Converted ActionSheet tests. ([#1915](https://github.com/infor-design/enterprise-wc/issues/1915))
- `[AxisChart]` Converted AxisChart tests to Playwright. ([#1918](https://github.com/infor-design/enterprise-wc/issues/1918))
- `[Datagrid]` Add ability (and example) to set editor's column settings from server. ([#1714](https://github.com/infor-design/enterprise-wc/issues/1714))
- `[Dropdown]` Fix issue where required dropdowns were note rendering asterisk in React and Angular examples. ([#2023](https://github.com/infor-design/enterprise-wc/issues/2023))
- `[Input]` Added `checkOverflow()` check to `IdsInput` to ensure only showing tooltip when text-overflow ellipses. ([#1755](https://github.com/infor-design/enterprise-wc/issues/1755))
- `[Lookup]` Fix `IdsLookup` (for Angular) so that modal triggers are attached after the modal has been mounted/constructed. ([#1889](https://github.com/infor-design/enterprise-wc/issues/1889))
- `[NotificationBanner]` Fixes bug where notification-banner's message-attribute was not recognizing dynamic class properties in Angular. ([#1658](https://github.com/infor-design/enterprise-wc/issues/1658))
- `[ProcessIndicator]` Style fix prevent labels and icons from overlapping on initial page-load. ([#1730](https://github.com/infor-design/enterprise-wc/issues/1730))
- `[PopupMenu]` Added ability to load menu data in a callback with `beforeShow`. ([#1804](https://github.com/infor-design/enterprise-wc/issues/1804))
- `[TagList]` Added a new `ids-tag-list` layout and eventing component. ([#1903](https://github.com/infor-design/enterprise-wc/issues/1903))

### 1.0.0-beta.22 Fixes

- `[Accordion]` Converted accordion tests to playwright. ([#1914](https://github.com/infor-design/enterprise-wc/issues/1914))
- `[Calendar]` Fix issue where duplicate "Today" buttons were created if showToday set to true multiple times. ([#2056](https://github.com/infor-design/enterprise-wc/issues/2056))
- `[Card]` Fix selected state styles for dark mode. ([#1887](https://github.com/infor-design/enterprise-wc/issues/1887))
- `[Checkbox]` Converted checkbox tests to playwright. ([#1870](https://github.com/infor-design/enterprise-wc/issues/1870))
- `[Container]` Converted container tests to playwright. ([#1924](https://github.com/infor-design/enterprise-wc/issues/1924))
- `[Counts]` Converted counts tests to playwright. ([#1927](https://github.com/infor-design/enterprise-wc/issues/1927))
- `[Datagrid]` Fixed a display issue with the new loading indicator in firefox. ([#1617](https://github.com/infor-design/enterprise-wc/issues/1617))
- `[Datagrid]` Added custom validation for editable datagrid cells. ([#1791](https://github.com/infor-design/enterprise-wc/issues/1791))
- `[Datagrid]` Converted datagrid tests to playwright. ([#1845](https://github.com/infor-design/enterprise-wc/issues/1845))
- `[Datagrid]` Fix bug that causes duplicate `ids-dropdown-list` when data-grid data is reset. ([#1878](https://github.com/infor-design/enterprise-wc/issues/1878))
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
- `[Editor]` Fix hyperlink action for safari and firefox. ([#982](https://github.com/infor-design/enterprise-wc/issues/982))
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
- `[Toolbar]` Fix so that menu-items in `IdsToolbarMoreActions` can be disabled. ([#2156](https://github.com/infor-design/enterprise-wc/issues/2156))
- `[Tooltip]` The Tooltip component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-tooltip/README.md#converting-from-previous-versions-breaking-changes) for details. ([#124](https://github.com/infor-design/enterprise-wc/issues/124))
- `[Tree]` The Tree component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-treemap/README.md#converting-from-previous-versions-breaking-changes) for details. ([#235](https://github.com/infor-design/enterprise-wc/issues/235))
- `[Treemap]` The Treemap component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-treemap/README.md#converting-from-previous-versions-breaking-changes) for details. ([#369](https://github.com/infor-design/enterprise-wc/issues/369))
- `[Trigger Field]` A new trigger field component has been added. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-trigger-field/README.md) for details. ([#178](https://github.com/infor-design/enterprise-wc/issues/178))
- `[Upload]` The file upload component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-upload/README.md#converting-from-previous-versions-breaking-changes) for details. ([#166](https://github.com/infor-design/enterprise-wc/issues/166))
- `[Upload Advanced]` The file upload advanced component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-upload-advanced/README.md#converting-from-previous-versions-breaking-changes) for details. ([#161](https://github.com/infor-design/enterprise-wc/issues/161))
- `[Week View]` The week view component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-week-view/README.md#converting-from-previous-versions-breaking-changes) for details. ([#371](https://github.com/infor-design/enterprise-wc/issues/371))
- `[Wizard]` The wizard component was converted. See the [README](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-wizard/README.md#converting-from-previous-versions-breaking-changes) for details. ([#126](https://github.com/infor-design/enterprise-wc/issues/126))
