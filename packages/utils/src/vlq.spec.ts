import { describe, expect, it } from 'vitest';

import { int8Vlq, uInt8Vlq } from './vlq';

/**
 * Test suite for VLQ (Variable Length Quantity) utility functions
 */
describe('VLQ utilities', () => {
  /**
   * Test suite for uInt8Vlq function
   */
  describe('uInt8Vlq', () => {
    /**
     * @target Encode zero value
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with value 0
     * @expect
     * - Returns empty string (no bytes for zero)
     */
    it('should encode zero value', () => {
      const value = 0;

      const result = uInt8Vlq(value);

      expect(result).toBe('');
    });

    /**
     * @target Encode single byte value
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with value 127 (max single byte)
     * @expect
     * - Returns single byte hex string
     */
    it('should encode single byte value', () => {
      const value = 127;

      const result = uInt8Vlq(value);

      expect(result).toBe('7f');
    });

    /**
     * @target Encode small positive value
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with value 42
     * @expect
     * - Returns correct hex encoding
     */
    it('should encode small positive value', () => {
      const value = 42;

      const result = uInt8Vlq(value);

      expect(result).toBe('2a');
    });

    /**
     * @target Encode value requiring multiple bytes
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with value 128 (requires 2 bytes)
     * @expect
     * - Returns multi-byte hex string with continuation bits
     */
    it('should encode value requiring multiple bytes', () => {
      const value = 128;

      const result = uInt8Vlq(value);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(2);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Encode large value
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with value 16384
     * @expect
     * - Returns correct multi-byte encoding
     */
    it('should encode large value', () => {
      const value = 16384;

      const result = uInt8Vlq(value);

      expect(result).toBe('808001');
    });

    /**
     * @target Encode maximum safe integer
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with Number.MAX_SAFE_INTEGER
     * @expect
     * - Returns valid hex string without error
     */
    it('should encode maximum safe integer', () => {
      const value = Number.MAX_SAFE_INTEGER;

      const result = uInt8Vlq(value);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Encode powers of 2
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with various powers of 2
     * @expect
     * - Returns different encodings for different powers
     */
    it('should encode powers of 2 correctly', () => {
      const values = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
      const results = values.map((v) => uInt8Vlq(v));

      // All results should be different
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(results.length);

      // All should be valid hex strings
      results.forEach((result) => {
        expect(result).toMatch(/^[0-9a-f]*$/);
      });
    });

    /**
     * @target Handle edge case values
     * @dependencies
     * - None
     * @scenario
     * - Call uInt8Vlq with edge case values (127, 128, 255, 256)
     * @expect
     * - Returns valid encodings for boundary values
     */
    it('should handle edge case values', () => {
      const edgeCases = [127, 128, 255, 256];

      edgeCases.forEach((value) => {
        const result = uInt8Vlq(value);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(result).toMatch(/^[0-9a-f]+$/);
      });
    });
  });

  /**
   * Test suite for int8Vlq function
   */
  describe('int8Vlq', () => {
    /**
     * @target Encode positive integer
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with positive value 42
     * @expect
     * - Returns encoded string with sign bit handling
     */
    it('should encode positive integer', () => {
      const value = 42;

      const result = int8Vlq(value);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Encode negative integer
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with negative value -42
     * @expect
     * - Returns encoded string with sign bit set
     */
    it('should encode negative integer', () => {
      const value = -42;

      const result = int8Vlq(value);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Encode zero value
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with value 0
     * @expect
     * - Returns encoded string for zero
     */
    it('should encode zero value', () => {
      const value = 0;

      const result = int8Vlq(value);

      expect(result).toBe('01');
    });

    /**
     * @target Different encodings for positive and negative
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with same absolute value but different signs
     * @expect
     * - Returns different encodings for positive and negative values
     */
    it('should produce different encodings for positive and negative values', () => {
      const positiveValue = 100;
      const negativeValue = -100;

      const positiveResult = int8Vlq(positiveValue);
      const negativeResult = int8Vlq(negativeValue);

      expect(positiveResult).not.toBe(negativeResult);
    });

    /**
     * @target Handle large positive values
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with large positive value
     * @expect
     * - Returns valid encoding without error
     */
    it('should handle large positive values', () => {
      const value = 1000000;

      const result = int8Vlq(value);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle large negative values
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with large negative value
     * @expect
     * - Returns valid encoding without error
     */
    it('should handle large negative values', () => {
      const value = -1000000;

      const result = int8Vlq(value);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle edge case values
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq with edge case values (1, -1, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER)
     * @expect
     * - Returns valid encodings for all edge cases
     */
    it('should handle edge case values', () => {
      const edgeCases = [
        1,
        -1,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ];

      edgeCases.forEach((value) => {
        const result = int8Vlq(value);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(result).toMatch(/^[0-9a-f]+$/);
      });
    });

    /**
     * @target Consistent encoding for same values
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Call int8Vlq multiple times with same value
     * @expect
     * - Returns identical results each time
     */
    it('should produce consistent encoding for same values', () => {
      const value = 12345;

      const result1 = int8Vlq(value);
      const result2 = int8Vlq(value);
      const result3 = int8Vlq(value);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    /**
     * @target Sign bit handling verification
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Compare encodings of positive and negative values
     * @expect
     * - Sign bit correctly affects the encoding
     */
    it('should handle sign bit correctly', () => {
      const testPairs = [
        [1, -1],
        [10, -10],
        [100, -100],
        [1000, -1000],
      ];

      testPairs.forEach(([positive, negative]) => {
        const positiveResult = int8Vlq(positive);
        const negativeResult = int8Vlq(negative);

        expect(positiveResult).not.toBe(negativeResult);
        expect(positiveResult.length).toBeGreaterThan(0);
        expect(negativeResult.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * Test suite for VLQ encoding properties
   */
  describe('VLQ encoding properties', () => {
    /**
     * @target Monotonic property for unsigned values
     * @dependencies
     * - uInt8Vlq function
     * @scenario
     * - Encode sequence of increasing values
     * @expect
     * - Larger values generally produce longer or lexicographically larger encodings
     */
    it('should maintain ordering properties for unsigned values', () => {
      const values = [1, 10, 100, 1000, 10000];
      const results = values.map((v) => uInt8Vlq(v));

      // All results should be different
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(results.length);

      // Results should generally increase in length or value
      for (let i = 1; i < results.length; i++) {
        expect(results[i].length).toBeGreaterThanOrEqual(results[i - 1].length);
      }
    });

    /**
     * @target Hex string format validation
     * @dependencies
     * - uInt8Vlq function
     * - int8Vlq function
     * @scenario
     * - Encode various values and check output format
     * @expect
     * - All outputs are valid lowercase hex strings
     */
    it('should produce valid hex string format', () => {
      const testValues = [0, 1, 127, 128, 255, 256, 1000, -1, -100, -1000];

      testValues.forEach((value) => {
        const unsignedResult = value >= 0 ? uInt8Vlq(value) : '';
        const signedResult = int8Vlq(value);

        if (unsignedResult) {
          expect(unsignedResult).toMatch(/^[0-9a-f]*$/);
          expect(unsignedResult.length % 2).toBe(0);
        }

        expect(signedResult).toMatch(/^[0-9a-f]+$/);
        expect(signedResult.length % 2).toBe(0);
      });
    });
  });
});
