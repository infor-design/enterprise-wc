# Components

## Adding a new component from scratch

### Scaffold the component source code

- [ ] Create a folder `/src/ids-[component]`, which will contain all your new component source code.
- [ ] Add an `ids-[component].js`, which is the WebComponent interaction code.
- [ ] Add an `ids-[component].d.ts` for this WebComponent's TypeScript defs.
- [ ] Add an `ids-[component].scss`, which holds all scoped styles for this WebComponent.
- [ ] Add a `README.md` for documentation, specification, etc.

Some important steps here include:

- If this new code is an IDS Component, ensure that it imports `src/ids-base/ids-element.js` extends the `IdsElement` base component.
- Ensure that your styles are imported in `ids-[component].js` and added to the component via the `@scss` decorator.
- Review the mixins that are available in the `src/ids-base` folder for any reusable parts then include them with a line like:

```js
class IdsComponent extends mix(IdsElement).with(IdsExampleMixin, IdsExampleMixin2) {
```

### Add a new app example for the new component

- [ ] Add an `example.html`, which contains the basic example template for your component
- [ ] Add an `index.html`, which is the main layout template
- [ ] Add an `index.js` for loading and building the component, this should just contain what is needed for the component itself to run
- [ ] Add an `example.js` for any demo code in the example.html
- [ ] In the root `index.js`, import the WebComponent's source file that you've created using a relative path.

```js
import IdsComponent from '../../src/ids-[component]/ids-[component]';
```

- [ ] `index.html` will contain the contents of `example.html` but also includes the dev server's header and footer partials.  It looks like the following:

```handlebars
{{> ../layouts/head.html }}
{{> example.html }}
{{> ../layouts/footer.html }}
```

### Add new information to `webpack.config.js`

The Entry and HTMLWebPack element are now auto added and picked up on script load. You mean need to restart the server or use `npm run start:watch`

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

Ids WebComponents take the added step of evaluating the string value, and will cause a string value of `"false"` to actually evaluate as `false`, removing the attribute and property.

#### Private Class Fields and Methods

We added Stage 3 [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) this will help clean up the internal API and prevent developers from using the wrong or private methods.

Basically any fields or methods should add the # in front to make it private. This will make it so it cant be called externally.

Decided not to make either the `connectedCallback` nor `template` events private as the former is a lifecycle event in web components and the template may need to be overridable in some cases for flexibility.

#### Example Component

Good ones to look at are IdsTag, IdsFavorites, IdsAlerts and IdsHyperlink as examples.
