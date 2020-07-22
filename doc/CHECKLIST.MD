# Task List for this POC

## Structure/Tools

- [x] Create a simple flat(ish) folder structure with one component per folder
- [x] Show an example page per each component
- [x] Include a draft Technical Spec including designs and tests (see README's)
- [x] Include Webpack
- [x] CSS/SASS
- [x] Add token namespaces for css variables
- [x] Md Lint and Other linters?
- [ ] [Usage statistics](https://github.com/vaadin/vaadin-usage-statistics)

## Css

- [x] Finish css styling for uplift using functional css and separation
- [x] Add Sass handling with webpack
- [ ] List of tokens for the component if needed or how to handle tag tokens
- [ ] Generate the mixin functions from settings in design system
- [x] Change tokens to  use pixels instead of rems
- [x] Add css style lint
- [x] Test Custom Fonts
- [x] Show side by side with current tags -> as expected its problematic on the soho side
- [x] Test initialize in side by side example
- [ ] Solve for versions/modes/themes or whatever they will be called
- [ ] Evaluate CSSStyleSheet  - With [poly fill](https://github.com/Polymer/lit-element/blob/master/src/lib/css-tag.ts)
- [x] Try to include [tailwind](https://tailwindcss.com) (add a tailwind config to ids tokens) by side
- [ ] Change to node webserver
- [ ] Test a server side Rendering example

Idea for including tokens.. As a list

```json
    {
        "rounded": "rounded-md",
        "border": " border-graphite-20",
    }
```

```json for component structure
    {
        "tag": {
            "rounded": "rounded-md",
            "border": " border-graphite-20",
        }
    }
```

## Webcomponent Code
- [x] Settings
- [x] Create a a base and look at LitElement
- [x] Invoked Components - Modal (we dont need this)
- [x] Event Handlers
- [x] Add pattern for even omitting see this [great explanation](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)
- [ ] Keyboard Handling
- [x] Create a mixin [see docs](https://javascript.info/mixins) and [another article](https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c)
- [x] Create decorators
- [x] Event Handlers (mixin)
- [x] FOUC - Done but will add loader when designed
- [x] Linting
- [x] Add TS types [for example](https://github.com/elix/elix/tree/13.0.0/src/base)
- [x] What can we do for more flexibility: use web component live cycle + super, providing slots, making them work with css based on [immediate parent](https://github.com/webcomponents/gold-standard/wiki#styling)
- [x] Ability to set Id's - Just put them on the web components that are actionable
- [ ] Locales
- [ ] Examples in Vue (stackblitz)
- [x] Example in NG (stackblitz)
- [ ] Example in React (stackblitz)
- [ ] Right to Left
- [ ] Upgrade Docs
- [ ] Api and example Documentation
- [x] Security Scans
- [ ] CSP
- [ ] Localization
- [ ] Two way data binding

## Other Components
- [x] Add a Css Grid
- [x] Typography "Component"
- [ ] Listview: Component
- [ ] Listview: Make a Datasource. And check if [redux will work](https://react-redux.js.org/introduction/basic-tutorial) [Handling Data](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e). Dataset can also handle rerender (two way binding)
- [ ] Listview: Handle Tokens
- [ ] Listview: Expose listview "pieces"
- [ ] Listview Make infinite scrolling [for example](https://developers.google.com/web/updates/2016/07/infinite-scroller)
- [ ] Toast Component [for example](https://github.com/elix/elix/blob/13.0.0/src/base/Toast.js)

## Documentation
- [ ] What do we need to do with design system ect
- [ ] General API into the MD [Js Doc MD](https://github.com/jaydenseric/jsdoc-md)
- [ ] Document each component
- [ ] Add a [core-principles](https://github.com/elix/elix#core-principles) section and update README

## Test Tools
- [x] Evaulate Test Tools: [Webdriver.IO](https://webdriver.io/)
- [x] Evaulate Test Tools: [codecept](https://codecept.io/)
- [x] Evaulate Test Tools: [cypress](https://docs.cypress.io/)
- [x] Evaulate Test Tools: Jest (Stencil Js uses Jest and Puppeteer (or just Puppeteer like elix))
