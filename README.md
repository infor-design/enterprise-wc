# IDS Web Components

![Build Status](https://github.com/infor-design/enterprise-wc/workflows/Build%20Check/badge.svg)
[![Visual Regression Status](https://percy.io/static/images/percy-badge.svg)](https://percy.io/Infor-Design-System/IDS-Web-Components)
[![Coverage Status](https://coveralls.io/repos/github/infor-design/enterprise-wc/badge.svg)](https://coveralls.io/github/infor-design/enterprise-wc)

Infor Design System Web Components (IDS WC) is an Infor community sourced, open source project that creates high quality web components that contain the common patterns and styles used in Infor Applications. We built these in such a way that they could be used by any application in a variety of popular frameworks (Angular, React Vue).

## Getting Started

```bash
npm i ids-enterprise-wc -D
```

At that point the node_modules/ids-enterprise-wc folder will contain all the files you need. You can import just the .js files which include encapsulated css. Then just use the custom element as mentioned in the docs for each component. Or you can use a the standalone css file for each component, for a limited bit of css support per component.

## TypeScript

In Ids Web Components we chose to use Javascript and not TypeScript, however we want to support developers that use typescript. For each component we also include TypeScript declaration files for all methods, settings and events. And we ensure our code if included directly is type safe via. We also created a small [example TypeScript project](https://github.com/infor-design/enterprise-wc-examples/tree/master/typescript-ids-wc) to show one way to use Ids Web Components in a plain typescript project.

## Core principles

- Test first - 100% Test Coverage
- Passes all code security scans and is fully CSP compatible
- Well documented in `.md` format
- Contains an extensive [Change log](./doc/CHANGELOG.md) which lists any and all breaking changes
- [Fully linted code](./doc/LINTING.md)
- Follows [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12) with a huge focus on accessibility
- Fully Namespaced with an `ids-` namespace
- We Follow the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki)
- Type safe for TypeScript users
- Every component has the Css and Dom Encapsulated (in supported browsers)
