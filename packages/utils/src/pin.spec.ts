import { describe, expect, it } from 'vitest';

import { getPinHash, honeyPinType } from './pin';

/**
 * Test suite for PIN utility functions
 */
describe('PIN utilities', () => {
  /**
   * Test suite for getPinHash function
   */
  describe('getPinHash', () => {
    /**
     * @target Generate hash for valid PIN
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with valid PIN string
     * @expect
     * - Returns 64-character hex string (32 bytes)
     */
    it('should generate hash for valid PIN', () => {
      const pin = '123456';

      const hash = getPinHash(pin);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64); // 32 bytes = 64 hex characters
      expect(hash).toMatch(/^[0-9a-f]+$/); // Only hex characters
    });

    /**
     * @target Generate consistent hash for same PIN
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash multiple times with same PIN
     * @expect
     * - Returns identical hash each time
     */
    it('should generate consistent hash for same PIN', () => {
      const pin = '987654';

      const hash1 = getPinHash(pin);
      const hash2 = getPinHash(pin);
      const hash3 = getPinHash(pin);

      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
    });

    /**
     * @target Generate different hashes for different PINs
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with different PIN strings
     * @expect
     * - Returns different hashes for different PINs
     */
    it('should generate different hashes for different PINs', () => {
      const pin1 = '123456';
      const pin2 = '654321';
      const pin3 = '111111';

      const hash1 = getPinHash(pin1);
      const hash2 = getPinHash(pin2);
      const hash3 = getPinHash(pin3);

      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    /**
     * @target Handle empty PIN string
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with empty string
     * @expect
     * - Returns valid 64-character hash
     * - Does not throw error
     */
    it('should handle empty PIN string', () => {
      const pin = '';

      const hash = getPinHash(pin);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle single character PIN
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with single character
     * @expect
     * - Returns valid 64-character hash
     */
    it('should handle single character PIN', () => {
      const pin = '1';

      const hash = getPinHash(pin);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle very long PIN string
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with very long string (1000 characters)
     * @expect
     * - Returns valid 64-character hash
     * - Handles long input without error
     */
    it('should handle very long PIN string', () => {
      const pin = '1'.repeat(1000);

      const hash = getPinHash(pin);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle PIN with special characters
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with special characters and symbols
     * @expect
     * - Returns valid 64-character hash
     * - Handles special characters correctly
     */
    it('should handle PIN with special characters', () => {
      const pin = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      const hash = getPinHash(pin);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle PIN with Unicode characters
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with Unicode characters
     * @expect
     * - Returns valid 64-character hash
     * - Handles Unicode correctly
     */
    it('should handle PIN with Unicode characters', () => {
      const pin = '世界🌍مرحبا';

      const hash = getPinHash(pin);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * @target Handle PIN with whitespace
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with whitespace characters
     * @expect
     * - Returns valid hash
     * - Whitespace affects hash result
     */
    it('should handle PIN with whitespace', () => {
      const pin1 = '123456';
      const pin2 = ' 123456 ';
      const pin3 = '123 456';

      const hash1 = getPinHash(pin1);
      const hash2 = getPinHash(pin2);
      const hash3 = getPinHash(pin3);

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });

    /**
     * @target Case sensitivity in PIN hashing
     * @dependencies
     * - blakejs library
     * @scenario
     * - Call getPinHash with same PIN in different cases
     * @expect
     * - Returns different hashes for different cases
     */
    it('should be case sensitive', () => {
      const pin1 = 'abc123';
      const pin2 = 'ABC123';
      const pin3 = 'Abc123';

      const hash1 = getPinHash(pin1);
      const hash2 = getPinHash(pin2);
      const hash3 = getPinHash(pin3);

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });
  });

  /**
   * Test suite for honeyPinType function
   */
  describe('honeyPinType', () => {
    /**
     * @target Add honey suffix to PIN type
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with valid PIN type string
     * @expect
     * - Returns string with '[honey]' suffix
     */
    it('should add honey suffix to PIN type', () => {
      const pinType = 'wallet';

      const result = honeyPinType(pinType);

      expect(result).toBe('wallet[honey]');
    });

    /**
     * @target Handle empty PIN type
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with empty string
     * @expect
     * - Returns '[honey]' only
     */
    it('should handle empty PIN type', () => {
      const pinType = '';

      const result = honeyPinType(pinType);

      expect(result).toBe('[honey]');
    });

    /**
     * @target Handle PIN type with special characters
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with special characters
     * @expect
     * - Returns string with special characters preserved and '[honey]' suffix
     */
    it('should handle PIN type with special characters', () => {
      const pinType = 'wallet-type_123!@#';

      const result = honeyPinType(pinType);

      expect(result).toBe('wallet-type_123!@#[honey]');
    });

    /**
     * @target Handle PIN type with whitespace
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with whitespace in PIN type
     * @expect
     * - Returns string with whitespace preserved and '[honey]' suffix
     */
    it('should handle PIN type with whitespace', () => {
      const pinType = ' wallet type ';

      const result = honeyPinType(pinType);

      expect(result).toBe(' wallet type [honey]');
    });

    /**
     * @target Handle PIN type with Unicode characters
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with Unicode characters
     * @expect
     * - Returns string with Unicode preserved and '[honey]' suffix
     */
    it('should handle PIN type with Unicode characters', () => {
      const pinType = '钱包🔒';

      const result = honeyPinType(pinType);

      expect(result).toBe('钱包🔒[honey]');
    });

    /**
     * @target Handle very long PIN type
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with very long string
     * @expect
     * - Returns long string with '[honey]' suffix
     */
    it('should handle very long PIN type', () => {
      const pinType = 'a'.repeat(1000);

      const result = honeyPinType(pinType);

      expect(result).toBe(pinType + '[honey]');
      expect(result).toHaveLength(1007); // 1000 + 7 for '[honey]'
    });

    /**
     * @target Handle PIN type already containing brackets
     * @dependencies
     * - None
     * @scenario
     * - Call honeyPinType with PIN type containing brackets
     * @expect
     * - Returns string with existing brackets preserved and '[honey]' suffix added
     */
    it('should handle PIN type with existing brackets', () => {
      const pinType = 'wallet[type]';

      const result = honeyPinType(pinType);

      expect(result).toBe('wallet[type][honey]');
    });
  });
});
