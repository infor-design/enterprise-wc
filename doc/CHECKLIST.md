# Task List for Web Components

## General Component Checklist

 - [ ] Accessibility: Create accessible markup at the start and test a screen reader like Chrome Vox. Also pass Axe tests (with some exceptions)
 - [ ] Abstraction: Think about abstraction, does this component needs to be broken down into different smaller components.
 - [ ] Re Use: Try and use existing components and mixins in your component.
 - [ ] Settings/Events/Methods: Look at the old component and cover the most important settings, we will try to not bring all of this over so will spec this out.
 - [ ] Private Methods and Classes: Make anything private that should be with # on the name
 - [ ] Id/Automation Ids: Using the appendIds mixin and test that id's can be added (TBD)
 - [ ] example.index: The main example.html page should just show one simple example and not all variations
 - [ ] test-sandbox.index: The sandbox page should show all other examples in a nicely formatted way.
 - [ ] Standalone Css: Add a basic standalone css example
 - [ ] Right to Left: Test on `lang="ar"` that when flipped all is correct (best way is to use flex and justify)
 - [ ] Locale: Make sure strings are translated, and use number / date / timezone parsers as needed
 - [ ] Side By Side Example: Works in Page with 4.x version
 - [ ] Documentation: Add copious documentation in a README.MD in the folder
 - [ ] TODO: Add a TODO.md for anything needing to be done in the future you think of
 - [ ] Themes: Implement color changes for Themes
 - [ ] Types: In the `d.ts` file add types for all public settings, methods and events
 - [ ] 100% Test Coverage: Add Functional test coverage to 100% or by ignoring coverage on a non testable section
 - [ ] Changelog: Add detailed Upgrade Docs in Changelog discussing any gotchas converting from 4.x
 - [ ] e2e Tests: Add tests for any e2e functionality that cant be accurately tested in the functional tests as well as basic sanity checks, Axe checks and Percy Tests for all 3 themes
 - [ ] Security: We will always pass all [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) guidelines. But the code is setup to error if this fails. Also we will pass security scans like Veracode and Snyk. The biggest issue here is usually XSS.
 - [ ] NG / Vue / React / Svelte / TS Example (we will build this out)
 - [ ] Old Issues: Review Be aware of old and new issues on a component in the [old backlog](https://github.com/infor-design/enterprise/issues)
 - [ ] Add an index.yaml file to expose the examples on the root page for categories it should be one of:

```sh
Form Inputs
Navigation and Interaction
Messages and Alerts
Lists
Layouts
Patterns
Charts and Visualizations
```

## Components To Convert

Will get a checkbox at minimum viable product. The rest of the details are covered in a TODO.md in the individual folder after first commit

 - [x] About (ids-about)
 - [x] Accordion (ids-accordion)
 - [x] Action Sheet (ids-action-sheet)
 - [x] Alerts (ids-alert)
 - [x] Application menu (ids-application-menu)
 - [ ] Area (ids-area-chart)
 - [ ] Autocomplete (ids-autocomplete)
 - [x] Badges (ids-badge)
 - [x] Bar (ids-bar-chart)
 - [x] Block grid (ids-block-grid)
 - [x] Breadcrumb (ids-bread-crumb
 - [ ] Bubble (ids-bubble-chart
 - [ ] Bullet (ids-bullet-chart)
 - [ ] Builder (ids-patterns)
 - [x] Loader (ids-loading-indicator) aka Busy Indicator / Loading Indicator
 - [x] Button (ids-button)
 - [ ] Calendar (ids-calendar)
 - [x] Cards (ids-card)
 - [x] Checkboxes (ids-checkbox)
 - [x] Circle Pager (ids-scroll-view)
 - [x] Color Picker (ids-color-picker)
 - [ ] Column (ids-column-chart or ids-bar with a orientation setting)
 - [x] Completion Chart (ids-progress-chart)
 - [ ] Contextual Action Panel (ids-contextual-action-panel or ids-modal
 - [x] Datagrid (ids-data-grid)
 - [ ] Datepicker (ids-date-picker)
 - [ ] Donut (ids-donut or combined with ids-pie)
 - [x] Drag (ids-draggable)
 - [ ] Dropdown (ids-drop-down)
 - [ ] Editor (ids-editor)
 - [ ] Emptymessage (ids-empty-message)
 - [x] Error Page (ids-page-error)
 - [x] Expandable area (ids-expandable-area)
 - [ ] Fieldset (ids-field-set)
 - [x] Fileupload (ids-file-upload)
 - [x] Fileupload Advanced (ids-file-upload-advanced)
 - [ ] Fontpicker (ids-font-picker)
 - [ ] Form  (ids-form)
 - [x] Grid (ids-layout-grid)
 - [x] Header (ids-header)
 - [x] Hierarchy (ids-hierarchy)
 - [ ] Homepage (ids-homepage)
 - [x] Hyperlinks (ids-hyperlink)
 - [x] Icons (ids-icon)
 - [x] Images (ids-image)
 - [x] Input (ids-input)
 - [ ] Line (ids-line-chart)
 - [x] Listbuilder (ids-list-builder)
 - [x] Listview (ids-list-view)
 - [x] Locale (ids-locale)
 - [x] Lookup (ids-lookup)
 - [x] Mask (ids-mask)
 - [ ] Masthead (ids-masthead)
 - [x] MenuButton (ids-menu-button)
 - [x] Message (ids-message)
 - [x] Modal (ids-modal)
 - [x] Monthview (ids-month-view)
 - [ ] Multiselect (ids-multi-select)
 - [x] Notification (ids-notification)
 - [ ] Page Layouts (ids-page-layout or as individual separate examples)
 - [ ] Page Patterns (ids-page-pattern or as individual separate examples)
 - [x] Pager (ids-pager)
 - [ ] Personalize (ids-personalize or as a mixin on components thats support)
 - [ ] Pie (ids-pie-chart)
 - [x] Popup (ids-popup)
 - [x] Popupmenu (ids-men
 - [ ] Positive Negative (ids-positive-negative-chart)
 - [ ] Radar (ids-radar-chart)
 - [x] Radios (ids-radio)
 - [x] Rating (ids-rating)
 - [x] Renderloop (mixin)
 - [ ] Scatterplot (ids-scatter-plot-chart)
 - [x] Searchfield (ids-search-field)
 - [ ] Sign-in (ids-layouts)
 - [x] Skiplink (ids-skip-link)
 - [x] Slider (ids-slider)
 - [ ] Sparkline (ids-spark-line-chart)
 - [x] Spinbox (ids-spin-box)
 - [x] Splitter (ids-splitter)
 - [x] Stepchart (ids-step-chart)
 - [x] Summary field (ids-summary-field)
 - [ ] Swaplist (ids-swap-list)
 - [x] Switch (ids-switch)
 - [x] Tabs (ids-tabs)
 - [x] Tabs Header (ids-tabs with option)
 - [ ] Tabs Module (ids-tabs with option)
 - [ ] Tabs Multi (ids-tabs with option)
 - [x] Tabs Vertical (ids-tabs with option)
 - [x] Tag (ids-tag)
 - [x] Targeted Achievement (ids-progress-chart)
 - [x] Textarea (ids-text-area)
 - [ ] Timeline (ids-time-line)
 - [x] Timepicker (ids-time-picker)
 - [x] Toast (ids-toast)
 - [x] Toolbar (ids-toolbar)r
 - [x] Tooltip (ids-tooltip
 - [x] Trackdirty (mixin)
 - [x] Tree (ids-tree)
 - [x] Treemap (ids-tree-map)
 - [x] Typography (ids-text)
 - [x] Validation (mixin)
 - [x] Week View (ids-week-view)
 - [x] Wizard (ids-wizard)
