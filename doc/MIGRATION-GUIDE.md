#  Migration Guide

While everyone's path and and needs may vary, this guide is meant to provide a list of common questions and answers and notes that may be helpful while migrating from previous versions of IDS or using it for the first. This is meant to be a live guide. If you have suggestions please [make an issue](https://github.com/infor-design/enterprise-wc/issues) and even better [a pull request](./CONTRIBUTING.md).

## What is a Web Component?

One of the best guides on web components can be found on [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). We use the following concepts heavily and as a developer you should probably be aware of the following.

- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [HTML Templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- [Lifecycle Callbacks](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks)
- [`:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host)
- [`:part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)

The advantage of the components being a web component is we can now use custom elements and have encapsulation in the css which protects you from css conflicts.

## Whats is good and whats new

See our [key features](../README.md#key-features) section for info on what we see as the key features in IDS Web Components.

## Browser Support

See the [browser support](../README.md#browser-support) section for this information.

## Dependencies

The ids-enterprise-wc web components no longer have any (dev) dependencies.

- We dropped jQuery as a dependency, its no longer needed unless running old components side by side
- We dropped d3 as a dependency, its no longer needed unless running old components side by side.

## Installation

The components are available via npm/yarn:

```bash
npm install --save ids-enterprise-wc@latest
```

After that the files can be seen in `node_modules/ids-enterprise-wc`. Then just import the components as needed. You can either import all component in one import via the `enterprise-wc.js` file. A better method is to import each and only each component you actually use, if doing a side by side approach this is especially important.

```js
// ALL
import 'ids-enterprise-wc/enterprise-wc.js';

// OR
import 'ids-enterprise-wc/components/ids-tag/ids-tag';
import 'ids-enterprise-wc/components/ids-alert/ids-alert';
```

If you just need the type you can import the types for each component like so:

```js
import type IdsAlert 'ids-enterprise-wc/components/ids-alert/ids-alert';
```

Once you import the script the custom element will self-register and then you can just use like the markup shown in the [docs for each component](./DOCUMENTATION.md).

## Documentation

Each component has an `md` file for documentation. See the index for a full listing of [docs for each component](./DOCUMENTATION.md)

## Side By Side Migration Approach

Side by Side migration to us means you can the older version of components with this version of the components. Then swap out components side by side as both can run together in the same page. Note: that not all possibilities have been tested, but if you run into an issue we can possibly fix it, just raise an issue.

Start Slow: Consider areas of the application that need improvement, or new areas or maybe an admin page that needs rework and has lower impact.

Get New Features: Try to migrate to components that have new features that wont be added to the old component library. Like much cleaner way to use icons with `<ids-icon>` and a future icon font, or components like a new `scroll-view`, `data grid` virtual scroll, `stats`, new `ids-charts`, `ids-action-sheet`, new `ids-loading-indicator` styles and a much cleaner and better stand alone `ids-pager` to name a few.

Go Component By Component: Most components have a side-by-side example to test it you can review on the demo site https://main.wc.design.infor.com/ then click each component and see if there is a side by side page that show cases the two components can work side by side. But also you might want to work component by component and replace all uses of it, for example all old IDS buttons to `<ids-button>`.

## What are settings / attributes / properties

Not all properties will correspond to attributes, but all attributes are represented by properties.  To clarify, IDS uses these terms as described below:

- `settings` In general everything is a setting as a generic term. For example `minute interval` is a setting on date picker for the time minutes picker. Almost every component has an array of settings mentioned in the docs. In case we missed one in the docs note that they can always been seen in each component source in a `attributes` section like [this component](https://github.com/infor-design/enterprise-wc/blob/main/src/components/ids-alert/ids-alert.ts#L49).
- `attributes` Refer to either the html attribute name. Or the fact that the [web component spec](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes) calls the attributes. So all settings can also be referred to as attributes. When used in markup they are done with kebab case as is the html spec. For example `<ids-date-picker minute-interval="15"`. Note that primitive types can have html attribute style settings, any object settings must be done with Js.
- `properties` Refer to [js properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript). So all settings can also be referred to as properties. When used in Js they are done with camel case as is the js naming convention.  Note that any types can be used here and Typescript types should show in the intellisense if installed property. For example:

```js
const myDatePicker = document.querySelector<IdsDatePicker>('ids-date-picker');
myDatePicker.minuteInterval = 15;
```

## Where is my feature XYX

All the features should be in the docs for each component. See the index for a full listing of [docs for each component](./DOCUMENTATION.md). If a setting is missing in the docs you can also consult the [source for the components](https://github.com/infor-design/enterprise-wc/tree/main/src/components). And [let us know](https://github.com/infor-design/enterprise-wc/issues/new/choose) or give us a pull request.

Note that we did not add every feature from the previous version. We selected the most common / used features. We also wanted to deprecate some things that were confusing, incorrect, or did not provide an adequate user experience. If we missed a feature that you find important, let us know or [contribute it with a pull request](https://github.com/infor-design/enterprise-wc/issues/new/choose).

## Customizing and Themes

We added a separate section on ways you can [customize a component](./DOCUMENTATION.md). These include using themes, css parts, extending etc.

## Component specific changes

When migrating a component, closely review that component's documentation. Note that each component doc contains a section called `Converting from Previous Versions (Breaking Changes)` which lists specific notes for upgrading. If we missed anything, [please raise a Github issue](https://github.com/infor-design/enterprise-wc/issues/new/choose).

## Getting Help

We :heart: working with developers and we have a few channels for questions or support:

- [Contributing](./CONTRIBUTING.md) with bug reports and pull requests and suggestions
- For asking general questions or searching for other questions use or [Ms Teams Channel](https://teams.microsoft.com/l/team/19%3A2b0c9ce520b0481a9ce115f0ca4a326f%40thread.skype/conversations?groupId=4f50ef7d-e88d-4ccb-98ca-65f26e57fe35&tenantId=457d5685-0467-4d05-b23b-8f817adda47c)

## Example Projects

We don't recommend any particular framework, but we try to test with the most common ones and provide guidance on how to integrate. If we missed anything, or you want to see a pattern example in a framework, [please raise a Github issue](https://github.com/infor-design/enterprise-wc/issues/new/choose).  See the links below for guidance and integration examples of the frameworks we currently support. The example project can be found on [this repo](https://github.com/infor-design/enterprise-wc-examples), each example is in various levels of maturity.

- **[Angular](https://github.com/infor-design/enterprise-wc-examples/tree/main/angular-ids-wc)**
- **[React](https://github.com/infor-design/enterprise-wc-examples/tree/main/react-ids-wc)**
- **[React Typescript](https://github.com/infor-design/enterprise-wc-examples/tree/main/react-ts-ids-wc)**
- **[Vue JS](https://github.com/infor-design/enterprise-wc-examples/tree/main/vue-ids-wc)**
- **[Svelte Kit](https://github.com/infor-design/enterprise-wc-examples/tree/main/sveltekit-ids-wc)**
- **[Plain Html](https://github.com/infor-design/enterprise-wc-examples/tree/main/plain-html)**
- **[Typescript](https://github.com/infor-design/enterprise-wc-examples/tree/main/typescript-ids-wc)**
