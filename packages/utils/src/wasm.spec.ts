import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getWasm } from './wasm';

/**
 * Test suite for WASM utility functions
 */
describe('WASM utilities', () => {
  // Mock global window object
  const mockWasm = {
    Address: vi.fn(),
    Transaction: vi.fn(),
    ErgoBox: vi.fn(),
    NetworkPrefix: {
      Mainnet: 0x01,
      Testnet: 0x02,
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock window.wasm
    Object.defineProperty(global, 'window', {
      value: {
        wasm: mockWasm,
      },
      writable: true,
    });
  });

  /**
   * Test suite for getWasm function
   */
  describe('getWasm', () => {
    /**
     * @target Return WASM object when available
     * @dependencies
     * - window.wasm global object
     * @scenario
     * - Call getWasm when window.wasm is available
     * @expect
     * - Returns the WASM object from window
     */
    it('should return WASM object when available', () => {
      const result = getWasm();

      expect(result).toBe(mockWasm);
      expect(result).toHaveProperty('Address');
      expect(result).toHaveProperty('Transaction');
      expect(result).toHaveProperty('ErgoBox');
    });

    /**
     * @target Return undefined when window is not available
     * @dependencies
     * - None
     * @scenario
     * - Call getWasm when window is undefined
     * @expect
     * - Returns undefined
     */
    it('should return undefined when window is not available', () => {
      // Mock window as undefined
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      });

      const result = getWasm();

      expect(result).toBeUndefined();
    });

    /**
     * @target Return undefined when window.wasm is not available
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window exists but window.wasm is undefined
     * @expect
     * - Returns undefined
     */
    it('should return undefined when window.wasm is not available', () => {
      // Mock window without wasm property
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
      });

      const result = getWasm();

      expect(result).toBeUndefined();
    });

    /**
     * @target Return undefined when window.wasm is null
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm is null
     * @expect
     * - Returns undefined
     */
    it('should return undefined when window.wasm is null', () => {
      // Mock window with null wasm
      Object.defineProperty(global, 'window', {
        value: { wasm: null },
        writable: true,
      });

      const result = getWasm();

      expect(result).toBeUndefined();
    });

    /**
     * @target Handle window.wasm as empty object
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm is empty object
     * @expect
     * - Returns the empty object
     */
    it('should handle window.wasm as empty object', () => {
      const emptyWasm = {};
      Object.defineProperty(global, 'window', {
        value: { wasm: emptyWasm },
        writable: true,
      });

      const result = getWasm();

      expect(result).toBe(emptyWasm);
    });

    /**
     * @target Handle window.wasm with partial properties
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm has only some expected properties
     * @expect
     * - Returns the partial WASM object
     */
    it('should handle window.wasm with partial properties', () => {
      const partialWasm = {
        Address: vi.fn(),
        // Missing Transaction, ErgoBox, etc.
      };
      Object.defineProperty(global, 'window', {
        value: { wasm: partialWasm },
        writable: true,
      });

      const result = getWasm();

      expect(result).toBe(partialWasm);
      expect(result).toHaveProperty('Address');
      expect(result).not.toHaveProperty('Transaction');
    });

    /**
     * @target Return same object on multiple calls
     * @dependencies
     * - window.wasm global object
     * @scenario
     * - Call getWasm multiple times
     * @expect
     * - Returns same object reference each time
     */
    it('should return same object on multiple calls', () => {
      const result1 = getWasm();
      const result2 = getWasm();
      const result3 = getWasm();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(mockWasm);
    });

    /**
     * @target Handle dynamic window.wasm changes
     * @dependencies
     * - window global object
     * @scenario
     * - Change window.wasm between calls
     * @expect
     * - Returns updated WASM object
     */
    it('should handle dynamic window.wasm changes', () => {
      const firstWasm = { version: 1 };
      const secondWasm = { version: 2 };

      // Set first WASM
      Object.defineProperty(global, 'window', {
        value: { wasm: firstWasm },
        writable: true,
      });

      const result1 = getWasm();
      expect(result1).toBe(firstWasm);

      // Change to second WASM
      Object.defineProperty(global, 'window', {
        value: { wasm: secondWasm },
        writable: true,
      });

      const result2 = getWasm();
      expect(result2).toBe(secondWasm);
      expect(result2).not.toBe(result1);
    });

    /**
     * @target Handle window.wasm as function
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm is a function
     * @expect
     * - Returns the function
     */
    it('should handle window.wasm as function', () => {
      const wasmFunction = vi.fn();
      Object.defineProperty(global, 'window', {
        value: { wasm: wasmFunction },
        writable: true,
      });

      const result = getWasm();

      expect(result).toBe(wasmFunction);
      expect(typeof result).toBe('function');
    });

    /**
     * @target Handle window.wasm with complex nested structure
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm has complex nested properties
     * @expect
     * - Returns the complex object with all nested properties
     */
    it('should handle window.wasm with complex nested structure', () => {
      const complexWasm = {
        Address: {
          from_base58: vi.fn(),
          to_base58: vi.fn(),
        },
        Transaction: {
          new: vi.fn(),
          inputs: vi.fn(),
        },
        NetworkPrefix: {
          Mainnet: 0x01,
          Testnet: 0x02,
        },
        utils: {
          helper1: vi.fn(),
          helper2: vi.fn(),
        },
      };

      Object.defineProperty(global, 'window', {
        value: { wasm: complexWasm },
        writable: true,
      });

      const result = getWasm();

      expect(result).toBe(complexWasm);
      expect(result).toHaveProperty('Address.from_base58');
      expect(result).toHaveProperty('Transaction.new');
      expect(result).toHaveProperty('NetworkPrefix.Mainnet');
      expect(result).toHaveProperty('utils.helper1');
    });

    /**
     * @target Handle window.wasm with primitive values
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm is a primitive value
     * @expect
     * - Returns the primitive value
     */
    it('should handle window.wasm with primitive values', () => {
      const primitiveValues = ['string-wasm', 42, true, false];

      primitiveValues.forEach((primitiveValue) => {
        Object.defineProperty(global, 'window', {
          value: { wasm: primitiveValue },
          writable: true,
        });

        const result = getWasm();
        expect(result).toBe(primitiveValue);
      });
    });

    /**
     * @target Handle window property access errors
     * @dependencies
     * - window global object with getter that throws
     * @scenario
     * - Call getWasm when accessing window.wasm throws an error
     * @expect
     * - Returns undefined without throwing
     */
    it('should handle window property access errors gracefully', () => {
      // Mock window with getter that throws
      Object.defineProperty(global, 'window', {
        value: {
          get wasm() {
            throw new Error('Access denied');
          },
        },
        writable: true,
      });

      expect(() => {
        const result = getWasm();
        // If the function handles errors gracefully, it should return undefined
        // If it doesn't handle errors, this test will fail due to the thrown error
        expect(result).toBeUndefined();
      }).not.toThrow();
    });

    /**
     * @target Handle frozen window object
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window object is frozen
     * @expect
     * - Returns WASM object normally
     */
    it('should handle frozen window object', () => {
      const frozenWindow = Object.freeze({ wasm: mockWasm });
      Object.defineProperty(global, 'window', {
        value: frozenWindow,
        writable: true,
      });

      const result = getWasm();

      expect(result).toBe(mockWasm);
    });

    /**
     * @target Handle window with non-enumerable wasm property
     * @dependencies
     * - window global object
     * @scenario
     * - Call getWasm when window.wasm is non-enumerable
     * @expect
     * - Returns WASM object normally
     */
    it('should handle window with non-enumerable wasm property', () => {
      const windowObj = {};
      Object.defineProperty(windowObj, 'wasm', {
        value: mockWasm,
        enumerable: false,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, 'window', {
        value: windowObj,
        writable: true,
      });

      const result = getWasm();

      expect(result).toBe(mockWasm);
    });
  });
});
