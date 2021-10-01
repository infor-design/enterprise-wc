# Developing New Components

## Steps for Making a new Web Component for IDS

### Familiarize yourself with Web Components

We have generated a list of [Articles](./ARTICLES.md) about web components and other web component libraries for reference. You probably should learn about concepts like: [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/data/ShadowRoot), [Encapsulation/Scoped Css](https://developers.google.com/web/fundamentals/web-components/shadowdom), [Constructed Style Sheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets), [Sass](https://sass-lang.com/), [Web Component lifecycles](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) and styling in web components.

In general, the Ids WebComponents Library is striving to adhere to the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki), within reason.

Good components to look at that are done already are are IdsTag, IdsAlerts and IdsHyperlink as references.

### Scaffold the component source code

- [ ] Create a folder `/src/ids-[component]`, which will contain all your new component source code.
- [ ] Add an `ids-[component].js`, which is the WebComponent interaction code.
- [ ] Add an `ids-[component].d.ts` for this WebComponent's TypeScript definitions.
- [ ] Add an `ids-[component].scss`, which holds all scoped styles for this WebComponent.
- [ ] Add a `README.md` for documentation, specification, etc.
- [ ] Add a `index.js` that imports whats needed (and only whats needed) to use the component.

See the [checklist](https://github.com/infor-design/enterprise-wc/blob/main/doc/CHECKLIST.md#general-component-checklist) for general steps some of which is explained below.

### Code The Component Javascript

Create an example basic component, for example this code would make a new custom element and web component that extends from our base and has theme and events support and basic structure.

```js
// Import Base and Decorators
import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-[component-name].scss';

/**
 * IDS [Component] Component
 * @type {[IdsComponent]}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
@customElement('ids-[component]')
@scss(styles)
class [IdsComponent] extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    this.#attachEventHandlers();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters and setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.SETTING_NAME
    ];
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template() {
    return '<div class="ids-[component]" part="container"><slot></slot></div>';
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    return this;
  }
}

export default Ids[Component];
```

Each of the steps and code sections are explained here.

- Import the base element and other utilities and decorators from `../ids-base`

```js
import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../../core';
```

- If this new code is an IDS UI Web Component (not a special class or utility ect), ensure that it imports `src/ids-base/ids-element.js` extends the `IdsElement` base component.
- Ensure that your styles are imported from `ids-[component-name].scss` and added to the component via the `@scss` decorator, this will be added into the components shadowRoot by IdsElement.

```js
import styles from './ids-[component-name].scss';
```

- Add some JSDOC containing the mixin names and `parts` (explained further below)

```js
/**
 * IDS [Component] Component
 * @type {[IdsComponent]}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
```

- Add the `customElement` directive, this will ensure that when `ids-[component-name]` is used in the document that this is the code that will execute for it. See [MDN Docs on custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) for more information.

```js
@customElement('ids-[component]')
```

- Review the mixins that are available in the `src/ids-mixins/README.md` folder for any reusable parts then include them in the `mix(IdsElement).with(`. Some commonly used ones include IdsEventsMix if you need event handlers, and IdsThemeMixin if you your component is visual with colors and needs themes and IdsKeyBoardMixin if your component responds to keyboard inputs.

```js
class [IdsComponent] extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
```

- Add a constructor which is a basic web component requirement. Nothing much should be done in here, this is called when the element is created.

```js
constructor() {
  super();
}
```

- Add a `connectedCallback` this is called when the element is attached to the DOM. You can add any setup functions here and call `super` as some mixins also need the callback and this will call it on them.

```js
connectedCallback() {
  this.#attachEventHandlers();
  super.connectedCallback();
}
```

- If the component has any settings (attributes) then add a static method that returns an array. We make sure all our settings are listed as constants in `src/ids-base/attributes.js`. This helps make things consistent.

```js
  static get attributes() {
    return [
      attributes.SETTING_NAME
    ];
  }
```

- Create a template method that returns a template string which will be the internal markup of the component. You can inject any settings into the string. Some elements should have `part` attributes, these are potential elements an outside developer might want to style and it gives them some access to otherwise encapsulated styles to override. For more info see the [shadow parts spec](https://drafts.csswg.org/css-shadow-parts-1/#part-attr).

```js
template() {
  return '<div class="ids-[component]" part="container"><slot></slot></div>';
}
```

- Make any custom methods. We usually use `#attachEventHandlers` to setup any event handlers. We use [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) to hide private methods from the end user and cleanup the API.

```js
  #attachEventHandlers() {
    return this;
  }
}
```

- Export the component (usually as default)

```js
export default Ids[Component];
```

### Add a new app example for the new component

Note that when first adding new HTML files or renaming, a restart on the webpack compiler will be needed for it to be visitable.

- [ ] Create a folder at `app/ids-[component]`, which will hold the markup for the demos
- [ ] Add an `example.html`, which contains the basic example template for your component. In the markup make a H1 tag and wrap your component in the layout grid. For example:

```html
<ids-layout-grid>
  <ids-text font-size="12" type="h1">Component</ids-text>
</ids-layout-grid>
<ids-layout-grid>
  <ids-layout-grid-cell>
   <ids-component>
      Dom Contents
    </ids-component>
  </ids-layout-grid-cell>
</ids-layout-grid>
```

- [ ] Add an `index.html`, which is the main layout template found at `app/ids-[component]`.
- [ ] `index.html` will contain the contents of `example.html` but also includes the dev server's header and footer partials.  It looks like the following:

```handlebars
{{> ../layouts/head.html }}
{{> example.html }}
{{> ../layouts/footer.html }}
```

We have several head layouts available:

`head.html` - The default and most common one. Has a theme switcher and the container has 8px padding. The container is hidden initially to avoid FOUC.
`head-no-padding.html` - The default and most common one. Has a theme switcher and the container has 0 padding, to demo full page components. The container is hidden initially to avoid FOUC.
`head-side-by-side.html` - Used for the side-by-side examples and adds the 4.x version in for testing side by side. It has no container.
`head-themeless.html` - Has no theme switcher and the container has 8px padding. The container is hidden initially to avoid FOUC.
`head-visible.html` - The container is visible initially and has 8px padding.

- [ ] Add an `index.js` for loading and building the component, this should just contain what is needed for the component itself to run. This is also going to be used to create the usable component in the final build.
- [ ] In the root `index.js`, import the WebComponent's source file that you've created using a relative path, where the root component is the default export along with any sub components beyond that.

```js
import IdsComponent, { IdsSubcomponent1, IdsSubcomponent2 } from '../../src/components/ids-[component]';
```

- [ ] Add an `example.js` for any demo code in the example.html (if needed)

### Add new information to `webpack.config.js`

The Entry and HTMLWebPack element are now auto added and picked up on script load. You may need to restart the server or use `npm run start` if you don't see your contents reload.

### Code the Sass/JS

Now that you have a `ids-[component].scss`, which holds all scoped styles for the WebComponent. You can begin to style it. There are several concepts to know and several selectors to learn about.

- Currently we use [constructed style sheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) on chrome where its supported and on safari and firefox the style sheet is appended a `style` tag.
- The web component base will take the first child of the shadowRoot template and label it a container. In the web component you can access it with `this.container` but also this should get the root styles. For example if the component is called `component` it should get a class `ids-component`. This will make it easier to create the standalone css examples. These are examples that have a minimal amount of usable css and markup for the component  that could be used from the style sheet alone. Think about what you can expose thats useful.
- We use a `Mixin Style` for properties that come from our design repo's tokens. For a complete list see [the file in node_modules](../node_modules/ids-identity/dist/theme-new/tokens/web/theme-new-mixins.scss). Any of these should be used over standard css for consistency and to follow our standards. For example:

```scss
.ids-component {
  @include antialiased();
  @include bg-slate-20();
  @include border-1();
  @include border-slate-20();
  @include border-solid();
  @include font-sans();
}
```

- If you need any colors or any properties from the design repo tokens you should import base on the first line

```scss
@import '../../core/ids-base';
```

- Use tools like css flex and css grid to do layouts. In addition when checking RTL try and do it in a way with css that does not require additional css when the page is RTL. The best approach is to try and make your css work either direction before resorting to resets. One simple one is to put the same margin or padding or other positional css on both sides. One useful technique is to use css grid / flex with `end` or `flex-end`. This automatically works in RTL mode without trying to negate anything.

```scss
// On Parent
display: grid;
grid-auto-flow: column;
// On Child
justify-self: end;
```

```scss
display: flex;
flex-direction: row;
justify-content: flex-end;
```

- Get to know the following css concepts for web components [:host](https://developer.mozilla.org/en-US/docs/Web/CSS/:host()) and [:slotted](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted)

### Code the Docs/README.md

For a component you should have a readme with several sections. See tag/hyperlink ect for some examples. In looking for docs try to review and improve the previous docs. We want to combine the previous docs from the [design site product section](https://design.infor.com/product) and [design site components  readme](https://github.com/infor-design/enterprise/blob/main/src/components/circlepager/readme.md)  review whats there for the previous component and leverage the copy. The key is to be concise yet detailed at the same time.

The following sections are the most important:

#### Description

Add a brief description of what the component is, what it can do and its main features in an advertisement for it sort of way.

#### Use Cases

Add a list of typical uses for the component and possibly some "do not use" situations.

#### Terminology

Add a list of any terms surrounding the component you should define for the reader or any other similar names for the component.

#### Features (With Code Examples)

Show the scenarios and code setup that are typical for common uses.

#### Settings and Attributes

Add the setters/and getters that work on the component. This does repeat the `d.ts` file to a degree.

#### States and Variations

Add the different states and variations the component may have that are worth considering.

#### Keyboard Guidelines

Add all the keys and key combinations the component will respond to.

#### Mobile Guidelines

Add anything of consideration for mobile devices.

#### Designs

Add a link to the [design doc](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)

#### Converting from Previous Versions

Add detailed but concise info on converting from previous version.

#### Accessibility Guidelines

Add detailed info on accessibility both from the point of view of how the component works with it and anything the developers should know. Only public methods, events and settings should be mentioned, no need to add anything else. Familiarize yourself with [every day types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

Example of a setting with an enum note that we try to use single line comments with the first letter capitalized:
```js
/** Set the tag type/color */
color: 'secondary' | 'error' | 'success' | 'caution' | string;
```

Example of a boolean type:
```js
/** Add a dismissible x button to the tag */
dismissible: boolean;
```

Example of a public method:
```js
/** Dismiss a dismissible tag */
dismiss(): void;
```

Example of an event:
```js
/** Fires before the tag is removed, you can return false in the response to veto. */
on(event: 'beforetagremove', listener: (detail: IdsTagEventVetoable) => void): this;
```

#### Regional Considerations

Add info on what behaviors or considerations the developer needs to know regarding when running in different languages.

### Code the Types

We include type `d.ts` files for typescript users so that they can get the typings for events, settings and public methods. These three things should be added to the types. Review the current examples

### Code the Tests

#### What to test

- Test the settings for all settings and test both setting the attribute and the js setting
- Any api functions for input/result
- Any external event handlers fire
- Aim for 100% test coverage in the functional tests
- Basic e2e tests including Axe and Percy tests

#### Code the functional tests

First run `npm run test:coverage` and then open up the file at `coverage/index.html` to see the lacking coverage. We want all the columns to have 100%. With this page you can drill into the component and see whats lacking.

Create a folder in `tests/component-name` with the file `test/component-name/component-name-func-test.js` and wire it to import the component and any supporting html and inserts that into the page in beforeEach.

Note that sometimes you need to import the component itself and not the markup so that the web component API works in jest. And also make sure to set the innerHTML of the body in afterEach to cleanup after so no other tests can be impacted. For example:

```js
import IdsTag from '../../src/components/ids-tag';

describe('IdsTag Component', () => {
  let tag;

  beforeEach(async () => {
    const elem = new IdsTag();
    document.body.appendChild(elem);
    tag = document.querySelector('ids-tag');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });
```

Add a test that checks if the component errors out. Basically this test watches for errors and then while watching append your component and check there are no errors. For example:

```js
  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTag();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-tag').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });
```

Add a test that adds a [jest snapshot](https://jestjs.io/docs/snapshot-testing) for this test you can either test the outerHTML or the shadowRoot's html depending whats more important.

```js
  it('renders correctly', () => {
    expect(scrollView.shadowRoot.innerHTML).toMatchSnapshot();
  });
```

Then for each setting add a test that sets all settings via the JS api.

```js
  it('renders danger from the api', () => {
    tag.color = 'danger';
    expect(tag.getAttribute('color')).toEqual('danger');
    expect(tag.color).toEqual('danger');
  });
```

Sets each setting from the settings and responds to the update accordingly.

```js
  it('renders danger from the api', () => {
    tag.getAttribute('color', 'danger');
    expect(tag.getAttribute('color')).toEqual('danger');
    expect(tag.color).toEqual('danger');
  });
```

Can reset each setting to the default.

```js
it('renders danger from the api', () => {
  tag.color = 'danger';
  tag.color = '';
  expect(tag.getAttribute('color')).toEqual('default');
  expect(tag.color).toEqual('default');
});
```

Can add a test for keyboard handlers

```js
it('dismisses on backspace/delete', () => {
  tag.dismissible = true;
  const event = new KeyboardEvent('keydown', { key: 'Backspace' });
  tag.dispatchEvent(event);
  expect(document.querySelectorAll('ids-tag').length).toEqual(0);
});
```

Then recheck coverage and tests the rest of the functionality. Like events and methods ect (see other tests for details). As a tip if trying to finish the coverage on a component you cant run `npx jest --coverage -- component-name-func` to run just the tests quickly for a component and then target the coverage that way for that one component.

You may need to add ignores for some situations because jest runs in JSDOM which is virtual it cant do somethings. Some of these cases is RenderLoops, MutationObserver, ResizeObserver, IntersectionObserver ect. To do this add `/* istanbul ignore next */` to the line before or before the function. For example:

```js
/* istanbul ignore next */
this.timer = this.rl?.register(new IdsRenderLoopItem({
  duration: 500,
  timeoutCallback: () => {
    isClick = false;
    this.timer?.destroy(true);
    this.timer = null;
  }
}));
```

You also might need to debug tests. More information on that [can be found here.](https://github.com/infor-design/enterprise-wc/blob/main/doc/TESTING.md#debugging-functional-tests)

#### Code the e2e tests

We add a basic e2e test that loads the page and does any testing that cannot be done with jest/JSDOM. Keep in mind e2e tests aren't covered in coverage. Some of the things we do in e2e tests. Run the e2e tests only with `npm run test:ui` or `npx jest -- component-name-e2e`.

Add basic loading test.

```js
it('should not have errors', async () => {
  await expect(page.title()).resolves.toMatch('IDS Scroll View Component');
});
```

Add axe test.

```js
it('should pass Axe accessibility tests', async () => {
  await page.setBypassCSP(true);
  await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  await expect(page).toPassAxeTests();
});
```

Note that you can ignore some rules if they do not make sense. For example some designs might not be accessible for color contrast.

```js
await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'aria-required-children', 'aria-required-parent'] });
```

In the future we will add many more e2e tests, including tests for BDD (test steps for QA).

### Additional Steps

See the [checklist](https://github.com/infor-design/enterprise-wc/blob/main/doc/CHECKLIST.md#general-component-checklist) for additional steps.

#### Code the percy tests

We use [percy](https://percy.io/) for visual regression tests. Its a simplified process for visual images regression testing. You should add one test per component per theme (new theme only). We have a limit of 100,000 screen shots. So be aware of this. Each time you push small updated it can effect the count once you PR. Add the `skip-ci-tests` label or close your PR and reopen it if its not ready for review and you keep adding fixes. For these tests the name of the file is `ids-component-name-percy-test.js`. These tests run on the CI when you do pull requests. Check the checks for results once you push.

A percy tests sets the theme and takes a screen shot. Note the file name  and theme convention in the `percySnapshot` command and looks like this:

```js
it('should not have visual regressions in new dark theme (percy)', async () => {
  await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  await page.evaluate(() => {
    document.querySelector('ids-theme-switcher').setAttribute('mode', 'dark');
  });
  await percySnapshot(page, 'ids-scroll-view-new-dark');
});
```

## Component Standards

### General Guidelines

In general, the Ids WebComponents Library is striving to adhere to the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki), within reason.

Another major goal of the WebComponents library is to be accessibility-ready, as much as possible without accounting for actual application content, which is up to application developers. To accomplish this goal, our components adhere to the latest [WAI-ARIA Specification](https://www.w3.org/TR/wai-aria-practices-1.1) wherever possible.

Additionally, it's our desire to ensure final releases of the WebComponents library have 100% test coverage.  Adding to and/or modifying any existing components in a pull request should usually be accompanied by tests that cover the changes. See our [Testing Documentation](./TESTING.md) for more information.

### HTML Standards

As with most modern web applications, the WebComponents library is developed against the latest [HTML5 Specification](https://html.spec.whatwg.org/). The components will follow the rules established for standard HTMLElements as much as possible, with a handful of exceptions detailed here.

#### Boolean Attributes

Some HTMLElement types support boolean attributes, such as `disabled`.  [The specification](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes) describes these attributes functioning in the following way:

- The presence of the attribute will evaluate as `true`.
- The absence of the attribute will evaluate as `false`.
- If the attribute is present, its string value does not matter, and will always mean `true`.

Ids WebComponents take the added step of evaluating the string value, and will cause a string value of `"false"` to actually evaluate as `false`, removing the attribute and property -- this will need to be checked via `stringUtils.stringToBool`, but it is a good idea to consider the web spec for future components and omit properties for flags meaning false.

#### Private Class Fields and Methods

We added Stage 3 [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) this will help clean up the internal API and prevent developers from using the wrong or private methods.

Basically any fields or methods should add the # in front to make it private. This will make it so it can't be called externally.

Decided not to make either the `connectedCallback` nor `template` events private as the former is a lifecycle event in web components and the template may need to be overridable in some cases for flexibility.

For an example see IdsTag, IdsAccordion.
