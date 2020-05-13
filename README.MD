* IDS Web components Proof Of Concept

** Goals 

- Very simple and Flat Folder Structure (x)
- One Component Per Folder (x)
- Show a Test and Example Pages (x)
- Include a draft Technical Spec (x)
- Include the Designs in the the Technical Spec (x)
- Css / sass 
  - Add Sass handling and external Css Code 
  - Finish Styling to uplift 
  - Change tokens to pixels? 
  - Add token namespaces for css variables
- Push this repo up for share
- Show one example side by side with a 4.x version
- Show some basic Webcomponent Code
  - Settings 
  - Event Handlers
  - Linting
  - Base
  - add TS types https://github.com/elix/elix/tree/13.0.0/src/base
- List of tokens for the component
- Create a LitElement (or some base) which has
  - Invoked Components - Modal
  - Current States
  - Event Handlers
  - Rendering / Updating info
- Include Unit Tests
- Themes
- Examples in Vue, React and NG
  - https://css-tricks.com/advanced-tooling-for-web-components/ 

** General Principals

- Create need Better "Marketing" - convince people to use the stuff without thinking too hard about it
- Make Better Communication Plans - Incident Reports and Release and Change Communication ect.
- Make a Better Support Channel - More helpers ect - Maybe something other than teams?
- We need to Do Tests, Security, Documentation from the start
- Make sure to run veracode from the start
- Make sure to do CSP from the start
- Have accessibility and tests from the start
- All Guidelines for keyboard https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12 and also  http://w3c.github.io/aria-practices/#button

** Js Principals and Standards

Top 3 Articles

1. https://github.com/webcomponents/gold-standard/wiki
2. 
3.

** Css Principals

Top 3 Articles
1. https://blog.webf.zone/on-styling-web-components-b74b8c70c492
2. https://webpack.js.org/loaders/sass-loader/
3.

- Namespaced - ids-
- Linted - Using Sass linter
- Css Variables - For tokens on top and component level
- Keep It Flat - One or two levels (exceptions) selectors MAX
- https://bradfrost.com/blog/post/css-architecture-for-design-systems/
- Smacss - Like abbreviations. -l- for layout, -is- o -has- for states
- Use Standard Guidelines https://cssguidelin.es/

** Webpack Principals

Top 3 Articles 
1. https://vaadin.com/learn/tutorials/using-web-components

** Documentation Principals

Top 3 Articles
1. https://jacobian.org/speaking/writing-great-documentation/

** Test Tools Principals

Top 3 Articles
1. https://dev.to/davert/5-reasons-you-should-not-use-protractor-in-2019-3l4b

Tools to evaluate
- https://webdriver.io/
- https://codecept.io/
- Jest (Stencil Js uses Jest and Puppeteer )

** Other Component Library Examples

https://component.kitchen/elix (source: https://github.com/elix/elix/tree/13.0.0/src/base)
https://vaadin.com/components
https://github.com/vanillawc
https://www.htmlelements.com/demos/tree/overview/
https://boxy-svg.com/app
https://xel-toolkit.org/elements/x-slider

** Discoveries

- Interesting that you need `<script src="main.js" defer></script>`
- How important is the hard requirement for standalone Css?

** Decisions
* https://stenciljs.com/ 
* Webpack vs Rollup - Suggest Webpack
* TS or No? - Suggest no but add Types?
* Use CSSStyleSheet with poly fill? https://github.com/Polymer/lit-element/blob/master/src/lib/css-tag.ts
