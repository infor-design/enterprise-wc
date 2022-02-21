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
 - [ ] Change log: Add detailed Upgrade Docs in the change log discussing any gotchas converting from 4.x
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
 - [ ] Bar (ids-bar-chart)
 - [x] Block grid (ids-block-grid)
 - [x] Breadcrumb (ids-bread-crumb)
 - [ ] Bubble (ids-bubble-chart)
 - [x] Button (ids-button)
 - [ ] Bullet (ids-bullet-chart) skipping for now
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
 - [x] Contextual Action Panel (ids-contextual-action-panel)
 - [x] Datagrid (ids-data-grid)
 - [x] Datepicker (ids-date-picker)
 - [ ] Donut (ids-donut or combined with ids-pie)
 - [x] Drag (ids-draggable)
 - [ ] Dropdown (ids-drop-down)
 - [x] Editor (ids-editor)
 - [ ] Emptymessage (ids-empty-message)
 - [x] Error Page (ids-page-error)
 - [x] Expandable area (ids-expandable-area)
 - [ ] Fieldset (ids-field-set)
 - [x] Fileupload (ids-file-upload)
 - [x] Fileupload Advanced (ids-file-upload-advanced)
 - [x] Fontpicker (added as part of editor)
 - [ ] Form  (ids-form)
 - [x] Grid (ids-layout-grid)
 - [x] Header (ids-header)
 - [x] Hierarchy (ids-hierarchy)
 - [x] Homepage (ids-homepage)
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

## A bit about TODO's in this project

We have a series of gaps in this project to close in terms of functionality. Some things we may not add due to wanting to deprecate some functionality to clean things up but some we do need to add. Each folder in src for the component may have a TODO file listing all outstanding tasks and features. This document is a check list on how to look at making this list and generating some issues for the tasks to be fixed.

For each component...

- [ ] Make sure CHECKLIST.md is checked off
- [ ] Make sure component is on kitchen sink https://main.wc.design.infor.com/ page and in an appropriate section
- [ ] Run the each example https://main.wc.design.infor.com/<component-name>
- [ ] Compare to examples to https://main-enterprise.demo.design.infor.com/components/<component-name> and make sure everything is covered
- [ ] Check old source and see if any events/methods or settings might be needed
- [ ] Check new settings and types are in `d.ts` and `.md` while testing
- [ ] Add any breaking changes to README.md or anything we don't want to bring over (Converting from Previous Versions)
- [ ] Look in https://github.com/infor-design/enterprise/issues for any unfixed issues and add
- [ ] Fix only super small bugs
- [ ] Check for if standalone css or side-by-side examples are needed and add a TODO
- [ ] Check if RTL is needed
- [ ] Check if themes all work (skip classic ###) - QA Task?
- [ ] Compare Styling to old version - QA Task?
- [ ] Check if keyboard all works - QA Task?
- [ ] Sort the todos in priority and classify as Major/Minor
- [ ] Make sure the todo.md is formatted like the ids-about one (with the sections)
- [ ] Make an issue for one or two todos
- [ ] Make a parent issue for all todos  https://github.com/infor-design/enterprise-wc/issues/499 (estimate as the sum of all sub issues)
- [ ] Update the Change log to be more generic and point to the README.md
