# Developing New Components

## Steps for Making a new Web Component for IDS

### Familiarize yourself with Web Components

We have generated a list of [Articles](./ARTICLES.md) about web components and other web component libraries for reference. You probably should learn about concepts like: [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/data/ShadowRoot), [Encapsulation/Scoped Css](https://developers.google.com/web/fundamentals/web-components/shadowdom), [Constructed Style Sheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets), [Sass](https://sass-lang.com/), [Web Component lifecycles](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) and styling in web components.

In general, the Ids WebComponents Library strived to adhere to the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki), within reason.

Good reference components to look at that are done already are are IdsTag, IdsAlerts and IdsHyperlink as references.

### Understand some of our concepts

### Inheritance

Some the components by design and functionality should inherit from another one. Examples like this are cases like buttons. A button might have a base button and you extend it to provide other button types. Other cases are modals, where we have an about and message type modal that extends it. For this project we are talking mostly about [Class Inheritance](https://javascript.info/class-inheritance)

### Utils

Utils are sets of [pure functions](https://www.geeksforgeeks.org/pure-functions-in-javascript/) that provide a simple shared function for some functionality. Usually some sort of input/output processing.

Current mixins are documented here `src/utils/README.md`. Some commonly used ones include `IdStringUtils`, `IdsXssUtils`.

### Mixins

The mixin pattern - as the name suggests - is a pattern of mixing together an object with other objects to add properties we need. Think of it like add-ons that can give your object additional properties, but these individual properties are not really subclasses themselves.

The type of things that you should make mixins are shared functionality that could be used across more than one component. Sometimes we don't know this right away so its possible to refactor some functionality to use that pattern and a certain point.

Current mixins are documented here `src/mixins/README.md`. Some commonly used ones include are IdsEventsMix, IdsKeyBoardMixin.

### Scaffold the component source code

- [ ] Create a folder `/src/ids-component-name`, which will contain all your new component source code.
- [ ] Add an `ids-component-name.js`, which is the WebComponent interaction code.
- [ ] Note that `ids-component-name.d.ts` will be generated automatically by the TypeScript compiler.
- [ ] Add an `ids-component-name.scss`, which holds all scoped styles for this WebComponent.
- [ ] Add a `README.md` for documentation, specification, etc.
- [ ] Add a `index.js` that imports whats needed (and only whats needed) to use the component.

See the [checklist](https://github.com/infor-design/enterprise-wc/blob/main/doc/CHECKLIST.md#general-component-checklist) for general steps some of which is explained below.

### Code The Component Javascript

Create an example basic component, for example this code would make a new custom element and web component that extends from our base and has theme and events support and basic structure.

```js
// Import Base and Decorators
import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';

// Import the mixins if only a few can move this down to the class definition
const Base = IdsEventsMixin(
    IdsElement
    );

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-[component-name].scss';

/**
 * IDS Component Name Component
 * @type {[IdsComponent]}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the container element
 */
@customElement('ids-component-name')
@scss(styles)
class [IdsComponent] extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
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
    return '<div class="ids-component-name" class="${this.settingName}" part="container"><slot></slot></div>';
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    return this;
  }

  set settingName(value: string) {
    if (value) {
      this.setAttribute(attributes.SETTING_NAME, value.toString());
    } else {
      this.removeAttribute(attributes.SETTING_NAME);
    }

    if (this.container) {
      if (value) {
        this.container.classList.add(attributes.SETTING_NAME);
      } else {
        this.container.classList.remove(attributes.SETTING_NAME);
      }
    }
  }

  get settingName(): string { return this.getAttribute(attributes.DISMISSIBLE); }
}

export default IdsComponentName;
```

Each of the steps and code sections are explained here.

- Import the base element and other utilities and decorators from `../ids-base`

```js
import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
```

- If this new code is a UI Web Component (not a special class or utility ect), ensure that it imports `src/ids-base/ids-element.js` extends a Base element that is established in a `ids-[component-name]-base.js` file
- Ensure that your styles are imported from `ids-[component-name].scss` and added to the component via the `@scss` decorator, this will be added into the components shadowRoot by IdsElement.

```js
import styles from './ids-[component-name].scss';
```

- Add some JSDOC containing the mixin names and `parts` (explained further below)

```js
/**
 * IDS Component Name
 * @type {IdsComponentName}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the container element
 */
```

- Add the `customElement` directive, this will ensure that when `ids-[component-name]` is used in the document that this is the code that will execute for it. See [MDN Docs on custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) for more information.

```js
@customElement('ids-component-name')
```

- Review the mixins that are available in the `src/ids-mixins/README.md` folder for any reusable parts then import them and mix them into the class constructor as Base. Some commonly used ones include IdsEventsMix if you need event handlers, and IdsKeyBoardMixin if your component responds to keyboard inputs.

```js
class [IdsComponent] extends Base {
```

- Add a constructor which is a basic web component requirement. Nothing much should be done in here, this is called when the element is created.

```js
constructor() {
  super();
}
```

- Add a `connectedCallback` this is called when the element is attached to the DOM. You can add any setup functions here and call `super` as some mixins also need the callback and this will call it on them. This is needed for any mixins that call super themself. But is safe to always do it if you need code in `connectedCallback`. In the component lifecycle the following callbacks/events are fired  in the following order:

```js
constructor() // setters or called with no container or shadowRoot
connectedCallback() // container / shadowRoot is established and added to DOM
```

Example:
```js
connectedCallback() {
  super.connectedCallback();
  this.#attachEventHandlers();
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

- Create a template method that returns a template string which will be the internal markup of the component. You can inject any settings into the string. Some elements should have `part` attributes, these are potential elements an outside developer might want to style and it gives them some access to otherwise encapsulated styles to override. For more info see the [shadow parts spec](https://drafts.csswg.org/css-shadow-parts-1/#part-attr). Its important to reflect all the settings in the template for the initial render.

```js
template() {
  return '<div class="ids-component-name" class="${this.settingName}" part="container"><slot></slot></div>';
}
```

- Make any custom methods. We usually use `#attachEventHandlers` to setup any event handlers. We use [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) to hide private methods from the end user and cleanup the API.

```js
  #attachEventHandlers() {
    return this;
  }
}
```

- Add a getter/setter for each properties. You should always consider the attributes in two ways:
  - read in the template for initial render
  - in the setter to adjust for setting later

```js
set settingName(value: string) {
    if (value) {
      this.setAttribute(attributes.SETTING_NAME, value.toString());
    } else {
      this.removeAttribute(attributes.SETTING_NAME);
    }

    if (this.container) {
      if (value) {
        this.container.classList.add(attributes.SETTING_NAME);
      } else {
        this.container.classList.remove(attributes.SETTING_NAME);
      }
    }
}

get settingName(): string { return this.getAttribute(attributes.DISMISSIBLE); }
```

- Export the component (usually as default)

```js
export default IdsComponentName;
```

### Add a new app example for the new component

Note that when first adding new HTML files or renaming, a restart on the webpack compiler will be needed for it to be visitable.

- [ ] Create a folder at `app/ids-component-name`, which will hold the markup for the demos
- [ ] Add an `example.html`, which contains the basic example template for your component. In the markup make a H1 tag and wrap your component in the layout grid. For example:

```html
<ids-layout-grid>
  <ids-text font-size="12" type="h1">Component</ids-text>
</ids-layout-grid>
<ids-layout-grid>
  <ids-layout-grid-cell>
   <ids-component-name>
      Dom Contents
    </ids-component-name>
  </ids-layout-grid-cell>
</ids-layout-grid>
```

- [ ] Add an `index.html`, which is the main example `app/ids-component-name`. See other files for the general html structure.
- [ ] Add an `index.js` for loading and building the component, this should just contain what is needed for the component itself to run. This is also going to be used to create the usable component in the final build.
- [ ] In the root `index.js`, import the WebComponent's source file that you've created using a relative path, where the root component is the default export along with any sub components beyond that.

```js
import IdsComponent, { IdsSubcomponent1, IdsSubcomponent2 } from '../../src/components/ids-component-name';
```

- [ ] Add an `example.js` for any demo code in the example.html (if needed)

### Add new information to `webpack.config.js`

The Entry and HTMLWebPack element are now auto added and picked up on script load. You may need to restart the server or use `npm run start` if you don't see your contents reload.

### Code the Sass/JS

Now that you have a `ids-component-name.scss`, which holds all scoped styles for the WebComponent. You can begin to style it. There are several concepts to know and several selectors to learn about.

- The web component base will take the first child of the shadowRoot template and label it a container. In the web component you can access it with `this.container` but also this should get the root styles. For example if the component is called `component` it should get a class `ids-component`. This will make it easier to create the standalone css examples. These are examples that have a minimal amount of usable css and markup for the component  that could be used from the style sheet alone. Think about what you can expose thats useful.
- We use a series of design tokens that comes from the themes folder. See the `ids-theme-default-core.scss` file for a list of all of them.

```scss
.ids-component {
  @include mixins.antialiased();

  font-family: var(--ids-font-family-default), var(--ids-font-family-system-sans);
}
```

- Try to make tokens for all the visual aspects of the component. Use design side tokens for the right side.
- Use tools like css flex and css grid to do layouts. In addition when checking RTL try and do it in a way with css that does not require additional css when the page is RTL. The best approach is to try and make your css work either direction before resorting to resets. One simple one is to put the same margin or padding or other positional css on both sides. One useful technique is to use css grid / flex with `end` or `flex-end`. This automatically works in RTL mode without trying to negate anything. Also use `margin-inline-start` `margin-inline-end` `margin-block-start` `margin-block-end` `padding-inline-start` `padding-inline-end` `padding-block-start` `padding-block-end` so it works on RTL better.

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

For a component you should have a readme with several sections. See tag/hyperlink ect for some examples. In looking for docs try to review and improve the previous docs. We want to combine the previous docs from the [design site product section](https://design.infor.com/product) and [design site components readme](https://github.com/infor-design/enterprise/blob/main/src/components/circlepager/readme.md) review whats there for the previous component and leverage the copy. The key is to be concise yet detailed at the same time.

The following sections are the most important:

#### Description

Add a brief description of what the component is, what it can do and its main features in an advertisement for it sort of way.

#### Use Cases

Add a list of typical uses for the component and possibly some "do not use" cases.

#### Terminology

Add a list of any terms surrounding the component you should define for the reader or any other similar names used within the component concepts.

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

Add a link to the [design doc](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771&t=Hn2ppFMeWdP3xPLC-0)

#### Converting from Previous Versions

Add detailed but concise info on converting from previous version.

#### Accessibility Guidelines

Add detailed info on accessibility both from the point of view of how the component works with it and anything the developers should know.

#### Methods / Events / Settings

Only public methods, events and settings should be mentioned, no need to add anything else. Familiarize yourself with [every day types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

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

### Code the Tests

For info on testing see [testing.md](https://github.com/infor-design/enterprise-wc/blob/main/doc/TESTING.md)

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

#### Checking for memory leaks

The general idea is that when removing and adding components from the page they shouldn't leak. One type of leak is detached nodes. The best way to manually test for this is:

- Go to the page in chrome
- Open Dev tools
- Go to the memory tab
- Take a `Heap Snapshot`
- Remove and add back the component (delete and recreate). Can do this once or several times.
- Take a `Heap Snapshot` again
- Select Comparison in the dropdown to compare snap 1 and snap 2
- Search to filter on detach or name of the component
- look for any + on the deltas column (this means some new ones are added and not deleted)
