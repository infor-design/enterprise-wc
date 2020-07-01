# IDS Web Components Proof Of Concept

## Getting Started

```bash
git clone https://github.com/infor-design/enterprise-wc.git
cd enterprise-wc
npm i
npm run start
```

At that point the server should open your default browser to [localhost:4300](http://localhost:4300/)

## High Level Principals

- Do tests first (test driven development)
- Do security scans and CSP (for example inline css)
- Complete documentation from the start and throughout
- Maintain extensive CHANGELOG with listed any and all breaking changes
- Follow all installed linters
- Have accessibility scans in tests from the start
- Follow [Wai Aria practices](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12)
- We use namespace `ids-`
- Use Css Variables - For top level tokens
- Keep Css Flat - Max two levels selectors deep and keep
- Consider [Selector Speed](https://csswizardry.com/2011/09/writing-efficient-css-selectors)
- Follow the [Gold Standard For Making Web Components](https://github.com/webcomponents/gold-standard/wiki)
