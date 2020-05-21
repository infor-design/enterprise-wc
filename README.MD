# IDS Web Components Proof Of Concept

## Getting Started 

```
git clone https://github.com/infor-design/enterprise-wc.git
cd enterprise-wc
npm i 
npm run start
```

At that point the server should open your default browser to http://localhost:4300/

## Recommended Principals

- Do complete tests from the start
- Do complete security scans and CSP (for example inline css) from the start 
- Complete documentation from the start 
- Complete CHANGELOG with listed breaking changes from the start 
- Add all Linting - Using Sass linter, Html Linter ect
- Have accessibility scans in tests from the start
- Use these Guidelines for keyboard https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12 and also  http://w3c.github.io/aria-practices/#button
- Make Better "Marketing" - convince people to use the stuff without thinking too hard about it
- Make Better Communication Plans - Incident Reports and Release and Change Communication ect.
- Make a Better Support Channel - More helpers - Maybe something other than teams
- Use Namespaces - ids-
- Use Css Variables - For some tokens top level tokens
- Keep Css Flat - Max two levels selectors keep [Selector Speed](https://csswizardry.com/2011/09/writing-efficient-css-selectors) in mind and only use the top 4 or 5 if possible

