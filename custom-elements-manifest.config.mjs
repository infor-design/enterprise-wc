// eslint-disable-next-line import/extensions
import { generateCustomData } from './scripts/cem-plugin-vscode.mjs';

export default {
  globs: ['src/components/**/*.ts'],
  dependencies: false,
  exclude: [
    'scripts/*.*',
    'src/components/enterprise-wc.ts',
    'src/components/**/demos/*.ts',
    'src/components/ids-demo-app/*.ts',
    'src/components/ids-locale/**/*.ts'
  ],
  plugins: [
    generateCustomData({
      descriptionSrc: 'summary',
      cssFileName: null
    }),
  ],
};
