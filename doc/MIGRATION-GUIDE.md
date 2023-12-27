# Migration Guide

This is a living guide that covers common topics for migrating from previous versions of IDS, or using it for the first time.

If you have suggestions, please [raise an issue on GitHub](https://github.com/infor-design/enterprise-wc/issues) or [create a pull request with your contribution](./CONTRIBUTING.md).

## What is a Web Component?

Learn more about [Web Components via MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

We rely heavily on these concepts:

- [Custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [HTML templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- [Lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks)
- [`:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host)
- [`:part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)

The advantage of Web Components is that we can now use custom elements and have encapsulation in CSS, protecting you from CSS conflicts.

## Key Features

See the [key features](../README.md#key-features) for info on what's changed.

## Browser Support

See [browser support](../README.md#browser-support) for this information.

## Dependencies

The `ids-enterprise-wc` Web Components no longer have any dev dependencies.

Both jQuery and d3 have been dropped as dependencies, as they are no longer needed unless running old components side by side.

## Installation

The components are available via [npm](https://www.npmjs.com/) and [yarn](https://yarnpkg.com/):

```bash
npm install --save ids-enterprise-wc@latest
```

Once installed, the files are in: `node_modules/ids-enterprise-wc`.

You can import all components in one import via the `enterprise-wc.js` file, though it's recommended to import only those that you use. This is especially important when following the [side-by-side migration approach](https://github.com/infor-design/enterprise-wc/blob/main/doc/MIGRATION-GUIDE.md#side-by-side-migration-approach).

```js
// ALL
import 'ids-enterprise-wc/enterprise-wc.js';

// OR
import 'ids-enterprise-wc/components/ids-tag/ids-tag';
import 'ids-enterprise-wc/components/ids-alert/ids-alert';
```

If you only need the type, you can import them for each component:

```js
import type IdsAlert 'ids-enterprise-wc/components/ids-alert/ids-alert';
```

Once you import the script, the custom element will self-register, and then you can use the markup as shown in [component docs](./DOCUMENTATION.md).

## Documentation

Each component includes [documentation](./DOCUMENTATION.md) in a `.md` file, and is [available on the IDS reference site](https://design.infor.com/web-components/).

## Side-by-Side Migration Approach

A "side-by-side" migration lets you use newer Web Components with older ones from Enterprise, running them together on the same page. To test them, most components have [side-by-side examples](https://main.wc.design.infor.com/ids-switch/side-by-side.html) included in [demos](https://main.wc.design.infor.com/) to show what's changed.While not all combinations have been tested, raise an issue if you run into issues. You might consider introducing Web Components to a new area of an application or in work that has a lower impact.

Take advantage of some new and improved functionality that's only available within Web Components, including:

- `ids-icon`
- `ids-scroll-view`
- `ids-virtual-scroll` within the `data-grid`
- `ids-stats`
- `ids-charts`
- `ids-action-sheet`
- `ids-loading-indicator`
- `ids-pager`

## Settings, Attributes, Properties

We use specific terms to describe different aspects of the components. Here's an overview:

- We use "settings" as a broad term to describe configurable aspects of components. For example, `minute-interval` is a `setting` for the minutes picker within the [Datepicker](https://github.com/infor-design/enterprise-wc/tree/main/src/components/ids-date-picker#settings-attributes). Almost every component has an array of settings found in docs. In case we missed one in the docs, note that they can always be found in an `attributes` section like [this component](https://github.com/infor-design/enterprise-wc/blob/main/src/components/ids-alert/ids-alert.ts#L49).
- "Attributes" refer to the HTML attribute names, also used by the [Web Component spec](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes). These are written in kebab case, like `<ids-date-picker minute-interval="15">`. Primitive types can have HTML attribute-style settings, while any settings for objects must be done with JavaScript.
- "Properties" refer to [JavaScript properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript). In JavaScript, they follow camel case notation.  Note that various types can be used in this context and when installed properly, TypeScript types will display in Intellisense.
  
For example:

```js
const myDatePicker = document.querySelector<IdsDatePicker>('ids-date-picker');
myDatePicker.minuteInterval = 15;
```

## Feature Availability

[Component documentation](./DOCUMENTATION.md) summarizes all available features and functionality. If a setting seems to be missing, check the [source for the components](https://github.com/infor-design/enterprise-wc/tree/main/src/components) or [let us know](https://github.com/infor-design/enterprise-wc/issues/new/choose).

Note that not all features from Enterprise components are available in Web Components. We kept only the most-used functionality, deprecating some items that were confusing, incorrect, or those that didn't provide an adequate user experience. If you notice a feature that you believe is missing, let us know or [create a pull request](https://github.com/infor-design/enterprise-wc/issues/new/choose).

## Customizing and Themes

While components are built to IDS usage guidelines, there's info on ways to [customize them](./CUSTOMIZING.md) through theming, CSS parts, and extending.

## Breaking Changes

When migrating a component, review its documentation as each component includes a `Converting from Previous Versions (Breaking Changes)` section with specific notes for upgrading. If we missed anything, please [raise a GitHub issue](https://github.com/infor-design/enterprise-wc/issues/new/choose).

## Getting Help

We :heart: working with developers. Reach out through these channels for questions or support:

- [Contribute to IDS](./CONTRIBUTING.md) with bug reports, suggestions, and pull requests
- [Join the IDS Teams channel](https://teams.microsoft.com/l/team/19%3A2b0c9ce520b0481a9ce115f0ca4a326f%40thread.skype/conversations?groupId=4f50ef7d-e88d-4ccb-98ca-65f26e57fe35&tenantId=457d5685-0467-4d05-b23b-8f817adda47c) for general questions and find information from the IDS community

## Example Projects

While we don't recommend any particular framework, we aim to test and provide guidance for those that are most common. `/enterprise-wc-examples` contains starter projects for supported frameworks, each in different levels of maturity:

- **[Angular](https://github.com/infor-design/enterprise-wc-examples/tree/main/angular-ids-wc)**
- **[React](https://github.com/infor-design/enterprise-wc-examples/tree/main/react-ids-wc)**
- **[React TypeScript](https://github.com/infor-design/enterprise-wc-examples/tree/main/react-ts-ids-wc)**
- **[Vue.js](https://github.com/infor-design/enterprise-wc-examples/tree/main/vue-ids-wc)**
- **[SvelteKit](https://github.com/infor-design/enterprise-wc-examples/tree/main/sveltekit-ids-wc)**
- **[Plain HTML](https://github.com/infor-design/enterprise-wc-examples/tree/main/plain-html)**
- **[TypeScript](https://github.com/infor-design/enterprise-wc-examples/tree/main/typescript-ids-wc)**

If we missed anything, or you want to see a pattern example in a given framework, please [raise a GitHub issue](https://github.com/infor-design/enterprise-wc/issues/new/choose).
