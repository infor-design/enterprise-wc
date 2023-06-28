# Infor Design System Web Components Beta Library

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/ids-enterprise.svg)](https://badge.fury.io/js/ids-enterprise-wc)
[![Build Check](https://github.com/infor-design/enterprise-wc/actions/workflows/ci.yml/badge.svg)](https://github.com/infor-design/enterprise-wc/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/infor-design/enterprise-wc/badge.svg?branch=main)](https://coveralls.io/github/infor-design/enterprise-wc)

Infor Design System Enterprise Web Components Library is a framework independent UI library consisting of CSS and JS that provides Infor product development teams, partners, and customers the tools to create user experiences that are approachable, focused, relevant, and perceptive.

## Key Features

- Three themes, including a WCAG 2.0 AAA compatible high-contrast theme and ability to theme anything
- Responsive components, patterns and layouts
- Touch-friendly interactions
- SVG-based iconography for high DPI screens and scaling
- Built-in, extendible localization system
- Built-in mitigation of XSS exploits
- 85-100% Functional Test Coverage
- Passes all code security scans and is fully CSP compliant
- Well documented in `.md` format
- Contains an extensive [Change log](./doc/CHANGELOG.md) which lists any and all breaking changes
- [Fully linted code](./doc/LINTING.md)
- Follows [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12) with a focus on accessibility
- Fully Namespaced with an `ids-` namespace
- We Follow the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki)
- Includes types for typescript users
- Every component has the CSS and DOM Encapsulation
- 100+ Components
- Includes Visual Code and [standard schemas](https://github.com/webcomponents/custom-elements-manifest)

## Browser Support

We support the latest release and the release previous to the latest (R-1) for browsers and OS versions:

<!-- markdownlint-disable MD013 MD033 -->
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- |
| R-1 | R-1 | R-1| R-1| R-1

<!-- markdownlint-enable MD013 MD033 -->

## Installation

The components are available via npm/yarn:

```sh
npm install --save ids-enterprise-wc@latest
```

To Clone and Run this Repo locally (requires node 18 (16 or 17))

```sh
mkdir enterprise-wc
cd enterprise-wc
git clone git@github.com:infor-design/enterprise-wc.git .
npm i
npm run start
```

## Documentation

- For each component see the `.md` file in the relevant [component folder](https://github.com/infor-design/enterprise-wc/tree/main/src)
- See the [Change Log](doc/CHANGELOG.md) for info on breaking changes as well more info in each individual component
- See the [Examples in popular frameworks](https://github.com/infor-design/enterprise-wc-examples) for examples and notes on using these in several frameworks

## Usage for Code Hinting

The npm package ships with a file called `vscode.html-custom-data.json`. The file describes the custom elements and their settings for use in Visual Studio Code to provide “IntelliSense”. To enable it, you just need to tell VS Code where the file is.

1. As per above, install with `npm install --save ids-enterprise-wc@latest`
1. Create a folder called `.vscode` at the root of your project
1. Create a file inside that folder called `settings.json`
1. Add the following setting to the file.

```json
{
  "html.customData": ["./node_modules/ids-enterprise-wc/vscode.html-custom-data.json"]
}
```

You may need to restart VS Code for the changes to take affect.

Most popular editors support custom code completion with different configurations. Please [submit a feature request and/or pull request](https://github.com/infor-design/enterprise-wc/issues/new/choose) if you want to add your editor.

## Contributing

- [Articles about Web Components](doc/ARTICLES.md)
- [Things to consider for each component](doc/CHECKLIST.md)
- [How to Make a new Component](doc/COMPONENTS.md)
- [Info on which linters we use](doc/LINTING.md)
- [Info on Running and Debugging Tests](doc/TESTING.md)
- Use [Github Issues](https://github.com/infor-design/enterprise-wc/issues) to report all requests, bugs, questions, and feature requests
- [Review source code changes](https://github.com/infor-design/enterprise-wc/pulls)
- [Roadmap and Sprint Board](https://github.com/orgs/infor-design/projects)
