import { describe, expect, it } from 'vitest';

import {
  commaSeparate,
  dottedText,
  getValueColor,
  sliceToChunksString,
} from './txt';

/**
 * Test suite for text utility functions
 */
describe('text utilities', () => {
  /**
   * Test suite for commaSeparate function
   */
  describe('commaSeparate', () => {
    /**
     * @target Add commas from end (default behavior)
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with numeric string and default fromEnd=true
     * @expect
     * - Returns string with commas every 3 digits from right
     */
    it('should add commas from end by default', () => {
      const amount = '1234567';

      const result = commaSeparate(amount);

      expect(result).toBe('1,234,567');
    });

    /**
     * @target Add commas from end explicitly
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with fromEnd=true explicitly
     * @expect
     * - Returns string with commas every 3 digits from right
     */
    it('should add commas from end when fromEnd is true', () => {
      const amount = '9876543210';

      const result = commaSeparate(amount, true);

      expect(result).toBe('9,876,543,210');
    });

    /**
     * @target Add commas from start
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with fromEnd=false
     * @expect
     * - Returns string with commas every 3 characters from left
     */
    it('should add commas from start when fromEnd is false', () => {
      const amount = '1234567890';

      const result = commaSeparate(amount, false);

      expect(result).toBe('123,456,789,0');
    });

    /**
     * @target Handle empty string
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with empty string
     * @expect
     * - Returns empty string
     */
    it('should handle empty string', () => {
      const amount = '';

      const result = commaSeparate(amount);

      expect(result).toBe('');
    });

    /**
     * @target Handle single character
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with single character
     * @expect
     * - Returns same single character
     */
    it('should handle single character', () => {
      const amount = '5';

      const result = commaSeparate(amount);

      expect(result).toBe('5');
    });

    /**
     * @target Handle two characters
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with two characters
     * @expect
     * - Returns same two characters without comma
     */
    it('should handle two characters', () => {
      const amount = '42';

      const result = commaSeparate(amount);

      expect(result).toBe('42');
    });

    /**
     * @target Handle three characters
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with exactly three characters
     * @expect
     * - Returns same three characters without comma
     */
    it('should handle three characters', () => {
      const amount = '123';

      const result = commaSeparate(amount);

      expect(result).toBe('123');
    });

    /**
     * @target Handle four characters
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with four characters
     * @expect
     * - Returns string with one comma
     */
    it('should handle four characters', () => {
      const amount = '1234';

      const result = commaSeparate(amount);

      expect(result).toBe('1,234');
    });

    /**
     * @target Handle non-numeric characters
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with alphabetic string
     * @expect
     * - Returns string with commas every 3 characters
     */
    it('should handle non-numeric characters', () => {
      const amount = 'abcdefghij';

      const result = commaSeparate(amount);

      expect(result).toBe('a,bcd,efg,hij');
    });

    /**
     * @target Handle mixed characters
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with mixed alphanumeric string
     * @expect
     * - Returns string with commas every 3 characters
     */
    it('should handle mixed characters', () => {
      const amount = 'abc123xyz789';

      const result = commaSeparate(amount);

      expect(result).toBe('abc,123,xyz,789');
    });

    /**
     * @target Handle very long string
     * @dependencies
     * - None
     * @scenario
     * - Call commaSeparate with very long string
     * @expect
     * - Returns string with appropriate comma placement
     */
    it('should handle very long string', () => {
      const amount = '1'.repeat(20);

      const result = commaSeparate(amount);

      expect(result).toBe('11,111,111,111,111,111,111');
    });
  });

  /**
   * Test suite for dottedText function
   */
  describe('dottedText', () => {
    /**
     * @target Truncate long text with dots
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with long text and padding size 3
     * @expect
     * - Returns text with first 3 chars + '...' + last 3 chars
     */
    it('should truncate long text with dots', () => {
      const text = 'abcdefghijklmnop';
      const paddingSize = 3;

      const result = dottedText(text, paddingSize);

      expect(result).toBe('abc...nop');
    });

    /**
     * @target Return original text when short enough
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with text shorter than 2 * paddingSize
     * @expect
     * - Returns original text unchanged
     */
    it('should return original text when short enough', () => {
      const text = 'short';
      const paddingSize = 3;

      const result = dottedText(text, paddingSize);

      expect(result).toBe('short');
    });

    /**
     * @target Handle text exactly at boundary
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with text length exactly 2 * paddingSize
     * @expect
     * - Returns original text unchanged
     */
    it('should handle text exactly at boundary', () => {
      const text = 'abcdef'; // length 6
      const paddingSize = 3; // 2 * 3 = 6

      const result = dottedText(text, paddingSize);

      expect(result).toBe('abcdef');
    });

    /**
     * @target Handle empty string
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with empty string
     * @expect
     * - Returns empty string
     */
    it('should handle empty string', () => {
      const text = '';
      const paddingSize = 3;

      const result = dottedText(text, paddingSize);

      expect(result).toBe('');
    });

    /**
     * @target Handle zero padding size
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with paddingSize 0
     * @expect
     * - Returns '...' for non-empty text
     */
    it('should handle zero padding size', () => {
      const text = 'hello';
      const paddingSize = 0;

      const result = dottedText(text, paddingSize);

      expect(result).toBe('...');
    });

    /**
     * @target Handle large padding size
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with padding larger than text length
     * @expect
     * - Returns original text
     */
    it('should handle large padding size', () => {
      const text = 'short';
      const paddingSize = 10;

      const result = dottedText(text, paddingSize);

      expect(result).toBe('short');
    });

    /**
     * @target Handle single character text
     * @dependencies
     * - None
     * @scenario
     * - Call dottedText with single character and padding 1
     * @expect
     * - Returns original character
     */
    it('should handle single character text', () => {
      const text = 'a';
      const paddingSize = 1;

      const result = dottedText(text, paddingSize);

      expect(result).toBe('a');
    });
  });

  /**
   * Test suite for sliceToChunksString function
   */
  describe('sliceToChunksString', () => {
    /**
     * @target Slice string into chunks of specified size
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with string and chunk size 3
     * @expect
     * - Returns array of strings, each with max 3 characters
     */
    it('should slice string into chunks of specified size', () => {
      const str = 'abcdefghij';
      const chunkSize = 3;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual(['abc', 'def', 'ghi', 'j']);
    });

    /**
     * @target Handle empty string
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with empty string
     * @expect
     * - Returns empty array
     */
    it('should handle empty string', () => {
      const str = '';
      const chunkSize = 3;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual([]);
    });

    /**
     * @target Handle chunk size larger than string
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with chunk size larger than string length
     * @expect
     * - Returns array with single element containing entire string
     */
    it('should handle chunk size larger than string', () => {
      const str = 'hello';
      const chunkSize = 10;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual(['hello']);
    });

    /**
     * @target Handle chunk size of 1
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with chunk size 1
     * @expect
     * - Returns array where each character is separate element
     */
    it('should handle chunk size of 1', () => {
      const str = 'hello';
      const chunkSize = 1;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual(['h', 'e', 'l', 'l', 'o']);
    });

    /**
     * @target Handle string length exactly divisible by chunk size
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString where string length is multiple of chunk size
     * @expect
     * - Returns array with all chunks of equal size
     */
    it('should handle string length exactly divisible by chunk size', () => {
      const str = 'abcdef';
      const chunkSize = 2;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual(['ab', 'cd', 'ef']);
    });

    /**
     * @target Handle zero chunk size
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with chunk size 0
     * @expect
     * - Returns empty array or handles gracefully
     */
    it('should handle zero chunk size', () => {
      const str = 'hello';
      const chunkSize = 0;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual([]);
    });

    /**
     * @target Handle negative chunk size
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with negative chunk size
     * @expect
     * - Returns empty array or handles gracefully
     */
    it('should handle negative chunk size', () => {
      const str = 'hello';
      const chunkSize = -1;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toEqual([]);
    });

    /**
     * @target Handle very large string
     * @dependencies
     * - None
     * @scenario
     * - Call sliceToChunksString with very large string
     * @expect
     * - Handles large input efficiently
     */
    it('should handle very large string', () => {
      const str = 'a'.repeat(10000);
      const chunkSize = 100;

      const result = sliceToChunksString(str, chunkSize);

      expect(result).toHaveLength(100);
      expect(result[0]).toHaveLength(100);
      expect(result[99]).toHaveLength(100);
    });
  });

  /**
   * Test suite for getValueColor function
   */
  describe('getValueColor', () => {
    /**
     * @target Return success color for positive value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with positive bigint
     * @expect
     * - Returns 'success.main'
     */
    it('should return success color for positive value', () => {
      const value = 100n;

      const result = getValueColor(value);

      expect(result).toBe('success.main');
    });

    /**
     * @target Return error color for negative value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with negative bigint
     * @expect
     * - Returns 'error.main'
     */
    it('should return error color for negative value', () => {
      const value = -50n;

      const result = getValueColor(value);

      expect(result).toBe('error.main');
    });

    /**
     * @target Return error color for zero value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with zero bigint
     * @expect
     * - Returns 'error.main'
     */
    it('should return warning color for zero value', () => {
      const value = 0n;

      const result = getValueColor(value);

      expect(result).toBe('warning.main');
    });

    /**
     * @target Handle very large positive value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with very large positive bigint
     * @expect
     * - Returns 'success.main'
     */
    it('should handle very large positive value', () => {
      const value = BigInt('999999999999999999999999999999');

      const result = getValueColor(value);

      expect(result).toBe('success.main');
    });

    /**
     * @target Handle very large negative value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with very large negative bigint
     * @expect
     * - Returns 'error.main'
     */
    it('should handle very large negative value', () => {
      const value = BigInt('-999999999999999999999999999999');

      const result = getValueColor(value);

      expect(result).toBe('error.main');
    });

    /**
     * @target Handle minimum positive value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with 1n
     * @expect
     * - Returns 'success.main'
     */
    it('should handle minimum positive value', () => {
      const value = 1n;

      const result = getValueColor(value);

      expect(result).toBe('success.main');
    });

    /**
     * @target Handle minimum negative value
     * @dependencies
     * - None
     * @scenario
     * - Call getValueColor with -1n
     * @expect
     * - Returns 'error.main'
     */
    it('should handle minimum negative value', () => {
      const value = -1n;

      const result = getValueColor(value);

      expect(result).toBe('error.main');
    });
  });
});
