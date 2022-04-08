const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const handleUpload = (middlewares, devServer) => {
  // Post , upload files to `/tmp` folder, after one minute, all files will get removed
  devServer.app.use(fileUpload({ debug: false }));
  devServer.app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    const dir = `${__dirname}/tmp/`;
    // Create directory if doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const paramName = `${req.headers['param-name'] || 'myfile'}[]`;
    const filesUploaded = req.files[paramName];
    let filesToUpload = [];
    if (Array.isArray(filesUploaded)) {
      filesToUpload = filesUploaded;
    } else {
      filesToUpload.push(filesUploaded);
    }
    for (let i = 0; i < filesToUpload.length; i++) {
      filesToUpload[i].mv(`${dir}${filesToUpload[i].name}`, (err) => {
        if (err) res.status(500).send(err);
      });
    }

    // Clean directory after done!, (0) No delay, (60 * 1000) One minute
    const delay = 0;
    setTimeout(() => {
      fs.readdir(dir, (err, files) => {
        if (err) throw err;
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          fs.unlink(path.join(dir, file), () => {});
        }
      });
    }, delay);

    // Completed successfully
    res.send('Uploaded successful');
  });

  return middlewares;
};

module.exports = handleUpload;
