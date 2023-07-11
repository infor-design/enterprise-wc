# Publishing Notes

## Publishing a package to NPM

- Search for `1.0.0-beta.n` (current version) and replace with new version (currently `1.0.0-beta.13`)
- It will be in`package.json`, `package-dist.json`, about tests, and `src/core/ids-attributes.js` and this file.
- Commit and push
- Make and push a tag with `git tag 1.0.0-beta.13 && git push origin --tags`
- Run command `npm run publish:dry-run` to test first if you wish
- Run command `npm run publish:npm` or `publish:debug` (we may want to publish debuggable code for a period of time of stability)
- If not installed, install GitHub cli so you get the [`gh`](https://cli.github.com/manual/gh_release_create) command with `brew install gh`
- Run command `gh release create 1.0.0-beta.13 --title "1.0.0-beta.13" --notes-file "doc/CHANGELOG.md"`
- Go to [`the releases page`](https://github.com/infor-design/enterprise-wc/releases) and edit the changelog contents if needed and make a pre-release if needed
- Update the change log and add a new section
- Commit and push (direct to repo or PR)

## Publishing a test package your local NPM repo

Sometimes, for testing purposes, it may be necessary to link this project as a dependency of another project.

Normally, this is done simply with `npm link` and the local NPM repository on your machine. However, before using `npm link` on this project, running a build is required. The `publish:link` task in package.json helps with this:

- Builds a development version of the components
- copies `package-dist.json` and other files to mimic a real package,
- finally runs `npm link` in the correct `dist` folder

After running this task, go to the root folder of the destination project and run `npm link ids-enterprise-wc` to install the symlinked copy of the components.  Note that if you've previously run `npm install` and already have a copy of the Ids Web Components package, you must remove that dependency with `npm uninstall` or deletion before making the link.

## Using a symlink to test locally

In some cases you may just want to set a symlink from a build folder to another local folder where `node_modules/ids-enterprise-wc is expected` to be. To do so make sure the `/ids-enterprise-wc` folder is deleted and then run a command like `ln -s /Users/<user>/<folder>/enterprise-wc/build/dist/development /Users/<user>/<folder>/enterprise-wc-examples/angular-ids-wc/node_modules/ids-enterprise-wc`

### Removing local changes

Normally re-running the `publish:link` task is sufficient to update the local NPM package.  However, if you need to remove the package from the local NPM repo manually, use this process:

First, check the local NPM repo for the `ids-enterprise-wc` package:

```sh
npm ls --global
```

If the package exists, remove it:

```sh
npm rm --global ids-enterprise-wc
```

After this, the package should no longer exist in the global NPM repo.

## Deploying a static site

- run a dev server on `build/development` after running `npm run build` for example:

```sh
npm run build
cd build/development
python -m SimpleHTTPServer
```

Limitations:

- sub folders need the html extension for example `http://localhost:4300/ids-pager/sandbox.html` not `http://localhost:4300/ids-pager/sandbox`
- The [File Upload Advanced demo](http://localhost:4300/ids-upload-advanced/) will just error uploading as `/upload` is disabled / not available for static sites..
