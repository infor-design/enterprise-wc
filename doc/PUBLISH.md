# Publishing Notes

## Making a package in npm

- Bump version in package.json
- Bump version in src/ids-base/ids-decorators.js
- Run command `npm run publish:dry-run` to test first
- Run command `npm run publish:npm`

## Working with local changes

- Go to the root folder of this project  folder and type `npm link` to set up the symbolic link
- Go to the root of the destination project `npm link ids-enterprise-wc`
