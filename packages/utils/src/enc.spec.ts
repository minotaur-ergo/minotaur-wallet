import { describe, expect, it } from 'vitest';

import { decrypt, encrypt } from './enc';

/**
 * Test suite for encryption utility functions
 */
describe('encryption utilities', () => {
  /**
   * Test suite for encrypt function
   */
  describe('encrypt', () => {
    /**
     * @target Encrypt buffer data with password
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Create buffer with test data
     * - Encrypt with password 'testpass'
     * @expect
     * - Returns encrypted string
     * - Result is different from original data
     */
    it('should encrypt buffer data with password', () => {
      const testData = Buffer.from('Hello World', 'utf8');
      const password = 'testpass';

      const encrypted = encrypt(testData, password);

      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(testData.toString());
      expect(encrypted.length).toBeGreaterThan(0);
    });

    /**
     * @target Encrypt empty buffer
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Create empty buffer
     * - Encrypt with password
     * @expect
     * - Returns encrypted string
     * - Does not throw error
     */
    it('should encrypt empty buffer', () => {
      const testData = Buffer.alloc(0);
      const password = 'testpass';

      const encrypted = encrypt(testData, password);

      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    /**
     * @target Encrypt with empty password
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Create buffer with test data
     * - Encrypt with empty password
     * @expect
     * - Returns encrypted string
     * - Does not throw error
     */
    it('should encrypt with empty password', () => {
      const testData = Buffer.from('test data', 'utf8');
      const password = '';

      const encrypted = encrypt(testData, password);

      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    /**
     * @target Encrypt large buffer data
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Create large buffer (10KB)
     * - Encrypt with password
     * @expect
     * - Returns encrypted string
     * - Handles large data without error
     */
    it('should encrypt large buffer data', () => {
      const largeData = Buffer.alloc(10240, 'a');
      const password = 'testpass';

      const encrypted = encrypt(largeData, password);

      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    /**
     * @target Encrypt binary data
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Create buffer with binary data (random bytes)
     * - Encrypt with password
     * @expect
     * - Returns encrypted string
     * - Handles binary data correctly
     */
    it('should encrypt binary data', () => {
      const binaryData = Buffer.from([0x00, 0xff, 0x80, 0x7f, 0x01, 0xfe]);
      const password = 'testpass';

      const encrypted = encrypt(binaryData, password);

      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    /**
     * @target Different passwords produce different results
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt same data with two different passwords
     * @expect
     * - Results are different strings
     */
    it('should produce different results with different passwords', () => {
      const testData = Buffer.from('same data', 'utf8');
      const password1 = 'password1';
      const password2 = 'password2';

      const encrypted1 = encrypt(testData, password1);
      const encrypted2 = encrypt(testData, password2);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  /**
   * Test suite for decrypt function
   */
  describe('decrypt', () => {
    /**
     * @target Decrypt encrypted data successfully
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt data then decrypt with same password
     * @expect
     * - Decrypted data matches original
     */
    it('should decrypt encrypted data successfully', () => {
      const originalData = Buffer.from('Hello World', 'utf8');
      const password = 'testpass';

      const encrypted = encrypt(originalData, password);
      const decrypted = decrypt(encrypted, password);

      expect(decrypted.equals(originalData)).toBe(true);
    });

    /**
     * @target Decrypt empty data
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt empty buffer then decrypt
     * @expect
     * - Returns empty buffer
     */
    it('should decrypt empty data', () => {
      const originalData = Buffer.alloc(0);
      const password = 'testpass';

      const encrypted = encrypt(originalData, password);
      const decrypted = decrypt(encrypted, password);

      expect(decrypted.equals(originalData)).toBe(true);
    });

    /**
     * @target Decrypt with wrong password returns empty buffer
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt data with one password
     * - Try to decrypt with different password
     * @expect
     * - Returns empty buffer instead of throwing error
     */
    it('should return empty buffer with wrong password', () => {
      const originalData = Buffer.from('secret data', 'utf8');
      const correctPassword = 'correct';
      const wrongPassword = 'wrong';

      const encrypted = encrypt(originalData, correctPassword);
      const result = decrypt(encrypted, wrongPassword);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /**
     * @target Decrypt large encrypted data
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt large buffer then decrypt
     * @expect
     * - Decrypted data matches original large data
     */
    it('should decrypt large encrypted data', () => {
      const largeData = Buffer.alloc(10240, 'x');
      const password = 'testpass';

      const encrypted = encrypt(largeData, password);
      const decrypted = decrypt(encrypted, password);

      expect(decrypted.equals(largeData)).toBe(true);
    });

    /**
     * @target Decrypt binary data
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt binary data then decrypt
     * @expect
     * - Decrypted binary data matches original
     */
    it('should decrypt binary data', () => {
      const binaryData = Buffer.from([0x00, 0xff, 0x80, 0x7f, 0x01, 0xfe]);
      const password = 'testpass';

      const encrypted = encrypt(binaryData, password);
      const decrypted = decrypt(encrypted, password);

      expect(decrypted.equals(binaryData)).toBe(true);
    });

    /**
     * @target Decrypt invalid encrypted string returns empty buffer
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Try to decrypt invalid/corrupted encrypted string
     * @expect
     * - Returns empty buffer instead of throwing error
     */
    it('should return empty buffer with invalid encrypted string', () => {
      const invalidEncrypted = 'invalid-encrypted-string';
      const password = 'testpass';

      const result = decrypt(invalidEncrypted, password);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /**
     * @target Decrypt empty encrypted string returns empty buffer
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Try to decrypt empty string
     * @expect
     * - Returns empty buffer
     */
    it('should return empty buffer with empty encrypted string', () => {
      const emptyEncrypted = '';
      const password = 'testpass';

      const result = decrypt(emptyEncrypted, password);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    /**
     * @target Decrypt with empty password returns empty buffer
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt data with non-empty password
     * - Try to decrypt with empty password
     * @expect
     * - Returns empty buffer
     */
    it('should return empty buffer when decrypting with empty password', () => {
      const originalData = Buffer.from('test data', 'utf8');
      const password = 'testpass';
      const emptyPassword = '';

      const encrypted = encrypt(originalData, password);
      const result = decrypt(encrypted, emptyPassword);

      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  /**
   * Test suite for encrypt/decrypt round trip
   */
  describe('encrypt/decrypt round trip', () => {
    /**
     * @target Multiple round trips preserve data
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt and decrypt data multiple times
     * @expect
     * - Data remains unchanged after multiple round trips
     */
    it('should preserve data through multiple round trips', () => {
      const originalData = Buffer.from('test data for round trips', 'utf8');
      const password = 'testpass';
      let currentData = originalData;

      // Perform 5 round trips
      for (let i = 0; i < 5; i++) {
        const encrypted = encrypt(currentData, password);
        currentData = decrypt(encrypted, password);
      }

      expect(currentData.equals(originalData)).toBe(true);
    });

    /**
     * @target Unicode data preservation
     * @dependencies
     * - crypto-js library
     * @scenario
     * - Encrypt and decrypt Unicode text
     * @expect
     * - Unicode characters are preserved correctly
     */
    it('should preserve unicode data', () => {
      const unicodeData = Buffer.from('Hello 世界 🌍 مرحبا', 'utf8');
      const password = 'testpass';

      const encrypted = encrypt(unicodeData, password);
      const decrypted = decrypt(encrypted, password);

      expect(decrypted.equals(unicodeData)).toBe(true);
      expect(decrypted.toString('utf8')).toBe('Hello 世界 🌍 مرحبا');
    });
  });
});
