/**
 * Changes the folder mapping of jest snapshots to flatten them.
 */
module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath + snapshotExtension,

  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.slice(0, -snapshotExtension.length),

  testPathForConsistencyCheck: 'test/ids-component/ids-component-func-test.js'
};
