import fs from "fs";
import path from "path";
import ts from "typescript";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store this globally so that the AST visitor can modify it
const schema: CustomDataSchema.Schema = {
  $schema:
    "https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/main/docs/customData.schema.json",
  version: 1.1,
  tags: [],
};

// Visit all source files, look for @customElement decorators
// and populate the schema
const sourceFiles = getSourceFiles();
for (const sourceFile of sourceFiles) {
  ts.forEachChild(sourceFile, (node) => visitNode(node, sourceFile));
}

// Write the schema to disk
const schemaPath = path.join(__dirname, "..", "vscode-custom-data.json");
const schemaContent = JSON.stringify(schema, null, 2);
fs.writeFileSync(schemaPath, schemaContent);

function getSourceFiles(): ts.SourceFile[] {
  const compilerOptions = readTsConfig();
  const program = ts.createProgram({
    options: compilerOptions,
    rootNames: ["src/components/enterprise-wc.ts"],
  });
  // const checker = program.getTypeChecker();
  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return (
      !sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes("node_modules")
    );
  });
  return sourceFiles;
}

/**
 * Reads and parses tsconfig.json
 */
function readTsConfig(): ts.CompilerOptions {
  const configPath = ts.findConfigFile(
    path.join(__dirname, ".."),
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }
  const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
  if (error) {
    throw new Error("Could not read 'tsconfig.json'.");
  }
  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(configPath)
  );
  if (errors.length) {
    const formatted = ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    });
    console.error(formatted);
    throw new Error("Could not parse 'tsconfig.json'.");
  }
  return options;
}

function visitNode(node: ts.Node, sourceFile: ts.SourceFile) {
  if (!isNodeExported(node) || !ts.isClassDeclaration(node)) {
    // Node is not an exported class, so it is not a custom element.
    return;
  }
  const customElementName = getCustomElementName(node, sourceFile);
  if (!customElementName) {
    // Class is not a decorated custom element
    return;
  }
  // Assumption: The README.md is located adjacent to the source file
  const readmePath = path.join(path.dirname(sourceFile.fileName), "README.md");
  if (!fs.existsSync(readmePath)) {
    throw new Error(`Could not find README.md for ${sourceFile.fileName}`);
  }
  const readme = fs.readFileSync(readmePath, "utf-8");
  schema.tags.push({
    name: customElementName,
    attributes: [], // TODO: Extract attributes somehow. They are currently not strongly typed though...
    description: {
      kind: "markdown",
      value: readme,
    },
  });
}

/**
 * Looks for a @customElement("element-name") decorator on a class declaration.
 * If found, returns the element name.
 */
function getCustomElementName(
  node: ts.ClassDeclaration,
  sourceFile: ts.SourceFile
): string | undefined {
  const decorators = ts.getDecorators(node) ?? [];
  for (const decorator of decorators) {
    if (
      ts.isCallExpression(decorator.expression) &&
      decorator.expression.expression.getText(sourceFile) === "customElement"
    ) {
      if (ts.isStringLiteral(decorator.expression.arguments[0])) {
        return decorator.expression.arguments[0].text;
      }
    }
  }
  return undefined;
}

function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) &
      ts.ModifierFlags.Export) !==
      0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

declare namespace CustomDataSchema {
  interface Schema {
    $schema: "https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/main/docs/customData.schema.json";
    version: 1.1;
    tags: Tag[];
  }

  interface Tag {
    name: string;
    attributes: Attribute[];
    description: MarkupDescription;
  }

  interface Attribute {
    name: string;
    values: AttributeValue[];
  }

  interface AttributeValue {
    name: string;
  }

  interface MarkupDescription {
    kind: "plaintext" | "markdown";
    value: string;
  }
}
