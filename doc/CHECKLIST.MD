## Task List for this POC

- [x] Create a simple flat(ish) folder structure with one component per folder
- [x] Show an example page per each component
- [x] Include a draft Technical Spec including designs and tests (see README's)
- [x] Include Webpack
- [x] CSS/SASS
  - [x] Add token namespaces for css variables
  - [x] Finish css styling for uplift using functional css and separation
  - [x] Add Sass handling with webpack
  - [ ] List of tokens for the component if needed or how to handle tag tokens?
  - [x] Change tokens to  use pixels instead of rems
  - [x] Add css style lint
  - [x] Test Custom Fonts
  - [x] Show side by side with current tags -> as expected its problematic on the soho side
  - [ ] Test initialize
  - [ ] Solve for theme/modes or whatever they are called
  - [ ] Evaluate CSSStyleSheet  - With poly fill  https://github.com/Polymer/lit-element/blob/master/src/lib/css-tag.ts
  - [ ] https://github.com/FullHuman/purgecss and https://tailwindcss.com (add a tailwind config to ids tokens)
by side
- [ ] Webcomponent
  - [x] Settings
  - [x] Create a a base and look at LitElement
    - [x] Invoked Components - Modal (we dont need this)
    - [ ] Locale, Env ect...
    - [ ] Current States
    - [ ] Event Handlers
    - [ ] Rendering / Updating info
  - [x] Create decorators
  - [ ] Create a mixin (Close Button Mixin) https://vaadin.com/docs/v14/flow/creating-components/tutorial-component-mixins.html
  - [ ] Event Handlers
  - [ ] Keyboard
  - [x] Linting
  - [ ] Add TS types https://github.com/elix/elix/tree/13.0.0/src/base
  - [ ] What can we do for more flexibility? Hooks?
  - [ ] Ability to set Id's
  - [ ] Locales to set Id's
- [x] Add a Css Grid
- [x] Typography "Component"
- [ ] Listview Component
  - [ ] Make a Datasource
  - [ ] Handle Tokens
  - [ ] Expose listview "pieces"
  - [ ] Make infinite scrolling https://developers.google.com/web/updates/2016/07/infinite-scroller
- [ ] Toast Component
  - [ ] https://github.com/elix/elix/blob/13.0.0/src/base/Toast.js
  - [ ] https://github.com/elix/elix/blob/13.0.0/src/base/Toast.js
- [ ] Add Unit Tests (evaluate)
  - [ ] https://webdriver.io/
  - [ ] https://codecept.io/
  - [ ] https://docs.cypress.io/
  - [ ] Jest (Stencil Js uses Jest and Puppeteer (or just Puppeteer like elix))
  - [ ] Travis
- [ ] Upgrade Docs
- [ ] Api and example Documentation
- [ ] CSP/Security Scans
- [ ] Localization
- [ ] Right to Left
- [ ] Md Lint and Other linters?
- [ ] Change to node webserver
- [ ] Test a server side Rendering example
- [ ] Examples in Vue, React and NG
  - [ ] https://css-tricks.com/advanced-tooling-for-web-components/
  - [ ] Use snowpack example projects
- [x] Component Checklist (accessibility, tests ect see General Principals)

# Component Status Checklist

| Component               | Code        | Docs         | Tests      | Accessibility | Gold Standard | Converted |
|-------------------------|-------------|--------------|------------|---------------|---------------|-----------|
| Css Grid                |            -|             -|           -|              -|              -|          -|
| Icons                   |            -|             -|           -|              -|              -|          -|
| Labels                  |            -|             -|           -|              -|              -|          -|
| Listview                |            -|             -|           -|              -|              -|          -|
| Tag                     |            -|             -|           -|              -|              -|          -|
| Typograph               |            -|             -|           -|              -|              -|          -|

# Big Questions

1) How do we handle working with other teams in this system. Design / Docs ect
2) How do we handle tokens
3) Standalone Css
