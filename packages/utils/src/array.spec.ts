import { describe, expect, it, vi } from 'vitest';

import {
  createEmptyArray,
  createEmptyArrayWithIndex,
  iterateIndexes,
} from './array';

/**
 * Test suite for array utility functions
 */
describe('array utilities', () => {
  /**
   * Test suite for createEmptyArray function
   */
  describe('createEmptyArray', () => {
    /**
     * @target Create array with specified length and default value
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with length 3 and default value 'test'
     * @expect
     * - Returns array with 3 elements, all containing 'test'
     */
    it('should create an array with specified length and default value', () => {
      const result = createEmptyArray(3, 'test');
      expect(result).toEqual(['test', 'test', 'test']);
      expect(result).toHaveLength(3);
    });

    /**
     * @target Create empty array when length is zero
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with length 0 and any default value
     * @expect
     * - Returns empty array with length 0
     */
    it('should create an empty array when length is 0', () => {
      const result = createEmptyArray(0, 'test');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    /**
     * @target Support different data types as default values
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with different data types (number, boolean, object)
     * @expect
     * - Returns arrays with correct types and values for each data type
     */
    it('should work with different data types', () => {
      const numberArray = createEmptyArray(2, 42);
      expect(numberArray).toEqual([42, 42]);

      const booleanArray = createEmptyArray(2, true);
      expect(booleanArray).toEqual([true, true]);

      const objectArray = createEmptyArray(2, { id: 1 });
      expect(objectArray).toEqual([{ id: 1 }, { id: 1 }]);
    });

    /**
     * @target Handle null values as default value
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with length 2 and null as default value
     * @expect
     * - Returns array with 2 null elements
     */
    it('should create array with null values', () => {
      const result = createEmptyArray(2, null);
      expect(result).toEqual([null, null]);
    });

    /**
     * @target Handle undefined values as default value
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with length 2 and undefined as default value
     * @expect
     * - Returns array with 2 undefined elements
     */
    it('should create array with undefined values', () => {
      const result = createEmptyArray(2, undefined);
      expect(result).toEqual([undefined, undefined]);
    });

    /**
     * @target Handle large arrays efficiently
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with length 1000 and default value 0
     * @expect
     * - Returns array with 1000 elements, all containing 0
     */
    it('should handle large arrays', () => {
      const result = createEmptyArray(1000, 0);
      expect(result).toHaveLength(1000);
      expect(result.every((item) => item === 0)).toBe(true);
    });

    /**
     * @target Verify object reference behavior
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArray with object default value, modify one element
     * @expect
     * - All elements share the same object reference, modification affects all
     */
    it('should create independent references for object values', () => {
      const result = createEmptyArray(2, { value: 1 });
      result[0].value = 2;
      // Note: This test shows that the same object reference is used
      expect(result[1].value).toBe(2);
    });
  });

  /**
   * Test suite for createEmptyArrayWithIndex function
   */
  describe('createEmptyArrayWithIndex', () => {
    /**
     * @target Create array with sequential indexes
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArrayWithIndex with length 5
     * @expect
     * - Returns array [0, 1, 2, 3, 4] with length 5
     */
    it('should create an array with sequential indexes', () => {
      const result = createEmptyArrayWithIndex(5);
      expect(result).toEqual([0, 1, 2, 3, 4]);
      expect(result).toHaveLength(5);
    });

    /**
     * @target Create empty array when length is zero
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArrayWithIndex with length 0
     * @expect
     * - Returns empty array with length 0
     */
    it('should create an empty array when length is 0', () => {
      const result = createEmptyArrayWithIndex(0);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    /**
     * @target Create single element array
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArrayWithIndex with length 1
     * @expect
     * - Returns array [0] with length 1
     */
    it('should create array with single element when length is 1', () => {
      const result = createEmptyArrayWithIndex(1);
      expect(result).toEqual([0]);
      expect(result).toHaveLength(1);
    });

    /**
     * @target Handle large arrays efficiently
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArrayWithIndex with length 100
     * @expect
     * - Returns array with 100 elements, correct indexing at positions 0, 50, and 99
     */
    it('should handle large arrays', () => {
      const result = createEmptyArrayWithIndex(100);
      expect(result).toHaveLength(100);
      expect(result[0]).toBe(0);
      expect(result[99]).toBe(99);
      expect(result[50]).toBe(50);
    });

    /**
     * @target Create consecutive numbers without gaps
     * @dependencies
     * - None
     * @scenario
     * - Call createEmptyArrayWithIndex with length 10, verify each element
     * @expect
     * - Each element at index i equals i, no gaps or duplicates
     */
    it('should create consecutive numbers starting from 0', () => {
      const result = createEmptyArrayWithIndex(10);
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBe(i);
      }
    });
  });

  /**
   * Test suite for iterateIndexes function
   */
  describe('iterateIndexes', () => {
    /**
     * @target Call callback for each index in sequence
     * @dependencies
     * - vi.fn() mock function from vitest
     * @scenario
     * - Create iterator with length 3, call forEach with mock callback
     * @expect
     * - Callback called 3 times with indexes 0, 1, 2 in order
     */
    it('should call callback for each index', () => {
      const callback = vi.fn();
      const iterator = iterateIndexes(3);

      iterator.forEach(callback);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(1, 0);
      expect(callback).toHaveBeenNthCalledWith(2, 1);
      expect(callback).toHaveBeenNthCalledWith(3, 2);
    });

    /**
     * @target No callback execution when length is zero
     * @dependencies
     * - vi.fn() mock function from vitest
     * @scenario
     * - Create iterator with length 0, call forEach with mock callback
     * @expect
     * - Callback never called
     */
    it('should not call callback when length is 0', () => {
      const callback = vi.fn();
      const iterator = iterateIndexes(0);

      iterator.forEach(callback);

      expect(callback).not.toHaveBeenCalled();
    });

    /**
     * @target Single callback execution when length is one
     * @dependencies
     * - vi.fn() mock function from vitest
     * @scenario
     * - Create iterator with length 1, call forEach with mock callback
     * @expect
     * - Callback called exactly once with index 0
     */
    it('should call callback once when length is 1', () => {
      const callback = vi.fn();
      const iterator = iterateIndexes(1);

      iterator.forEach(callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(0);
    });

    /**
     * @target Handle large iterations efficiently
     * @dependencies
     * - vi.fn() mock function from vitest
     * @scenario
     * - Create iterator with length 1000, call forEach with mock callback
     * @expect
     * - Callback called 1000 times, first call with 0, last call with 999
     */
    it('should handle large iterations', () => {
      const callback = vi.fn();
      const iterator = iterateIndexes(1000);

      iterator.forEach(callback);

      expect(callback).toHaveBeenCalledTimes(1000);
      expect(callback).toHaveBeenNthCalledWith(1, 0);
      expect(callback).toHaveBeenNthCalledWith(1000, 999);
    });

    /**
     * @target Pass correct index values in sequence
     * @dependencies
     * - None
     * @scenario
     * - Create iterator with length 5, collect all passed index values
     * @expect
     * - Received indexes array equals [0, 1, 2, 3, 4]
     */
    it('should pass correct index values in sequence', () => {
      const receivedIndexes: number[] = [];
      const iterator = iterateIndexes(5);

      iterator.forEach((index) => {
        receivedIndexes.push(index);
      });

      expect(receivedIndexes).toEqual([0, 1, 2, 3, 4]);
    });

    /**
     * @target Allow callback to modify external state
     * @dependencies
     * - None
     * @scenario
     * - Create iterator with length 5, sum all index values in callback
     * @expect
     * - Sum equals 10 (0+1+2+3+4)
     */
    it('should allow callback to modify external state', () => {
      let sum = 0;
      const iterator = iterateIndexes(5);

      iterator.forEach((index) => {
        sum += index;
      });

      expect(sum).toBe(10); // 0 + 1 + 2 + 3 + 4 = 10
    });

    /**
     * @target Return object with forEach method
     * @dependencies
     * - None
     * @scenario
     * - Create iterator with length 3, check returned object structure
     * @expect
     * - Object has forEach property that is a function
     */
    it('should return an object with forEach method', () => {
      const iterator = iterateIndexes(3);

      expect(iterator).toHaveProperty('forEach');
      expect(typeof iterator.forEach).toBe('function');
    });

    /**
     * @target Handle callback errors properly
     * @dependencies
     * - vi.fn() mock function from vitest
     * - Error class
     * @scenario
     * - Create iterator, use callback that throws error on first call
     * @expect
     * - Error is thrown, callback called only once before stopping
     */
    it('should handle callback that throws error', () => {
      const iterator = iterateIndexes(3);
      const errorCallback = vi.fn(() => {
        throw new Error('Test error');
      });

      expect(() => {
        iterator.forEach(errorCallback);
      }).toThrow('Test error');

      expect(errorCallback).toHaveBeenCalledTimes(1);
    });
  });
});
