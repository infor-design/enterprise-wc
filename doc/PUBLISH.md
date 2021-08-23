# Publishing Notes

## Making a package in npm

- Bump version in `package.json`
- Bump version in `package-dist.json`
- Bump version in `src/ids-base/ids-decorators.js`
- Run command `npm run publish:dry-run` to test first
- Run command `npm run publish:npm`

## Working with local changes

- Go to the root folder of this project  folder and type `npm link` to set up the symbolic link
- Go to the root of the destination project `npm link ids-enterprise-wc`

## Deploying a static site

- run a dev server on demo-dist after running `npm run build` for example:

```sh
npm run build
cd demo-dist
python -m SimpleHTTPServer
```

Limitations:

- sub folders need the html extension for example `http://localhost:4300/ids-pager/sandbox.html` for `http://localhost:4300/ids-pager/sandbox` to work you would need to do mapping
- The [File Upload Advanced demo](http://localhost:4300/ids-upload-advanced/) will just error uploading as `/upload` is disabled / not available for static sites..
