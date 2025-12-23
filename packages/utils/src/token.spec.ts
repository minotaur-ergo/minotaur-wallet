import { BoxInfo, TokenValue } from '@minotaur-ergo/types';
import { describe, expect, it } from 'vitest';

import {
  ergPriceCurrency,
  getBoxTokensValue,
  numberWithDecimalToBigInt,
  tokenPriceCurrency,
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
   * Test suite for tokenPriceCurrency function
   */
  describe('tokenPriceCurrency', () => {
    /**
     * @target Calculate selected currency price for token amount
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with amount 1000000000n, 9 decimals, and price 100
     * @expect
     * - Returns formatted selected currency price string
     */
    it('should calculate selected currence price for token amount', () => {
      const amount = 1000000000n; // 1 token with 9 decimals
      const decimals = 9;
      const tokenPrice = 100; // 100 currency per token

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('100.00');
    });

    /**
     * @target Handle fractional token amounts
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with fractional amount and price
     * @expect
     * - Returns correctly calculated selected currency value
     */
    it('should handle fractional token amounts', () => {
      const amount = 500000000n; // 0.5 token with 9 decimals
      const decimals = 9;
      const tokenPrice = 200; // 200 currency per token

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('100.00');
    });

    /**
     * @target Handle zero amount
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with zero amount
     * @expect
     * - Returns '0.00'
     */
    it('should handle zero amount', () => {
      const amount = 0n;
      const decimals = 9;
      const tokenPrice = 100;

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle zero price
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with zero price
     * @expect
     * - Returns '0.00'
     */
    it('should handle zero price', () => {
      const amount = 1000000000n;
      const decimals = 9;
      const tokenPrice = 0;

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle fractional prices
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with fractional price
     * @expect
     * - Returns correctly calculated selected currency value
     */
    it('should handle fractional prices', () => {
      const amount = 1000000000n; // 1 token
      const decimals = 9;
      const tokenPrice = 0.5; // 0.50 currency per token

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('0.50');
    });

    /**
     * @target Handle large amounts with commas
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with large amount resulting in comma-separated value
     * @expect
     * - Returns formatted value with commas
     */
    it('should handle large amounts with commas', () => {
      const amount = 10000000000000n; // 10,000 tokens with 9 decimals
      const decimals = 9;
      const tokenPrice = 100;

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('1,000,000.00');
    });

    /**
     * @target Handle very small amounts
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with very small amount
     * @expect
     * - Returns correctly calculated small selected currency value
     */
    it('should handle very small amounts', () => {
      const amount = 1n; // smallest unit
      const decimals = 9;
      const tokenPrice = 1000000; // 1M currency per token

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle high precision calculations
     * @dependencies
     * - commaSeparate function from txt module
     * @scenario
     * - Call tokenPriceCurrency with high precision decimals
     * @expect
     * - Returns correctly calculated value
     */
    it('should handle high precision calculations', () => {
      const amount = BigInt('1000000000000000000'); // 1 token with 18 decimals
      const decimals = 18;
      const tokenPrice = 50;

      const result = tokenPriceCurrency(amount, decimals, tokenPrice);

      expect(result).toBe('50.00');
    });
  });

  /**
   * Test suite for ergPriceCurrency function
   */
  describe('ergPriceCurrency', () => {
    /**
     * @target Calculate ERG price in selected currency
     * @dependencies
     * - tokenPriceCurrency function
     * @scenario
     * - Call ergPriceCurrency with 1000000000n (1 ERG) and price 5
     * @expect
     * - Returns '5.00'
     */
    it('should calculate ERG price in selected currency', () => {
      const amount = 1000000000n; // 1 ERG (9 decimals)
      const ergPrice = 5; // 5 currency per ERG

      const result = ergPriceCurrency(amount, ergPrice);

      expect(result).toBe('5.00');
    });

    /**
     * @target Handle fractional ERG amounts
     * @dependencies
     * - tokenPriceCurrency function
     * @scenario
     * - Call ergPriceCurrency with 500000000n (0.5 ERG) and price 10
     * @expect
     * - Returns '5.00'
     */
    it('should handle fractional ERG amounts', () => {
      const amount = 500000000n; // 0.5 ERG
      const ergPrice = 10;

      const result = ergPriceCurrency(amount, ergPrice);

      expect(result).toBe('5.00');
    });

    /**
     * @target Handle zero ERG amount
     * @dependencies
     * - tokenPriceCurrency function
     * @scenario
     * - Call ergPriceCurrency with 0n amount
     * @expect
     * - Returns '0.00'
     */
    it('should handle zero ERG amount', () => {
      const amount = 0n;
      const ergPrice = 5;

      const result = ergPriceCurrency(amount, ergPrice);

      expect(result).toBe('0.00');
    });

    /**
     * @target Handle large ERG amounts
     * @dependencies
     * - tokenPriceCurrency function
     * @scenario
     * - Call ergPriceCurrency with large amount
     * @expect
     * - Returns formatted value with commas
     */
    it('should handle large ERG amounts', () => {
      const amount = 1000000000000n; // 1,000 ERG
      const ergPrice = 5;

      const result = ergPriceCurrency(amount, ergPrice);

      expect(result).toBe('5,000.00');
    });

    /**
     * @target Use 9 decimals by default
     * @dependencies
     * - tokenPriceCurrency function
     * @scenario
     * - Verify ergPriceCurrency uses 9 decimals for ERG
     * @expect
     * - Calculates correctly with ERG's 9 decimal places
     */
    it('should use 9 decimals by default', () => {
      const amount = 123456789n; // 0.123456789 ERG
      const ergPrice = 100;

      const result = ergPriceCurrency(amount, ergPrice);

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

  /**
   * Test suite for getBoxTokensValue function
   */
  describe('getBoxTokensValue', () => {
    /**
     * @target Calculate sum of box tokens
     * @dependencies
     * - Create BoxInfo only with serialized value and a map of tokenId -> TokenValue
     * - It uses deserializeBox to deserialize box serailized value and access its tokens
     * @scenario
     * - Create a box with 7 tokens. Create 10 TokenValue
     * @expect
     * - 3993263616
     */
    it('should calculate sum of box tokens', () => {
      const box: BoxInfo = {
        address: '',
        boxId: '',
        create: {
          index: 0,
          height: 0,
          tx: '',
          timestamp: 0,
        },
        serialized:
          'jrHjiwEACM0CA7QEyEeo7WDG9HPNiMV5vAAa6l1F822TkrXkOMrxq2rioWQHWjeMadRxgvKiiWkpXl3Rr9+4jUsEUtpfL/CeOOyuSMK/55vFi94WH2SadWD50baX1CJcV8kEDJEB5BgdrhNFQe6K/skpRMXAhD3rtA7Kt7t9KpNQJBAIBtsE9ExiwzrpdWz2/Ey2uaotEuz8hQpq1wzb+SiivdOXBBo2pcJJCjW+tNIOq7VmbwBLEDxxiayeBPDVvfR0/L1CSWCObcbpzzSjJ7IY9mRF6lRbTHEbRnbjkatLo3x78YJijHUzYU9Azs4llNVkVYmQEnzceSGfCCtglfuAgIK/k+/wCJoG2eVFpB/VHu/8XiDYGAc7+CDGNeKp2SImmRPg3jadvJo5AApfI2Dd2335YuI0P/l+SwgPra4UoxXVH37bWcLjHA08AQ==',
      };

      const tokenValues: Map<string, TokenValue> = new Map();
      // amount: 937276
      tokenValues.set(
        '9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d',
        {
          valueInErg: 0.0007942409305954882,
          decimal: 6,
        },
      );

      // amount: 5000000000000000
      tokenValues.set(
        'a37c7bf182628c7533614f40cece2594d564558990127cdc79219f082b6095fb',
        {
          valueInErg: 6.213072602665675e-8,
          decimal: 8,
        },
      );

      // amount: 1234321
      tokenValues.set(
        'f0d5bdf474fcbd4249608e6dc6e9cf34a327b218f66445ea545b4c711b4676e3',
        {
          valueInErg: 5.53307836062801e-8,
          decimal: 0,
        },
      );

      // amount: 69420
      tokenValues.set(
        '6ad70cdbf928a2bdd397041a36a5c2490a35beb4d20eabb5666f004b103c7189',
        {
          valueInErg: 4.539131081044265e-8,
          decimal: 0,
        },
      );

      // amount: 21069420
      tokenValues.set(
        'ebb40ecab7bb7d2a935024100806db04f44c62c33ae9756cf6fc4cb6b9aa2d12',
        {
          valueInErg: 2.0655165335746958e-8,
          decimal: 0,
        },
      );

      // amount: 1000000
      tokenValues.set(
        '1f649a7560f9d1b697d4225c57c9040c9101e4181dae134541ee8afec92944c5',
        {
          valueInErg: 3.7893573601280705e-7,
          decimal: 0,
        },
      );

      // amount: 99989936599999
      tokenValues.set(
        '5a378c69d47182f2a28969295e5dd1afdfb88d4b0452da5f2ff09e38ecae48c2',
        {
          valueInErg: 0,
          decimal: 4,
        },
      );

      // not exists in box
      tokenValues.set(
        '8b08cdd5449a9592a9e79711d7d79249d7a03c535d17efaee83e216e80a44c4b',
        {
          valueInErg: 0.03741669671878438,
          decimal: 3,
        },
      );
      tokenValues.set(
        'e023c5f382b6e96fbd878f6811aac73345489032157ad5affb84aefd4956c297',
        {
          valueInErg: 0.000010605139421605357,
          decimal: 0,
        },
      );
      tokenValues.set(
        'ed2197ebb2b958670cb568aeed54693617a3f3718d16d1a298b8c8d337193da0',
        {
          valueInErg: 0,
          decimal: 1,
        },
      );

      const result = getBoxTokensValue(box, tokenValues);

      expect(result).toBe(3993263616);
    });

    /**
     * @target Handle empty tokenValues
     * @dependencies
     * - Create BoxInfo only with serialized value and a empty map
     * - It uses deserializeBox to deserialize box serailized value and access its tokens
     * @scenario
     * - TokenValues is not loaded yet, so it should give 0
     * @expect
     * - 0
     */
    it('should give 0 when tokenValues is not loaded', () => {
      const box: BoxInfo = {
        address: '',
        boxId: '',
        create: {
          index: 0,
          height: 0,
          tx: '',
          timestamp: 0,
        },
        serialized:
          'jrHjiwEACM0CA7QEyEeo7WDG9HPNiMV5vAAa6l1F822TkrXkOMrxq2rioWQHWjeMadRxgvKiiWkpXl3Rr9+4jUsEUtpfL/CeOOyuSMK/55vFi94WH2SadWD50baX1CJcV8kEDJEB5BgdrhNFQe6K/skpRMXAhD3rtA7Kt7t9KpNQJBAIBtsE9ExiwzrpdWz2/Ey2uaotEuz8hQpq1wzb+SiivdOXBBo2pcJJCjW+tNIOq7VmbwBLEDxxiayeBPDVvfR0/L1CSWCObcbpzzSjJ7IY9mRF6lRbTHEbRnbjkatLo3x78YJijHUzYU9Azs4llNVkVYmQEnzceSGfCCtglfuAgIK/k+/wCJoG2eVFpB/VHu/8XiDYGAc7+CDGNeKp2SImmRPg3jadvJo5AApfI2Dd2335YuI0P/l+SwgPra4UoxXVH37bWcLjHA08AQ==',
      };

      const tokenValues: Map<string, TokenValue> = new Map();

      const result = getBoxTokensValue(box, tokenValues);

      expect(result).toBe(0);
    });

    /**
     * @target Handle box with no tokens
     * @dependencies
     * - Create BoxInfo only with serialized value and a map of tokenId -> TokenValue
     * - It uses deserializeBox to deserialize box serailized value and access its tokens
     * @scenario
     * - Box has no tokens so it should give 0
     * @expect
     * - 0
     */
    it('should give 0 when tokenValues is not loaded', () => {
      const box: BoxInfo = {
        address: '',
        boxId: '',
        create: {
          index: 0,
          height: 0,
          tx: '',
          timestamp: 0,
        },
        serialized:
          'gJDfwEoACM0DjymPHUCSuRluV5RJzK0/jlkxnvwtZmD82aLZ/9gMS6OJ2XgAAEDqtT43wsD1Qpe77n6+U0iJnFuNuFBT6Up/JyAmR7LbAA==',
      };

      const tokenValues: Map<string, TokenValue> = new Map();
      // amount: 937276
      tokenValues.set(
        '9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d',
        {
          valueInErg: 0.0007942409305954882,
          decimal: 6,
        },
      );

      // amount: 5000000000000000
      tokenValues.set(
        'a37c7bf182628c7533614f40cece2594d564558990127cdc79219f082b6095fb',
        {
          valueInErg: 6.213072602665675e-8,
          decimal: 8,
        },
      );

      // amount: 1234321
      tokenValues.set(
        'f0d5bdf474fcbd4249608e6dc6e9cf34a327b218f66445ea545b4c711b4676e3',
        {
          valueInErg: 5.53307836062801e-8,
          decimal: 0,
        },
      );

      const result = getBoxTokensValue(box, tokenValues);

      expect(result).toBe(0);
    });

    /**
     * @target Handle when a token exists in the box but NOT in tokenValues map
     * @dependencies
     * - Create BoxInfo only with serialized value and a map of tokenId -> TokenValue
     * - It uses deserializeBox to deserialize box serailized value and access its tokens
     * @scenario
     * - Box tokens doesn't exist in tokenValues so it should give 0
     * @expect
     * - 0
     */
    it('handle box tokens does not exist in tokenValues map', () => {
      const box: BoxInfo = {
        address: '',
        boxId: '',
        create: {
          index: 0,
          height: 0,
          tx: '',
          timestamp: 0,
        },
        serialized:
          /*
        this box has 7105 of this token id: ed2197ebb2b958670cb568aeed54693617a3f3718d16d1a298b8c8d337193da0
        */
          'yN8CAAjNAgO0BMhHqO1gxvRzzYjFebwAGupdRfNtk5K15DjK8atqjZ1iAe0hl+uyuVhnDLVoru1UaTYXo/NxjRbRopi4yNM3GT2gwTcAxqDQ/INS3yTD/suZEg5zwYS6A6KK57I8hwf2t67gQFJw',
      };

      const tokenValues: Map<string, TokenValue> = new Map();
      tokenValues.set(
        'a37c7bf182628c7533614f40cece2594d564558990127cdc79219f082b6095fb',
        {
          valueInErg: 6.213072602665675e-8,
          decimal: 8,
        },
      );
      tokenValues.set(
        'f0d5bdf474fcbd4249608e6dc6e9cf34a327b218f66445ea545b4c711b4676e3',
        {
          valueInErg: 5.53307836062801e-8,
          decimal: 0,
        },
      );
      tokenValues.set(
        '6ad70cdbf928a2bdd397041a36a5c2490a35beb4d20eabb5666f004b103c7189',
        {
          valueInErg: 4.539131081044265e-8,
          decimal: 0,
        },
      );

      const result = getBoxTokensValue(box, tokenValues);

      expect(result).toBe(0);
    });

    /**
     * @target Test corrupted or invalid serialized box data
     * @dependencies
     * - Create BoxInfo only with a corrupted or invalid serialized value
     * - It uses deserializeBox to deserialize box serailized value and access its tokens
     * @scenario
     * - Box serialized data is corrupted or invalid so it should give 0
     * @expect
     * - 0
     */
    it('handle corrupted or invalid serialized box data', () => {
      const box: BoxInfo = {
        address: '',
        boxId: '',
        create: {
          index: 0,
          height: 0,
          tx: '',
          timestamp: 0,
        },
        serialized: 'abcdefghijklmnopqrstuvwxyz',
      };

      const tokenValues: Map<string, TokenValue> = new Map();
      tokenValues.set(
        'a37c7bf182628c7533614f40cece2594d564558990127cdc79219f082b6095fb',
        {
          valueInErg: 6.213072602665675e-8,
          decimal: 8,
        },
      );
      tokenValues.set(
        'f0d5bdf474fcbd4249608e6dc6e9cf34a327b218f66445ea545b4c711b4676e3',
        {
          valueInErg: 5.53307836062801e-8,
          decimal: 0,
        },
      );
      tokenValues.set(
        '6ad70cdbf928a2bdd397041a36a5c2490a35beb4d20eabb5666f004b103c7189',
        {
          valueInErg: 4.539131081044265e-8,
          decimal: 0,
        },
      );

      const result = getBoxTokensValue(box, tokenValues);

      expect(result).toBe(0);
    });

    /**
     * @target Test when value in erg is zero for all token values
     * @dependencies
     * - Create BoxInfo only with serialized value and a map of tokenId -> TokenValue
     * - It uses deserializeBox to deserialize box serailized value and access its tokens
     * @scenario
     * - Token values all have valueInErg as 0 so it should give 0
     * @expect
     * - 0
     */
    it('handle when value in erg is zero for all token values', () => {
      const box: BoxInfo = {
        address: '',
        boxId: '',
        create: {
          index: 0,
          height: 0,
          tx: '',
          timestamp: 0,
        },
        serialized:
          'jrHjiwEACM0CA7QEyEeo7WDG9HPNiMV5vAAa6l1F822TkrXkOMrxq2rioWQHWjeMadRxgvKiiWkpXl3Rr9+4jUsEUtpfL/CeOOyuSMK/55vFi94WH2SadWD50baX1CJcV8kEDJEB5BgdrhNFQe6K/skpRMXAhD3rtA7Kt7t9KpNQJBAIBtsE9ExiwzrpdWz2/Ey2uaotEuz8hQpq1wzb+SiivdOXBBo2pcJJCjW+tNIOq7VmbwBLEDxxiayeBPDVvfR0/L1CSWCObcbpzzSjJ7IY9mRF6lRbTHEbRnbjkatLo3x78YJijHUzYU9Azs4llNVkVYmQEnzceSGfCCtglfuAgIK/k+/wCJoG2eVFpB/VHu/8XiDYGAc7+CDGNeKp2SImmRPg3jadvJo5AApfI2Dd2335YuI0P/l+SwgPra4UoxXVH37bWcLjHA08AQ==',
      };

      const tokenValues: Map<string, TokenValue> = new Map();
      // amount: 937276
      tokenValues.set(
        '9a06d9e545a41fd51eeffc5e20d818073bf820c635e2a9d922269913e0de369d',
        {
          valueInErg: 0,
          decimal: 6,
        },
      );

      // amount: 5000000000000000
      tokenValues.set(
        'a37c7bf182628c7533614f40cece2594d564558990127cdc79219f082b6095fb',
        {
          valueInErg: 0,
          decimal: 8,
        },
      );

      // amount: 1234321
      tokenValues.set(
        'f0d5bdf474fcbd4249608e6dc6e9cf34a327b218f66445ea545b4c711b4676e3',
        {
          valueInErg: 0,
          decimal: 0,
        },
      );

      const result = getBoxTokensValue(box, tokenValues);

      expect(result).toBe(0);
    });
  });
});
