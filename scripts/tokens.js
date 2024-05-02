const fs = require('fs');
const path = require('path');

const tokenFiles = {
  core: './src/themes/tokens/core.scss',
  semanticContrast: './src/themes/tokens/semantic-contrast.scss',
  semanticLight: './src/themes/tokens/semantic-light.scss',
  semanticDark: './src/themes/tokens/semantic-dark.scss',
  themeColors: './src/themes/tokens/theme-colors.scss'
};

/**
 * Reads a SCSS file and returns an object of token values
 * @param {*} filePath - The path to the SCSS file
 * @param {*} variableValues - An object to store the token values
 * @returns {object} - An object of token values
 */
function readSCSSFile(filePath) {
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
      tokenObjects.push({ tokenName, tokenValue });
    }
  });

  return tokenObjects;
}

// Core Tokens
const coreTokensFile = tokenFiles.core;
const coreTokens = readSCSSFile(coreTokensFile);
// console.log(coreTokens);

// Theme Color Tokens
const themeColorTokensFile = tokenFiles.themeColors;
const themeColorTokens = readSCSSFile(themeColorTokensFile);
// console.log(themeColorTokens);

// Semantic Light Tokens
const semanticLightTokensFile = tokenFiles.semanticLight;
const semanticLightTokens = readSCSSFile(semanticLightTokensFile);
// console.log(semanticLightTokens);

/**
 * Reads a theme SCSS file and identifies the source of each CSS variable
 * @param {string} filePath - The path to the theme SCSS file
 * @returns {Array<object>} - An array of objects with token information
 */
function parseThemeFile(filePath) {
  // Extract theme name from file path
  const themeName = path.basename(filePath, '.scss');

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  const themeTokens = [];

  // Regular expression to match CSS variable declarations
  const variableRegex = /--ids-(.*?):\s*(.*?)(?:\s*;|$)/;

  // Function to recursively find the value of a variable
  function findVariableValue(variableName) {
    // Check if the variable is defined in coreTokens, themeColorTokens, or semanticLightTokens
    if (coreTokens.some((token) => token.tokenName === variableName)) {
      return coreTokens.find((token) => token.tokenName === variableName).tokenValue;
    }
    if (themeColorTokens.some((token) => token.tokenName === variableName)) {
      return themeColorTokens.find((token) => token.tokenName === variableName).tokenValue;
    }
    if (semanticLightTokens.some((token) => token.tokenName === variableName)) {
      return semanticLightTokens.find((token) => token.tokenName === variableName).tokenValue;
    }
    // If the variable is not found in token arrays, search within the theme file itself
    /* eslint-disable */
    const themeVariableRegex = new RegExp(`${variableName}:\\s*(.*?)(?:\\s*;|$)`);
    for (const line of lines) {
      const themeMatch = line.trim().match(themeVariableRegex);
      if (themeMatch) {
        const value = themeMatch[1].trim();
        // If the value is still a variable, continue finding recursively until we find a direct value
        if (value.match(/var\((.*?)\)/)) {
          console.log(`Inherited value ${value} is still a variable. Searching again.`);
          return findVariableValue(value.match(/var\((.*?)\)/)[1].trim());
        } else {
          return value; // Return direct value
        }
      }
    }
     /* eslint-enable */
    return ''; // Variable not found
  }

  // Parse each line
  lines.forEach((line) => {
    const match = line.trim().match(variableRegex);
    if (match) {
      const tokenName = `--ids-${match[1].trim()}`;
      const tokenValue = match[2].trim();
      const inherited = { tokenName: '', tokenValue: '', source: '' };

      // Check if the token value is a variable (e.g., var(--ids-color-orange-50))
      const variableMatch = tokenValue.match(/var\((.*?)\)/);
      if (variableMatch) {
        const variableName = `${variableMatch[1].trim()}`; // Construct variable name

        console.log(`Searching for inherited value of ${variableName}`);

        inherited.tokenName = variableName;

        // Find the value of the inherited variable recursively
        inherited.tokenValue = findVariableValue(variableName);
        inherited.source = 'themeFile'; // Source is the theme file itself

        console.log(`Inherited value of ${variableName}: ${inherited.tokenValue}`);

        // If the inherited value is still a variable, recursively find its value
        if (inherited.tokenValue.match(/var\((.*?)\)/)) {
          const nestedVariableName = inherited.tokenValue.match(/var\((.*?)\)/)[1].trim();
          console.log(`Inherited value ${inherited.tokenValue} is still a variable. Searching again.`);
          inherited.inherited = {
            tokenName: nestedVariableName,
            tokenValue: findVariableValue(nestedVariableName),
            source: '' // Source will be updated later
          };
          // Update source for the nested inherited value
          if (coreTokens.some((token) => token.tokenName === nestedVariableName)) {
            inherited.inherited.source = 'coreTokens';
          } else if (themeColorTokens.some((token) => token.tokenName === nestedVariableName)) {
            inherited.inherited.source = 'themeColorTokens';
          } else if (semanticLightTokens.some((token) => token.tokenName === nestedVariableName)) {
            inherited.inherited.source = 'semanticLightTokens';
          }
        }
      }

      // Only push inherited field if it contains values
      if (inherited.tokenName && inherited.tokenValue) {
        themeTokens.push({ tokenName, tokenValue, inherited });
      } else {
        themeTokens.push({ tokenName, tokenValue });
      }
    }
  });

  // Add theme name to the returned object
  return { themeName, themeTokens };
}

// Example usage
const themeFilePath = './src/themes/default/ids-theme-default-core.scss';
const themeTokens = parseThemeFile(themeFilePath);

themeTokens.themeTokens.forEach((tokens) => {
  console.log(tokens);
});
