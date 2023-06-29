/*
 * Plugin to convert to visual code format
 */
import * as fs from 'fs';
import * as path from 'path';

const extractFromModules = (array) => array.map((value) => {
  const declarations = value.declarations[0] || [];
  const readmeFile = path.join(path.dirname(value.path), 'README.md');
  const readme = fs.readFileSync(readmeFile, 'utf-8');

  const tag = {
    name: path.parse(value.path).name,
    attributes: declarations?.members?.reduce((result, option) => {
      if (option.kind === 'field' && option.name !== 'attributes') {
        return result.concat({
          name: option.name,
          description: option.description,
          values: []
        });
      }
      return result;
    }, []),
    description: {
      kind: 'markdown',
      value: readme
    },
  };
  return tag;
});

/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
export function generateCustomData({ from, to, quiet }) {
  return {
    name: 'copy',
    packageLinkPhase({ customElementsManifest }) {
      const vsCodeJSON = {
        $schema: 'https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/main/docs/customData.schema.json',
        version: 1.1,
        tags: extractFromModules(customElementsManifest.modules)
      };

      const data = JSON.stringify(vsCodeJSON);
      // eslint-disable-next-line no-console, no-undef
      if (!quiet) { console.log('[cem-plugin-vscode] -  Created new manifest for vs code'); }
      fs.writeFileSync('./vscode.html-custom-data.json', data);
    },
  };
}
