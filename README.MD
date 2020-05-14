# IDS Web Components Proof Of Concept

## Getting Started 

```
mkdir enterprise-wc
cd enterprise-wc
git clone https://github.com/infor-design/enterprise-wc.git .
npm i 
npm run start
```

## Task List for this POC

- [x] Create a simple flat(ish) folder structure with one component per folder
- [x] Show an example page per each component
- [x] Include a draft Technical Spec including designs and tests (see README's)
- [x] CSS/SASS
  - [ ] Finish css styling for uplift using functional css and separation
  - [ ] Add token namespaces for css variables
  - [x] Add Sass handling with webpack
  - [ ] List of tokens for the component if needed
  - [ ] Change tokens to  use pixels instead of rems
  - [ ] Solve for theme/modes or whatever they are called 
  - [ ] Add style lint
by side
- [ ] Webcomponent 
  - [x] Settings
  - [ ] Event Handler
  - [ ] Keyboard
  - [x] Linting
  - [ ] Make a Base
  - [ ] Create a mixin (Close Mixin)
  - [ ] add TS types https://github.com/elix/elix/tree/13.0.0/src/base
- [ ] Make a test with the old and new components side 
- Create a LitElement (or some base) which has
  - [ ] Invoked Components - Modal
  - [ ] Current States
  - [ ] Event Handlers
  - [ ] Rendering / Updating info
- [ ] Css? Grid 
- [ ] Typography Component
- [ ] Listview Component
- [ ] Add Unit Tests
- [ ] Upgrade Docs
- [ ] Api and example Documentation
- [ ] CSP/Security Scans
- [ ] Right to Left
- [ ] Localization
- [ ] Examples in Vue, React and NG
  - https://css-tricks.com/advanced-tooling-for-web-components/ 
  - Use snowpack exmaple projects
- [ ] Component Checklist (accessibility, tests ect see General Principals) 
  - include https://developers.google.com/web/fundamentals/web-components/best-practices#do-not-self-apply-classes

## General Principals

- Make Better "Marketing" - convince people to use the stuff without thinking too hard about it
- Make Better Communication Plans - Incident Reports and Release and Change Communication ect.
- Make a Better Support Channel - More helpers ect - Maybe something other than teams?
- We need to Do Tests, Security, Documentation and Upgrade Docs from the start
- Make sure to run veracode from the start
- Make sure to do CSP from the start
- Make sure to do Linting - Using Sass linter, Html Linter ect
- Have accessibility and tests from the start
- All Guidelines for keyboard https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12 and also  http://w3c.github.io/aria-practices/#button

## Js and Webcomponent Principals and Standards

Top 3 Articles:
1. https://github.com/webcomponents/gold-standard/wiki
2. 
3.

## Css Principals

Top 3 Articles:
1. https://blog.webf.zone/on-styling-web-components-b74b8c70c492
2. https://webpack.js.org/loaders/sass-loader/
3.

- Namespaced - ids-
- Css Variables - For tokens on top and component level
- Keep It Flat - One or two levels (exceptions) selectors MAX
- https://bradfrost.com/blog/post/css-architecture-for-design-systems/
- Smacss - Like abbreviations. -l- for layout, -is- o -has- for states
- Use Standard Guidelines https://cssguidelin.es/

## Webpack Principals

Top 3 Articles:
1. https://vaadin.com/learn/tutorials/using-web-components

## Documentation Principals

Top 3 Articles:
1. https://jacobian.org/speaking/writing-great-documentation/

## Test Tools Principals

Top 3 Articles:
1. https://dev.to/davert/5-reasons-you-should-not-use-protractor-in-2019-3l4b

Tools to evaluate
- https://webdriver.io/
- https://codecept.io/
- Jest (Stencil Js uses Jest and Puppeteer )

## Other Component Library Examples

https://component.kitchen/elix (source: https://github.com/elix/elix/tree/13.0.0/src/base)
https://vaadin.com/components
https://github.com/vanillawc
https://www.htmlelements.com/demos/tree/overview/
https://boxy-svg.com/app
https://xel-toolkit.org/elements/x-slider

## Discoveries

- You need `<script src="main.js" defer></script>` ?
- How important is the hard requirement for standalone Css?

## Decisions
* Webpack vs Rollup - Suggest Webpack
* TS - Suggest no but add Types this is done in a lot of libs like elix
* Use CSSStyleSheet  - With poly fill  https://github.com/Polymer/lit-element/blob/master/src/lib/css-tag.ts
