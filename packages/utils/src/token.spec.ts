import { describe, expect, it } from 'vitest';

import {
  ergPriceUsd,
  numberWithDecimalToBigInt,
  tokenPriceUsd,
  tokenStr,
} from './token';

/**
 * Test suite for token utility functions
 */
describe('token utilities', () => {
  /**
   * Test suite for tokenStr function
   */
  describe('tokenStr', () => {
    /**
     * @target Format token amount with decimals
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 1000000n and 6 decimals
     * @expect
     * - Returns '1' (1.000000 with trailing zeros removed)
     */
    it('should format token amount with decimals', () => {
      const amount = 1000000n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('1');
    });

    /**
     * @target Format token amount with decimal places
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 1234567n and 6 decimals
     * @expect
     * - Returns '1.234567'
     */
    it('should format token amount with decimal places', () => {
      const amount = 1234567n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('1.234567');
    });

    /**
     * @target Remove trailing zeros from decimal part
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 1230000n and 6 decimals
     * @expect
     * - Returns '1.23' (trailing zeros removed)
     */
    it('should remove trailing zeros from decimal part', () => {
      const amount = 1230000n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('1.23');
    });

    /**
     * @target Handle zero amount
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 0n and any decimals
     * @expect
     * - Returns '0'
     */
    it('should handle zero amount', () => {
      const amount = 0n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('0');
    });

    /**
     * @target Handle amount smaller than decimal unit
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 123n and 6 decimals
     * @expect
     * - Returns '0.000123'
     */
    it('should handle amount smaller than decimal unit', () => {
      const amount = 123n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('0.000123');
    });

    /**
     * @target Handle zero decimals
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 12345n and 0 decimals
     * @expect
     * - Returns '12345' (no decimal point)
     */
    it('should handle zero decimals', () => {
      const amount = 12345n;
      const decimal = 0;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('12345');
    });

    /**
     * @target Limit decimal display with displayDecimal parameter
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 1234567n, 6 decimals, and displayDecimal 2
     * @expect
     * - Returns '1.23' (limited to 2 decimal places)
     */
    it('should limit decimal display with displayDecimal parameter', () => {
      const amount = 1234567n;
      const decimal = 6;
      const displayDecimal = 2;

      const result = tokenStr(amount, decimal, displayDecimal);

      expect(result).toBe('1.23');
    });

    /**
     * @target Handle displayDecimal larger than decimal
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with displayDecimal larger than actual decimals
     * @expect
     * - Returns result limited by actual decimal places
     */
    it('should handle displayDecimal larger than decimal', () => {
      const amount = 1230000n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('1.23');
    });

    /**
     * @target Handle displayDecimal of zero
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with displayDecimal 0
     * @expect
     * - Returns integer part only
     */
    it('should handle displayDecimal of zero', () => {
      const amount = 1234567n;
      const decimal = 6;
      const displayDecimal = 0;

      const result = tokenStr(amount, decimal, displayDecimal);

      expect(result).toBe('1');
    });

    /**
     * @target Handle very large amounts
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with very large bigint amount
     * @expect
     * - Returns correctly formatted large number
     */
    it('should handle very large amounts', () => {
      const amount = BigInt('123456789012345678901234567890');
      const decimal = 18;

      const result = tokenStr(amount, decimal);

      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d+(\.\d+)?$/);
    });

    /**
     * @target Handle negative amounts
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with negative amount
     * @expect
     * - Returns formatted negative number
     */
    it('should handle negative amounts', () => {
      const amount = -1234567n;
      const decimal = 6;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('-1.234567');
    });

    /**
     * @target Handle single unit amount
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call tokenStr with amount 1n and high decimals
     * @expect
     * - Returns smallest unit representation
     */
    it('should handle single unit amount', () => {
      const amount = 1n;
      const decimal = 8;

      const result = tokenStr(amount, decimal);

      expect(result).toBe('0.00000001');
    });
  });

  /**
   * Test suite for tokenPriceUsd function
   */
  describe('tokenPriceUsd', () => {
    /**
     * @target Calculate USD price for token amount
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with amount 1000000000n, 9 decimals, and price 100
     * @expect
     * - Returns formatted USD price string
     */
    it('should calculate USD price for token amount', () => {
      const amount = 1000000000n; // 1 token with 9 decimals
      const decimals = 9;
      const tokenPrice = 100; // $100 per token

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('100.00');
    });

    /**
     * @target Handle fractional token amounts
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with fractional amount and price
     * @expect
     * - Returns correctly calculated USD value
     */
    it('should handle fractional token amounts', () => {
      const amount = 500000000n; // 0.5 token with 9 decimals
      const decimals = 9;
      const tokenPrice = 200; // $200 per token

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('100.00');
    });

    /**
     * @target Handle zero amount
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with zero amount
     * @expect
     * - Returns '0.00'
     */
    it('should handle zero amount', () => {
      const amount = 0n;
      const decimals = 9;
      const tokenPrice = 100;

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle zero price
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with zero price
     * @expect
     * - Returns '0.00'
     */
    it('should handle zero price', () => {
      const amount = 1000000000n;
      const decimals = 9;
      const tokenPrice = 0;

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle fractional prices
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with fractional price
     * @expect
     * - Returns correctly calculated USD value
     */
    it('should handle fractional prices', () => {
      const amount = 1000000000n; // 1 token
      const decimals = 9;
      const tokenPrice = 0.5; // $0.50 per token

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('0.50');
    });

    /**
     * @target Handle large amounts with commas
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with large amount resulting in comma-separated value
     * @expect
     * - Returns formatted value with commas
     */
    it('should handle large amounts with commas', () => {
      const amount = 10000000000000n; // 10,000 tokens with 9 decimals
      const decimals = 9;
      const tokenPrice = 100;

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('1,000,000.00');
    });

    /**
     * @target Handle very small amounts
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with very small amount
     * @expect
     * - Returns correctly calculated small USD value
     */
    it('should handle very small amounts', () => {
      const amount = 1n; // smallest unit
      const decimals = 9;
      const tokenPrice = 1000000; // $1M per token

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle high precision calculations
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceUsd with high precision decimals
     * @expect
     * - Returns correctly calculated value
     */
    it('should handle high precision calculations', () => {
      const amount = BigInt('1000000000000000000'); // 1 token with 18 decimals
      const decimals = 18;
      const tokenPrice = 50;

      const result = tokenPriceUsd(amount, decimals, tokenPrice);

      expect(result).toBe('50.00');
    });
  });

  /**
   * Test suite for ergPriceUsd function
   */
  describe('ergPriceUsd', () => {
    /**
     * @target Calculate ERG price in USD
     * @dependencies
     * - tokenPriceUsd function
     * @scenario
     * - Call ergPriceUsd with 1000000000n (1 ERG) and price 5
     * @expect
     * - Returns '5.00'
     */
    it('should calculate ERG price in USD', () => {
      const amount = 1000000000n; // 1 ERG (9 decimals)
      const ergPrice = 5; // $5 per ERG

      const result = ergPriceUsd(amount, ergPrice);

      expect(result).toBe('5.00');
    });

    /**
     * @target Handle fractional ERG amounts
     * @dependencies
     * - tokenPriceUsd function
     * @scenario
     * - Call ergPriceUsd with 500000000n (0.5 ERG) and price 10
     * @expect
     * - Returns '5.00'
     */
    it('should handle fractional ERG amounts', () => {
      const amount = 500000000n; // 0.5 ERG
      const ergPrice = 10;

      const result = ergPriceUsd(amount, ergPrice);

      expect(result).toBe('5.00');
    });

    /**
     * @target Handle zero ERG amount
     * @dependencies
     * - tokenPriceUsd function
     * @scenario
     * - Call ergPriceUsd with 0n amount
     * @expect
     * - Returns '0.00'
     */
    it('should handle zero ERG amount', () => {
      const amount = 0n;
      const ergPrice = 5;

      const result = ergPriceUsd(amount, ergPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle large ERG amounts
     * @dependencies
     * - tokenPriceUsd function
     * @scenario
     * - Call ergPriceUsd with large amount
     * @expect
     * - Returns formatted value with commas
     */
    it('should handle large ERG amounts', () => {
      const amount = 1000000000000n; // 1,000 ERG
      const ergPrice = 5;

      const result = ergPriceUsd(amount, ergPrice);

      expect(result).toBe('5,000.00');
    });

    /**
     * @target Use 9 decimals by default
     * @dependencies
     * - tokenPriceUsd function
     * @scenario
     * - Verify ergPriceUsd uses 9 decimals for ERG
     * @expect
     * - Calculates correctly with ERG's 9 decimal places
     */
    it('should use 9 decimals by default', () => {
      const amount = 123456789n; // 0.123456789 ERG
      const ergPrice = 100;

      const result = ergPriceUsd(amount, ergPrice);

      expect(result).toBe('12.34');
    });
  });

  /**
   * Test suite for numberWithDecimalToBigInt function
   */
  describe('numberWithDecimalToBigInt', () => {
    /**
     * @target Convert decimal string to bigint
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call numberWithDecimalToBigInt with '123.456' and 6 decimals
     * @expect
     * - Returns 123456000n
     */
    it('should convert decimal string to bigint', () => {
      const amount = '123.456';
      const decimal = 6;

      const result = numberWithDecimalToBigInt(amount, decimal);

      expect(result).toBe(123456000n);
    });

    /**
     * @target Handle integer string
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call numberWithDecimalToBigInt with '123' and 6 decimals
     * @expect
     * - Returns 123000000n
     */
    it('should handle integer string', () => {
      const amount = '123';
      const decimal = 6;

      const result = numberWithDecimalToBigInt(amount, decimal);

      expect(result).toBe(123000000n);
    });

    /**
     * @target Handle empty string
     * @dependencies
     * - None
     * @scenario
     * - Call numberWithDecimalToBigInt with empty string
     * @expect
     * - Returns 0n
     */
    it('should handle empty string', () => {
      const amount = '';
      const decimal = 6;

      const result = numberWithDecimalToBigInt(amount, decimal);

      expect(result).toBe(0n);
    });

    /**
     * @target Use default 9 decimals
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call numberWithDecimalToBigInt with '1.5' and no decimal parameter
     * @expect
     * - Returns 1500000000n (9 decimals)
     */
    it('should use default 9 decimals', () => {
      const amount = '1.5';

      const result = numberWithDecimalToBigInt(amount);

      expect(result).toBe(1500000000n);
    });

    /**
     * @target Handle string with fewer decimals than specified
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call numberWithDecimalToBigInt with '1.23' and 6 decimals
     * @expect
     * - Returns 1230000n (padded with zeros)
     */
    it('should handle string with fewer decimals than specified', () => {
      const amount = '1.23';
      const decimal = 6;

      const result = numberWithDecimalToBigInt(amount, decimal);

      expect(result).toBe(1230000n);
    });

    /**
     * @target Throw error for invalid number format
     * @dependencies
     * - None
     * @scenario
     * - Call numberWithDecimalToBigInt with invalid format '123.456.789'
     * @expect
     * - Throws error with message about invalid format
     */
    it('should throw error for invalid number format', () => {
      const amount = '123.456.789';
      const decimal = 6;

      expect(() => {
        numberWithDecimalToBigInt(amount, decimal);
      }).toThrow('Invalid number in format');
    });

    /**
     * @target Throw error for non-numeric characters
     * @dependencies
     * - None
     * @scenario
     * - Call numberWithDecimalToBigInt with non-numeric characters 'abc'
     * @expect
     * - Throws error with message about invalid format
     */
    it('should throw error for non-numeric characters', () => {
      const amount = 'abc';
      const decimal = 6;

      expect(() => {
        numberWithDecimalToBigInt(amount, decimal);
      }).toThrow('Invalid number in format');
    });

    /**
     * @target Throw error for too many decimal places
     * @dependencies
     * - None
     * @scenario
     * - Call numberWithDecimalToBigInt with '1.1234' and 3 decimals
     * @expect
     * - Throws error about too many decimals
     */
    it('should throw error for too many decimal places', () => {
      const amount = '1.1234';
      const decimal = 3;

      expect(() => {
        numberWithDecimalToBigInt(amount, decimal);
      }).toThrow('more than allowed decimals');
    });

    /**
     * @target Handle zero decimal places
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call numberWithDecimalToBigInt with '123' and 0 decimals
     * @expect
     * - Returns 123n
     */
    it('should handle zero decimal places', () => {
      const amount = '123';
      const decimal = 0;

      const result = numberWithDecimalToBigInt(amount, decimal);

      expect(result).toBe(123n);
    });

    /**
     * @target Handle large numbers
     * @dependencies
     * - createEmptyArray function from array module
     * @scenario
     * - Call numberWithDecimalToBigInt with large number
     * @expect
     * - Returns correct bigint value
     */
    it('should handle large numbers', () => {
      const amount = '9999999999.999999';
      const decimal = 6;

      const result = numberWithDecimalToBigInt(amount, decimal);

      expect(result).toBe(9999999999999999n);
    });
  });
});
