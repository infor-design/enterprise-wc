/* eslint-disable no-console */
const fs = require('fs');
const archiver = require('archiver');
const yaml = require('js-yaml');
const FormData = require('form-data');
const TypeDoc = require('typedoc');
const marked = require('marked');
const hljs = require('highlight.js');

const serverUrl = `${process.env.DOCS_API_URL}/api/docs/wc/`;
const apiDocsOutputDir = './docs/api';
const docsOutputDir = './docs';
const componentsZipName = './docs.zip';
const componentsDir = './src/components';
const componentPaths = [];
const siteMap = {
  sections: [{
    name: 'Getting Started',
    slug: 'index'
  },
  {
    name: 'Components',
    pages: []
  }]
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

marked.setOptions({
  gfm: true,
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'html';
    return hljs.highlight(code, { language }).value;
  }
});

const generateApiDocs = async (paths, outputDir) => {
  const TypeDocApp = new TypeDoc.Application();
  TypeDocApp.options.addReader(new TypeDoc.TSConfigReader());
  TypeDocApp.options.addReader(new TypeDoc.TypeDocReader());

  TypeDocApp.bootstrap({
    entryPoints: paths
  });

  const project = TypeDocApp.convert();

  if (project) {
    await TypeDocApp.generateDocs(project, outputDir);
    await TypeDocApp.generateJson(project, `${outputDir}/documentation.json`);
  }
};

const addToSiteMap = (sectionName, content) => {
  const index = siteMap.sections.findIndex((x) => x.name === sectionName);

  if (index === -1) {
    siteMap.sections[sectionName] = {
      pages: [{
        name: content.component,
        slug: content.link
      }]
    };
  }

  if (index !== -1) {
    siteMap.sections[index].pages.push({
      name: content.component,
      slug: content.link
    });
  }
};

const createDocsDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const getFileContents = (filePath) => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData;
  } catch (e) {
    // eslint-disable-next-line no-console
    if (filePath.indexOf('ids-demo-app') === -1) console.error(`${filePath} file not found`);
    return false;
  }
};

const isDir = (path) => {
  try {
    const stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
};

const uploadArchive = (filePath) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('root_path', `wc-beta/latest`);
    form.append('es_index_prefix', 'wc-beta');
    form.append('post_auth_key', process.env.DOCS_API_KEY ? process.env.DOCS_API_KEY : '');
    form.submit(serverUrl, (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.statusCode === 200) {
          resolve('ok');
        } else {
          reject(res.error);
        }
        res.resume();
      }
    });
  }, 1000);
});

const createArchive = (archiveName, dir) => new Promise((resolve, reject) => {
  const output = fs.createWriteStream(archiveName);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    resolve();
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.warn(err);
    } else {
      reject(err);
    }
  });

  archive.on('error', (err) => {
    reject(err);
  });

  archive.pipe(output);
  archive.directory(dir, false);
  archive.finalize();
  resolve();
});

const generateDocs = async (dir) => {
  const jsonTemplate = {
    title: '',
    description: '',
    body: '',
    api: '',
    demo: {
      name: '',
      slug: ''
    }
  };

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const componentFolder = `${dir}/${file}`;
    const output = `./docs/docs/${file}.json`;

    if (!isDir(componentFolder)) {
      return;
    }

    const metaData = getFileContents(`${componentFolder}/demos/index.yaml`);
    if (!metaData) {
      return;
    }

    const markdowData = getFileContents(`${componentFolder}/README.md`);
    const metaDataObj = yaml.load(metaData);
    const componentMainFile = `${componentFolder}/${metaDataObj.link}.ts`;

    const writeData = {
      ...jsonTemplate,
      ...{
        title: metaDataObj.component,
        description: metaDataObj.description,
        body: marked.parse(markdowData),
        isComponent: true,
        demo: {
          name: metaDataObj.component,
          slug: metaDataObj.link
        }
      }
    };

    componentPaths.push(componentMainFile);
    addToSiteMap('Components', metaDataObj);

    fs.writeFileSync(output, JSON.stringify(writeData), (error) => {
      if (error) {
        throw error;
      }
    });
  });

  fs.writeFileSync(`./docs/docs/sitemap.json`, JSON.stringify(siteMap), (error) => {
    if (error) {
      throw error;
    }
  });
};

const generateIndexPage = (path) => {
  const jsonTemplate = {
    title: 'Infor Design System\'s Enterprise Components',
    description: '',
    body: '',
    api: ''
  };
  const output = `./docs/docs/index.json`;
  const fileContent = getFileContents(path);
  jsonTemplate.body = marked.parse(fileContent);
  fs.writeFileSync(output, JSON.stringify(jsonTemplate), (error) => {
    if (error) {
      throw error;
    }
  });
};

const generateChangelogPage = (path) => {
  const jsonTemplate = {
    title: 'Infor Design System\'s Enterprise Changelog',
    description: '',
    body: '',
    api: ''
  };
  const output = `./docs/docs/changelog.json`;
  const fileContent = getFileContents(path);
  jsonTemplate.body = marked.parse(fileContent);
  fs.writeFileSync(output, JSON.stringify(jsonTemplate), (error) => {
    if (error) {
      throw error;
    }
  });
};

const populateApiDocs = () => new Promise((resolve, reject) => {
  const docFiles = fs.readdirSync('./docs/docs');
  const promises = [];

  docFiles.forEach((docFile) => {
    if (docFile !== 'sitemap.json') {
      const camelCaseBaseName = docFile.split('.')[0].replaceAll('-', '_');
      const docFileContent = JSON.parse(getFileContents(`./docs/docs/${docFile}`));
      const apiHtml = getFileContents(`./docs/api/classes/${camelCaseBaseName}_${camelCaseBaseName}.default.html`);
      docFileContent.api = apiHtml;
      promises.push(fs.writeFileSync(`./docs/docs/${docFile}`, JSON.stringify(docFileContent)));
    }
  });

  Promise.all(promises)
    .catch((err) => {
      reject(err);
    })
    .then(() => {
      resolve();
    });
});

createDocsDir(`${docsOutputDir}/docs`);
generateDocs(componentsDir);
generateIndexPage(`./README.md`);
generateChangelogPage(`./doc/CHANGELOG.md`);
generateApiDocs(componentPaths, apiDocsOutputDir)
  .then(() => {
    const promises = [];
    promises.push(populateApiDocs());
    promises.push(createArchive(componentsZipName, `${docsOutputDir}/docs`));
    promises.push(uploadArchive(componentsZipName));
    Promise.all(promises)
      .catch((err) => console.log(err));
  }).catch((err) => console.log(err));
