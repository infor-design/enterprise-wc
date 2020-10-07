# IDS Web Components

![Build Status](https://github.com/infor-design/enterprise-wc/workflows/Build%20Status/badge.svg?branch=master)
[![Visual Regression Status](https://percy.io/static/images/percy-badge.svg)](https://percy.io/Infor-Design-System/IDS-Web-Components)

Infor Design System (IDS) Web Components is an Infor community sourced, open source project that creates high quality web components that contain the common patterns and styles used in Infor Applications. We built these in such a way that they could be used by any application in a variety of popular frameworks (Angular, React Vue).

## Getting Started

```bash
npm i ids-enterprise-wc -D
```

At that point the node_modules/ids-enterprise-wc folder will contain all the files you need. You can import just the .js files and then use the custom element as mentioned in the doc for each component. Or you can use the css file for each component, for a limited bit of support per component.

## Core principles

- Tests first - 100% Test Coverage
- Completely security scans and CSP compatible
- Well documented in .md format
- Contains an extensive [CHANGELOG with](./doc/CHANGELOG.md) listed any and all breaking changes
- Follow linted code
- Have accessibility scans in tests from the start
- Follow [Wai Aria practices](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12)
- Fully Namespaced `ids-`
- We Follow the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki)
