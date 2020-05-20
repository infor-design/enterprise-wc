# IDS Web Components Proof Of Concept

## Getting Started 

```
git clone https://github.com/infor-design/enterprise-wc.git
cd enterprise-wc
npm i 
npm run start
```

At that point the server should open your default browser to http://localhost:4300/

## Task List for this POC

- [x] Create a simple flat(ish) folder structure with one component per folder
- [x] Show an example page per each component
- [x] Include a draft Technical Spec including designs and tests (see README's)
- [x] Include Webpack
- [x] CSS/SASS
  - [x] Add token namespaces for css variables
  - [x] Finish css styling for uplift using functional css and separation
  - [x] Add Sass handling with webpack
  - [ ] List of tokens for the component if needed
  - [x] Change tokens to  use pixels instead of rems
  - [x] Add css style lint
  - [x] Test Custom Fonts 
  - [ ] Solve for theme/modes or whatever they are called 
  - [ ] Evaluate CSSStyleSheet  - With poly fill  https://github.com/Polymer/lit-element/blob/master/src/lib/css-tag.ts
by side
- [ ] Webcomponent 
  - [x] Settings
  - [ ] Make a Base
  - [ ] Create a mixin (Close Mixin)
  - [ ] Event Handlers
  - [ ] Keyboard
  - [x] Linting
  - [ ] Add TS types https://github.com/elix/elix/tree/13.0.0/src/base
  - [ ] What can we do for more flexibility? Hooks?
- [ ] Make a test with the old and new components side 
- Create a LitElement (or some base) which has
  - [ ] Invoked Components - Modal
  - [ ] Locale, Env ect...
  - [ ] Current States
  - [ ] Event Handlers
  - [ ] Rendering / Updating info
- [ ] Css? Grid 
- [x] Typography "Component"
- [ ] Listview Component
- [ ] Add Unit Tests
- [ ] Upgrade Docs
- [ ] Api and example Documentation
- [ ] CSP/Security Scans
- [ ] Localization
- [ ] Right to Left
- [ ] Md Lint and Other linters?
- [ ] Change to node webserver
- [ ] Test Server Side Rendering example
- [ ] Examples in Vue, React and NG
  - https://css-tricks.com/advanced-tooling-for-web-components/ 
  - Use snowpack example projects
- [x] Component Checklist (accessibility, tests ect see General Principals) 

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

## Discoveries and Questions

- You need `<script src="main.js" defer></script>` ?
- How important is the hard requirement for standalone Css?
- How to handle token namespaces?
