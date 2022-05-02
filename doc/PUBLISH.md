# Publishing Notes

## Making a package in npm

- Search for `0.0.0-beta.22` and replace with `0.0.0-beta.22`
- It will be in`package.json`, `package-dist.json`, about tests, and `src/core/ids-attributes.js`
- Make and push a tag with `git tag 0.0.0-beta.22 && git push origin --tags`
- Run command `npm run publish:dry-run` to test first if you wish
- Run command `npm run publish:npm`
- Create a release on GitHub using [`gh`](https://cli.github.com/manual/gh_release_create) with `brew install gh`
- Run command `gh release create 0.0.0-beta.22 --title "0.0.0-beta.22" --notes-file "doc/CHANGELOG.md"`

## Working with local changes

- Go to the root folder of this project folder and type `npm link` to set up the symbolic link
- Go to the root of the destination project `npm link ids-enterprise-wc`

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
