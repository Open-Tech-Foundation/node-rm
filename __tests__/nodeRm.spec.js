import nodeRm from '../lib/index.js';

describe('nodeRm', () => {
  test('index', () => {
    expect(nodeRm()).toMatch(/Hello World!/);
  });
});
