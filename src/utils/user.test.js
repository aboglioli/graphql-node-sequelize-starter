const { generateValidationCode } = require('./user');

describe('User utils', () => {
  test('Generate validation code', () => {
    const code = generateValidationCode();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
  });
});
