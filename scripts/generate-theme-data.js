const fs = require('fs');
const path = require('path');

// Constants
const basePath = `./src/themes`;
const tokenPath = `./node_modules/ids-foundation/`;
const tokenFiles = {
  core: `${tokenPath}/theme-soho/core.scss`,
  semanticContrast: `${tokenPath}/theme-soho/semantic-contrast.scss`,
  semanticLight: `${tokenPath}/theme-soho/semantic-light.scss`,
  semanticDark: `${tokenPath}/theme-soho/semantic-dark.scss`,
  themeColors: `${tokenPath}/theme-soho/theme-colors.scss`
};
const themeFiles = [
  `${basePath}/default/ids-theme-default-core.scss`,
  `${basePath}/default/ids-theme-default-contrast.scss`,
  `${basePath}/default/ids-theme-default-dark.scss`,
];

// Utilities
// const readFileSync = (filePath) => fs.readFileSync(filePath, 'utf8');
const writeFileSync = (filePath, data) => fs.writeFileSync(filePath, data, 'utf8');

/**
 * Reads a SCSS file and returns an object of token values
 * @param {*} filePath - The path to the SCSS file
 * @param {*} type - The type for the SCSS file
 * @param {*} label - The label for the SCSS file
 * @returns {object} - An object of token values
 */
function generateTokenObjects(filePath, type = '', label = '') {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  const tokenRegex = /^--ids-(.*):\s*(.*);/;
  const tokenObjects = [];

  // Parse each line
  lines.forEach((line) => {
    // Check if the line contains a CSS variable declaration
    const matches = line.trim().match(tokenRegex);
    if (matches && matches.length === 3) {
      const tokenName = `--ids-${matches[1].trim()}`; // Token name
      const tokenValue = matches[2].trim(); // Token value
      tokenObjects.push({
        tokenName, tokenValue, type, label
      });
    }
  });

  return tokenObjects;
}

/**
 * Reads a theme SCSS file and identifies the source of each CSS variable
 * @param {string} filePath - The path to the theme SCSS file
 * @param {Array} tokenDependencies - An array of token dependencies
 * @returns {Array<object>} - An array of objects with token information
 */
function parseThemeFile(filePath, tokenDependencies) {
  // Extract theme name from file path
  const themeName = path.basename(filePath, '.scss');

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  const themeTokens = [];

  // Regular expression to match CSS variable declarations
  const variableRegex = /--ids-(.*?):\s*(.*?)(?:\s*;|$)/;

  /**
   * Finds the value of a CSS variable
   * @param {*} variableName - The name of the CSS variable
   * @returns {object} - The value of the CSS variable
   */
  function findVariableValue(variableName) {
    /* eslint-disable */
    for (const tokens of tokenDependencies) {
      if (tokens.some((token) => token.tokenName === variableName)) {
        const token = tokens.find((token) => token.tokenName === variableName);
        if (token.tokenValue.match(/var\((.*?)\)/)) {
          const nestedVariableName = token.tokenValue.match(/var\((.*?)\)/)[1].trim();
          const nestedValue = findVariableValue(nestedVariableName);
          if (nestedValue) {
            return {
              tokenName: variableName,
              tokenValue: token.tokenValue,
              type: token?.type,
              source: token.label,
              children: [nestedValue]
            };
          }
        } else {
          return {
            tokenName: variableName,
            tokenValue: token.tokenValue,
            type: token?.type,
            source: token.label,
            children: []
          };
        }
      }
    }
    // If the variable is not found in token arrays, search within the theme file itself
    const themeVariableRegex = new RegExp(`${variableName}:\\s*(.*?)(?:\\s*;|$)`);
    for (const line of lines) {
      const themeMatch = line.trim().match(themeVariableRegex);
      if (themeMatch) {
        const value = themeMatch[1].trim();
        if (value.match(/var\((.*?)\)/)) {
          const nestedVariableName = value.match(/var\((.*?)\)/)[1].trim();
          const nestedValue = findVariableValue(nestedVariableName);
          if (nestedValue) {
            return {
              tokenName: variableName,
              tokenValue: value,
              type: 'Semantic',
              source: 'themeFile',
              children: [nestedValue]
            };
          }
        } else {
          return {
            tokenName: variableName,
            tokenValue: value,
            type: 'Semantic',
            source: 'themeFile',
            children: []
          };
        }
      }
    }
    /* eslint-enable */
    return null; // Variable not found
  }

  // Parse each line
  lines.forEach((line) => {
    const match = line.trim().match(variableRegex);
    if (match) {
      const tokenName = `--ids-${match[1].trim()}`;
      const tokenValue = match[2].trim();
      const inherited = {
        tokenName: '',
        tokenValue: '',
        type: '',
        source: '',
      };

      // Check if the token value is a variable (e.g., var(--ids-color-orange-50))
      const variableMatch = tokenValue.match(/var\((.*?)\)/);
      if (variableMatch) {
        const variableName = `${variableMatch[1].trim()}`;

        inherited.tokenName = variableName;

        // Find the value of the inherited variable recursively
        const inheritedValue = findVariableValue(variableName);
        if (inheritedValue) {
          inherited.tokenValue = inheritedValue.tokenValue;
          inherited.type = inheritedValue.type;
          inherited.source = inheritedValue.source;
          inherited.children = inheritedValue.children;
        }
      }

      // Only push inherited field if it contains values
      if (inherited.tokenName && inherited.tokenValue) {
        themeTokens.push({ tokenName, tokenValue, children: [inherited] });
      } else {
        themeTokens.push({ tokenName, tokenValue });
      }
    }
  });

  // Add theme name to the returned object
  return { themeName, themeTokens };
}

// Token Generation
const coreTokens = generateTokenObjects(tokenFiles.core, 'Core', 'coreTokens');
const themeColorTokens = generateTokenObjects(tokenFiles.themeColors, 'Semantic', 'themeColorTokens');
const semanticLightTokens = generateTokenObjects(tokenFiles.semanticLight, 'Semantic', 'semanticLightTokens');
const semanticDarkTokens = generateTokenObjects(tokenFiles.semanticDark, 'Semantic', 'semanticDarkTokens');
const semanticContrastTokens = generateTokenObjects(tokenFiles.semanticContrast, 'Semantic', 'semanticContrastTokens');
const defaultCoreTheme = generateTokenObjects(themeFiles[0], 'Core', 'defaultCoreTheme');

// Theme parsing and writing to files
const themes = [
  {
    filePath: themeFiles[0],
    tokenDependencies: [coreTokens, themeColorTokens, semanticLightTokens]
  },
  {
    filePath: themeFiles[1],
    tokenDependencies: [coreTokens, themeColorTokens, defaultCoreTheme, semanticContrastTokens]
  },
  {
    filePath: themeFiles[2],
    tokenDependencies: [coreTokens, themeColorTokens, defaultCoreTheme, semanticDarkTokens]
  }
];

themes.forEach(({ filePath, tokenDependencies }) => {
  const theme = parseThemeFile(filePath, tokenDependencies);
  writeFileSync(`./src/assets/data/themeData/${theme.themeName}.json`, JSON.stringify(theme, null, 2));
});
