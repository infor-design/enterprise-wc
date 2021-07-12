# Linting

We use several linters and type checkers for various reasons. The different linters and tools are explained in this document. Note that we are doing type checking BUT NOT using Typescript. This allows us to include typing files to support Typescript users and ensures our code will not fail when included in a Typescript environment. This allows us to eliminate the need for Angular wrappers.

## Tooling

- [Actions](https://github.com/infor-design/enterprise-wc/actions) The github actions on your PR will report errors which will be verifiable on the command line running `npm run lint && npm run test`

## Markdown (Remark) Linter

We are using a package called [remark](https://github.com/remarkjs/remark/tree/main/packages/remark-cli)

We validate the files by running `npm run lint` or `npm run mdlint`. This covers some common mistakes in the .md files we document. The rules can be set in the `.remarkrc` file.

## EsLint Linter

We are using the core [eslinter for Javascript](https://eslint.org/) all settings can be set within the `.eslintrc.js` file in the root. If using Atom the package [linter-eslint](https://atom.io/packages/linter-eslint) should be installed. The web pack config in the demo app will also report errors in the Google Chrome console while testing.

## Style Linter

We are using [style lint](https://github.com/stylelint/stylelint) for checking the rules in scss files. All settings can be set within the `.stylelintignore` file in the root. If using Atom the package [linter-stylelint](https://atom.io/packages/linter-stylelint) should be installed. The web pack config in the demo app will also report errors in the Google Chrome console while testing.

## HtmlHint Linter

We are using [HtmlHint lint](https://github.com/htmlhint/HTMLHint) for checking simple rules around valid HTML. All settings can be set within the `.htmlhintrc` file in the root. If using Atom the package [linter-htmlhint](https://atom.io/packages/linter-htmlhint) should be installed.

## Typescript Type Checking

We are using [the typescript tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) command for checking simple rules around Typescript and typings to support Typescript users. Note that in this project we chose to not use Typescript but we make the code type safe using comments and/or proper Javascript. All settings regarding typing can be set within the `tsconfig.json` file in the root of this project.

If using the Atom editor the package [atom-typescript](https://atom.io/packages/atom-typescript) should be installed to see errors in the editor. Within the atom-typescript plugin make sure to check the "Enable Atom-Typescript for JavaScript Files" to see errors in Atom.

In addition we had to disabled a couple warnings it complains about regarding our import statements (in Atom only). To set this in the atom-typescript plugin go to the setting  "Ignore Diagnostics" add the following: 6138, 6133.

Occasionally due to a bug in Atom not showing errors when a JS file is open. Click `JavaScript` on the bottom footer and set it to `TypesScript` to toggle the visibility of type errors.

In addition to the types in the d.ts file which should be the external facing types. You can use tsdoc to guide ts into the types. Have a look at [jsdoc-supported-types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).
