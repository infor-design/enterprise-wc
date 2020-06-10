# IDS Web Components Proof Of Concept

## Getting Started

```bash
git clone https://github.com/infor-design/enterprise-wc.git
cd enterprise-wc
npm i
npm run start
```

At that point the server should open your default browser to [localhost:4300](http://localhost:4300/)

## Recommended Principals

- Do complete tests from the start
- Do complete security scans and CSP (for example inline css) from the start
- Complete documentation from the start
- Complete CHANGELOG with listed breaking changes from the start
- Add all linting - Using Sass linter, Html Linter ect from the start
- Have accessibility scans in tests from the start
- Follow [Wai Aria practices](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12)
- Use Namespaces `ids-`
- Use Css Variables - For some tokens top level tokens
- Keep Css Flat - Max two levels selectors deep and keep
- Consider [Selector Speed](https://csswizardry.com/2011/09/writing-efficient-css-selectors)
- Follow the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki)
