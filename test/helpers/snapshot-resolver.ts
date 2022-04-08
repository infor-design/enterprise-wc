/**
 * Changes the folder mapping of jest snapshots to flatten them.
 */
module.exports = {
  resolveSnapshotPath: (testPath: any, snapshotExtension: any) => testPath + snapshotExtension,
  resolveTestPath: (snapshotFilePath: any, snapshotExtension: any) => snapshotFilePath.slice(0, -snapshotExtension.length),
  testPathForConsistencyCheck: 'test/ids-component/ids-component-func-test.js'
};
