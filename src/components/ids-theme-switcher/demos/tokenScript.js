const fs = require('fs');
const path = require('path');

const file = './src/themes/default/ids-theme-default-core.scss';

/**
 * Reads a SCSS file and returns an object of token values
 * @param {*} filePath - The path to the SCSS file
 * @param {*} variableValues - An object to store the token values
 * @returns {object} - An object of token values
 */
function readSCSSFile(filePath, variableValues = {}) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  const variableRegex = /^--ids-(.*):\s*(.*);/;

  // Parse each line
  lines.forEach((line) => {
    // Check if the line contains a CSS variable declaration
    const matches = line.trim().match(variableRegex);
    if (matches && matches.length === 3) {
      const variableName = matches[1].trim(); // Variable name
      const variableValue = matches[2].trim(); // Variable value
      variableValues[variableName] = variableValue;
    } else if (line.trim().startsWith('@import')) {
      const importedFilePath = path.resolve(__dirname, '..', '..', '..', 'themes', 'tokens', 'core.scss');

      // Recursively read the imported file
      readSCSSFile(importedFilePath, variableValues);
    }
  });

  return variableValues;
}

// Example usage
const scssFilePath = file;
const tokenValues = readSCSSFile(scssFilePath);
console.log(tokenValues);
