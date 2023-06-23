import { generateCustomData } from 'cem-plugin-vs-code-custom-data-generator';

export default {
  globs: ['src/components/**/*.ts'],
  exclude: ['src/components/enterprise-wc.ts', 'src/components/**/demos/*.ts', 'src/components/ids-demo-app/*.ts'],
  plugins: [
    generateCustomData()
  ]
};
