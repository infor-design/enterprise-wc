// Import all functions from index.js
const lambda = require('../../../src/handlers/index.js');

// This includes all tests for LambdaHandler()
describe('Test for index', function () {
    it('Verifies successful response', async () => {
        const result = await lambda.LambdaHandler();
        const expectedResult = null;
        expect(result).toEqual(expectedResult);
    });
});
