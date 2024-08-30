/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// Source directory
const sourceDir = './node_modules/ids-foundation/theme-soho/scss/';

// Destination directory
const destinationDir = './src/themes/tokens/';

// Array of SCSS files
const scssFiles = [
  'core.scss',
  'semantic-contrast.scss',
  'semantic-light.scss',
  'semantic-dark.scss',
  'theme-colors.scss'
];

// Function to add `/* stylelint-disable */ to the top of a file
// eslint-disable-next-line jsdoc/require-jsdoc
function addStylelineDisable(filePath) {
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Add /* stylelint-disable */ at the top of the file
    // eslint-disable-next-line prefer-template
    const newData = '/* stylelint-disable */\n' + data;

    // Write the updated data back to the file
    fs.writeFile(filePath, newData, 'utf8', (err2) => {
      if (err2) {
        console.error('Error writing file:', err2);
      } else {
        console.info('Added /* stylelint-disable */ to:', filePath);
      }
    });
  });
}

// Loop through each SCSS file
scssFiles.forEach((file) => {
  const sourceFilePath = path.join(sourceDir, file);
  const destinationFilePath = path.join(destinationDir, file);

  // Copy the file
  fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
    if (err) {
      console.error('Error copying file:', err);
    } else {
      console.log('Copied file:', file);
      // Add /* stylelint-disable */ to the copied file
      addStylelineDisable(destinationFilePath);
    }
  });
});
