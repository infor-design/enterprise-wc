# Task List for this POC

## Component Checklist

| Component | New Name | Documentation | 100% Test Coverage | Feature Parity | Upgrade Docs | Typings | NG Example | React Example | Vue Example | Standalone Css | Comments |
|----------|------:|:-------------:|------:|------:|------:|------:|------:|------:|------:|------:|------:|
| About | ids-about | | | | | | | | | | |
| Accordion | ids-accordion | | | | | | | | | | |
| Alerts | ids-icon | | | | | | | | | | |
| Applicationmenu | ids-app-menu | | | | | | | | | | |
| Area | ids-area-chart | | | | | | | | | | |
| Arrange | ids-swaplist | | | | | | | | | | |
| Autocomplete | ids-autocomplete | | | | | | | | | | |
| Badges | ids-badge | | | | | | | | | | |
| Bar | ids-bar-chart | | | | | | | | | | |
| Blockgrid | ids-block-grid | | | | | | | | | | |
| Breadcrumb | ids-bread-crumb | | | | | | | | | | |
| Bubble | ids-bubble-chart | | | | | | | | | | |
| Bullet | ids-bulet-chart | | | | | | | | | | |
| Loader | ids-loader | | | | | | | | | | |
| Button | ids-button | x | - | x | - | - | - | - | - | - |
| Calendar | ids-calendar| | | | | | | | | | |
| Cards | ids-card | | | | | | | | | | |
| Checkboxes | ids-checkbox | | | | | | | | | | |
| Circlepager | ids-pager | | | | | | | | | | |
| Colorpicker | ids-color-picker | | | | | | | | | | |
| Column | ids-column-chart / ids-bar | | | | | | | | | | |
| Completion Chart | ids-completion-chart | | | | | | | | | | |
| Contextualactionpanel | ids-contextual-action-panel | | | | | | | | | | Depends on ids-modal |
| Counts | ids-count | | | | | | | | | | |
| Datagrid | ids-data-grid | | | | | | | | | | |
| Datepicker | ids-date-picker | | | | | | | | | | |
| Donut | | | | | | | | | | | |
| Drag | | | | | | | | | | | |
| Dropdown | | | | | | | | | | | |
| Editor | | | | | | | | | | | |
| Emptymessage | | | | | | | | | | | |
| Error Page | | | | | | | | | | | |
| Expandablearea | | | | | | | | | | | |
| Field Filter | | | | | | | | | | | |
| Fieldset  | | | | | | | | | | | |
| Fileupload | | | | | | | | | | | |
| Fileupload Advanced | | | | | | | | | | | |
| Fontpicker | | | | | | | | | | | |
| Form | | | | | | | | | | | |
| Grid | | | | | | | | | | | |
| Header | | | | | | | | | | | |
| Hierarchy | | | | | | | | | | | |
| Homepage | | | | | | | | | | | |
| Hyperlinks | | | | | | | | | | | |
| Icons | | | | | | | | | | | |
| Images | | | | | | | | | | | |
| Input | | | | | | | | | | | |
| Line | | | | | | | | | | | |
| Listbuilder | | | | | | | | | | | |
| Listview | | | | | | | | | | | |
| Locale | | | | | | | | | | | |
| Lookup | | | | | | | | | | | |
| Mask | | | | | | | | | | | |
| Masthead | | | | | | | | | | | |
| Message | | | | | | | | | | | |
| Modal | | | | | | | | | | | |
| Monthview | | | | | | | | | | | |
| Multiselect | | | | | | | | | | | |
| Notification | | | | | | | | | | | |
| Page Layouts | | | | | | | | | | | |
| Page Patterns | | | | | | | | | | | |
| Pager | | | | | | | | | | | |
| Personalize | | | | | | | | | | | |
| Pie | | | | | | | | | | | |
| Place | | | | | | | | | | | |
| Popover | | | | | | | | | | | |
| Popupmenu (ids-menu) | | | | | | | | | | | |
| Positive Negative | | | | | | | | | | | |
| Processindicator | | | | | | | | | | | |
| Progress | | | | | | | | | | | |
| Radar | | | | | | | | | | | |
| Radios | | | | | | | | | | | |
| Rating | | | | | | | | | | | |
| Renderloop | | | | | | | | | | | |
| Scatterplot | | | | | | | | | | | |
| Searchfield | | | | | | | | | | | |
| Signin | | | | | | | | | | | |
| Skiplink | | | | | | | | | | | |
| Slider | | | | | | | | | | | |
| Sparkline | | | | | | | | | | | |
| Spinbox | | | | | | | | | | | |
| Splitter | | | | | | | | | | | |
| Stepchart | | | | | | | | | | | |
| Swaplist | | | | | | | | | | | |
| Switch | | | | | | | | | | | |
| Tabs | | | | | | | | | | | |
| Tabs Header | | | | | | | | | | | |
| Tabs Module | | | | | | | | | | | |
| Tabs Multi | | | | | | | | | | | |
| Tabs Vertical | | | | | | | | | | | |
| Tag | | | | | | | | | | | |
| Targeted Achievement | | | | | | | | | | | |
| Textarea | | | | | | | | | | | |
| Timeline | | | | | | | | | | | |
| Timepicker | | | | | | | | | | | |
| Toast | | | | | | | | | | | |
| Toolbar | | | | | | | | | | | |
| Tooltip | | | | | | | | | | | |
| Trackdirty | | | | | | | | | | | |
| Tree | | | | | | | | | | | |
| Treemap | | | | | | | | | | | |
| Typography | | | | | | | | | | | |
| Validation | | | | | | | | | | | |
| Week View | | | | | | | | | | | |
| Wizard | | | | | | | | | | | |

## Other Things to Look at

- [ ] Localization
- [ ] Solve for versions/modes/themes or whatever they will be called - add a toggle that changes sheet. Make a switcher component and check out [dark mode](https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html) as its doing something clever with the FOUC.
- [ ] What do we need to do with design system ect
- [ ] General API into the MD [Js Doc MD](https://github.com/jaydenseric/jsdoc-md)
- [ ] Add a [core-principles](https://github.com/elix/elix#core-principles) section and update README
- [ ] More on Two way data binding
- [ ] Upgrade Docs
- [ ] Right to Left
- [ ] Attributes (testing Id's)
- [ ] Test a server side Rendering example
- [ ] [Usage statistics](https://github.com/vaadin/vaadin-usage-statistics)
