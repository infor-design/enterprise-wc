# Task List for this POC

## Structure/Tools

- [x] Create a simple flat(ish) folder structure with one component per folder
- [x] Show an example page per each component
- [x] Include a draft Technical Spec including designs and tests (see README's)
- [x] Include Webpack
- [x] CSS/SASS
- [x] Add token namespaces for css variables
- [x] Md Lint and Other linters?

## Css

- [x] Finish css styling for uplift using functional css and separation
- [x] Add Sass handling with webpack
- [ ] List of tokens for the component if needed or how to handle tag tokens? Maybe like this?
- [x] Change tokens to  use pixels instead of rems
- [x] Add css style lint
- [x] Test Custom Fonts
- [x] Show side by side with current tags -> as expected its problematic on the soho side
- [x] Test initialize in side by side example
- [ ] Solve for versions/modes or whatever they will be called
- [ ] Evaluate CSSStyleSheet  - With [poly fill](https://github.com/Polymer/lit-element/blob/master/src/lib/css-tag.ts)
- [ ] Try to include [tailwind](https://tailwindcss.com) (add a tailwind config to ids tokens) by side
- [ ] Change to node webserver
- [ ] Test a server side Rendering example

Idea for including tokens.. As a list

```json
    {
        "tag": {
            "attributes": {
                "prop1": "value",
                "prop2": "value",
                "prop3": "value",
                "prop4": "value",
            }
        }
    }
```

## Webcomponent Code
- [x] Settings
- [x] Create a a base and look at LitElement
- [x] Invoked Components - Modal (we dont need this)
- [ ] Event Handlers and Omitters
- [ ] Keyboard Handling
- [ ] Locale, Env ect...
- [x] Create decorators
- [ ] Create a mixin [Close Button Mixin](https://vaadin.com/docs/v14/flow/creating-components/tutorial-component-mixins.html)
- [ ] Event Handlers
- [ ] Keyboard
- [x] Linting
- [ ] Add TS types [for example](https://github.com/elix/elix/tree/13.0.0/src/base)
- [ ] What can we do for more flexibility? Hooks? Mixins
- [ ] Ability to set Id's
- [ ] Locales to set Locales
- [ ] Examples in Vue, React and NG Use snowpack example projects
- [ ] Right to Left
- [ ] Upgrade Docs
- [ ] Api and example Documentation
- [ ] CSP/Security Scans
- [ ] Localization
- [ ] FOUC

## Other Components
- [x] Add a Css Grid
- [x] Typography "Component"
- [ ] Listview:  Component
- [ ] Listview:  Make a Datasource
- [ ] Listview:  Handle Tokens
- [ ] Listview: Expose listview "pieces"
- [ ] Listview Make infinite scrolling [for example](https://developers.google.com/web/updates/2016/07/infinite-scroller)
- [ ] Toast Component [for example](https://github.com/elix/elix/blob/13.0.0/src/base/Toast.js)

## Test Tools
- [ ] Evaulate Test Tools: [Webdriver.IO](https://webdriver.io/)
- [ ] Evaulate Test Tools: [codecept](https://codecept.io/)
- [ ] Evaulate Test Tools: [cypress](https://docs.cypress.io/)
- [ ] Evaulate Test Tools: Jest (Stencil Js uses Jest and Puppeteer (or just Puppeteer like elix))
- [ ] Travis
