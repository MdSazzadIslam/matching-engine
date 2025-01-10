import { describe, it } from 'node:test';
import * as assert from 'node:assert';

describe('Testing the addition functionality', () => {
  it('should correctly sum two numbers', () => {
    assert.strictEqual(1 + 1, 2, 'The sum of 1 and 1 should be 2');
  });
});
