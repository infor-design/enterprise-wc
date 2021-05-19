# Task List for Web Components

## General Component Checklist

 - [X] Accessibility: Create accessible markup at the start and test a screen reader like Chrome Vox. Also pass Axe tests (with some exceptions)
 - [X] Abstraction: Think about abstraction, does this component needs to be broken down into different smaller components.
 - [X] Re Use: Try and use existing components and mixins in your component.
 - [X] Settings/Events/Methods: Look at the old component and cover the most important settings, we will try to not bring all of this over so will spec this out.
 - [ ] Private Methods and Classes: Make anything private that should be with # on the name
 - [ ] Id/Automation Ids: Using the appendIds mixin and test that id's can be added (TBD)
 - [X] example.index: The main example.html page should just show one simple example and not all variations
 - [ ] test-sandbox.index: The sandbox page should show all other examples in a nicely formatted way.
 - [ ] Standalone Css: Add a basic standalone css example
 - [ ] Compatibility Example: Works in Page with 4.x version
 - [ ] Documentation: Add copious documentation in a README.MD in the folder
 - [X] TODO: Add a TODO.md for anything needing to be done in the future you think of
 - [ ] Themes: Implement color changes for Themes
 - [X] Types: In the `d.ts` file add types for all public settings, methods and events
 - [ ] 100% Test Coverage: Add Functional test coverage to 100% or by ignoring coverage on a non testable section
 - [ ] Changelog: Add detailed Upgrade Docs in Changelog discussing any gotchas converting from 4.x
 - [ ] e2e Tests: Add tests for any e2e functionality that cant be accurately tested in the functional tests as well as basic sanity checks, Axe checks and Percy Tests for all 3 themes
 - [ ] Security: We will always pass all [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) guidelines. But the code is setup to error if this fails. Also we will pass security scans like Veracode and Snyk. The biggest issue here is usually XSS.
 - [ ] NG / Vue / React / Svelte / TS Example (we will build this out)
 - [ ] Old Issues: Review Be aware of old and new issues on a component in the [old backlog](https://github.com/infor-design/enterprise/issues)
 