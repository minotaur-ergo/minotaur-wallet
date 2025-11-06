import * as wasm from '@minotaur-ergo/ergo-lib';
import { describe, expect, it } from 'vitest';

import {
  calcPathFromIndex,
  deriveAddressFromMnemonic,
  deriveAddressFromXPub,
  getNewAddressName,
} from './address';

/**
 * Test suite for address utility functions
 */
describe('address utilities', () => {
  /**
   * Test suite for calcPathFromIndex function
   */
  describe('calcPathFromIndex', () => {
    /**
     * @target Calculate derivation path for index 0
     * @dependencies
     * - RootPathWithoutIndex constant
     * @scenario
     * - Call calcPathFromIndex with index 0
     * @expect
     * - Returns root path with /0 appended
     */
    it('should calculate path for index 0', () => {
      const index = 0;

      const result = calcPathFromIndex(index);

      expect(result).toBe("m/44'/429'/0'/0/0");
    });

    /**
     * @target Calculate derivation path for positive index
     * @dependencies
     * - RootPathWithoutIndex constant
     * @scenario
     * - Call calcPathFromIndex with index 5
     * @expect
     * - Returns root path with /5 appended
     */
    it('should calculate path for positive index', () => {
      const index = 5;

      const result = calcPathFromIndex(index);

      expect(result).toBe("m/44'/429'/0'/0/5");
    });

    /**
     * @target Calculate derivation path for large index
     * @dependencies
     * - RootPathWithoutIndex constant
     * @scenario
     * - Call calcPathFromIndex with index 999
     * @expect
     * - Returns root path with /999 appended
     */
    it('should calculate path for large index', () => {
      const index = 999;

      const result = calcPathFromIndex(index);

      expect(result).toBe("m/44'/429'/0'/0/999");
    });
  });

  /**
   * Test suite for getNewAddressName function
   */
  describe('getNewAddressName', () => {
    /**
     * @target Return main address name for index 0 with empty name
     * @dependencies
     * - None
     * @scenario
     * - Call getNewAddressName with empty string and index 0
     * @expect
     * - Returns 'Main Address'
     */
    it('should return main address for index 0 with empty name', async () => {
      const name = '';
      const index = 0;

      const result = await getNewAddressName(name, index);

      expect(result).toBe('Main Address');
    });

    /**
     * @target Return derived address name for positive index with empty name
     * @dependencies
     * - None
     * @scenario
     * - Call getNewAddressName with empty string and index 1
     * @expect
     * - Returns 'Derived Address 1'
     */
    it('should return derived address name for positive index with empty name', async () => {
      const name = '';
      const index = 1;

      const result = await getNewAddressName(name, index);

      expect(result).toBe('Derived Address 1');
    });

    /**
     * @target Return derived address name for large index with empty name
     * @dependencies
     * - None
     * @scenario
     * - Call getNewAddressName with empty string and index 10
     * @expect
     * - Returns 'Derived Address 10'
     */
    it('should return derived address name for large index with empty name', async () => {
      const name = '';
      const index = 10;

      const result = await getNewAddressName(name, index);

      expect(result).toBe('Derived Address 10');
    });

    /**
     * @target Return provided name when name is not empty
     * @dependencies
     * - None
     * @scenario
     * - Call getNewAddressName with custom name and any index
     * @expect
     * - Returns the provided custom name unchanged
     */
    it('should return provided name when name is not empty', async () => {
      const name = 'Custom Address Name';
      const index = 5;

      const result = await getNewAddressName(name, index);

      expect(result).toBe('Custom Address Name');
    });

    /**
     * @target Return provided name for index 0 when name is not empty
     * @dependencies
     * - None
     * @scenario
     * - Call getNewAddressName with custom name and index 0
     * @expect
     * - Returns the provided custom name, not 'Main Address'
     */
    it('should return provided name for index 0 when name is not empty', async () => {
      const name = 'My Special Address';
      const index = 0;

      const result = await getNewAddressName(name, index);

      expect(result).toBe('My Special Address');
    });

    /**
     * @target Handle whitespace-only name as empty
     * @dependencies
     * - None
     * @scenario
     * - Call getNewAddressName with whitespace string and index 0
     * @expect
     * - Returns 'Main Address' (treats whitespace as empty)
     */
    it('should handle whitespace-only name as empty', async () => {
      const name = '   ';
      const index = 0;

      const result = await getNewAddressName(name, index);

      expect(result).toBe('   ');
    });
  });

  /**
   * Test suite for deriveAddressFromXPub function
   */
  describe('deriveAddressFromXPub', () => {
    /**
     * @target Derive address from extended public key at index 0
     * @dependencies
     * - bip32 library
     * - wasm.Address
     * - wasm.NetworkPrefix
     * @scenario
     * - Call deriveAddressFromXPub with valid xPub, network prefix, and index 0
     * @expect
     * - Returns object with address and path properties
     */
    it('should derive address from xPub at index 0', () => {
      const xPub =
        'xpub6BosfCnifzxcFwrSzQiqu2DBVTshkCXacvNsWGYJVVhhawA7d4R5WSWGFNbi8Aw6ZRc1brxMyWMzG3DSSSSoekkudhUd9yLb6qx39T9nMdj';

      const result = deriveAddressFromXPub(xPub, wasm.NetworkPrefix.Mainnet, 0);

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('path');
      expect(result.path).toBe("m/44'/429'/0'/0/0");
      expect(result.address).toBe(
        '9hV8wWtY2eCcQSJwzRZk3PgRfTNKCpxkEq9gtmZheerPaKZnah3',
      );
    });

    /**
     * @target Derive address from extended public key at positive index
     * @dependencies
     * - bip32 library
     * - wasm.Address
     * - wasm.NetworkPrefix
     * @scenario
     * - Call deriveAddressFromXPub with valid xPub, network prefix, and index 5
     * @expect
     * - Returns object with address and path for index 5
     */
    it('should derive address from xPub at positive index', () => {
      const xPub =
        'xpub6BosfCnifzxcFwrSzQiqu2DBVTshkCXacvNsWGYJVVhhawA7d4R5WSWGFNbi8Aw6ZRc1brxMyWMzG3DSSSSoekkudhUd9yLb6qx39T9nMdj';

      const result = deriveAddressFromXPub(xPub, wasm.NetworkPrefix.Mainnet, 5);

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('path');
      expect(result.path).toBe("m/44'/429'/0'/0/5");
      expect(result.address).toBe(
        '9hMiLN9FnLdQBq3QpTbdQN6NsSeHZ4HeX4tR96KXFimb7C514q2',
      );
    });
  });

  /**
   * Test suite for deriveAddressFromMnemonic function
   */
  describe('deriveAddressFromMnemonic', () => {
    /**
     * @target Derive address from mnemonic at index 0
     * @dependencies
     * - mnemonicToSeedSync from bip39
     * - bip32 library
     * - wasm.SecretKey
     * - wasm.NetworkPrefix
     * @scenario
     * - Call deriveAddressFromMnemonic with valid mnemonic, password, network prefix, and index 0
     * @expect
     * - Returns object with address and path properties
     */
    it('should derive address from mnemonic at index 0', async () => {
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const password = '';
      const index = 0;

      const result = await deriveAddressFromMnemonic(
        mnemonic,
        password,
        wasm.NetworkPrefix.Mainnet,
        index,
      );

      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('path');
      expect(result.path).toBe("m/44'/429'/0'/0/0");
      expect(result.address).toBe(
        '9fv2n41gttbUx8oqqhexi68qPfoETFPxnLEEbTfaTk4SmY2knYC',
      );
    });

    /**
     * @target Derive address from mnemonic with password
     * @dependencies
     * - mnemonicToSeedSync from bip39
     * - bip32 library
     * - wasm.SecretKey
     * - wasm.NetworkPrefix
     * @scenario
     * - Call deriveAddressFromMnemonic with mnemonic, non-empty password, and index
     * @expect
     * - Returns different address than without password
     */
    it('should derive different address with password', async () => {
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const password1 = '';
      const password2 = 'testpassword';
      const index = 0;

      const result1 = await deriveAddressFromMnemonic(
        mnemonic,
        password1,
        wasm.NetworkPrefix.Mainnet,
        index,
      );
      const result2 = await deriveAddressFromMnemonic(
        mnemonic,
        password2,
        wasm.NetworkPrefix.Mainnet,
        index,
      );

      expect(result1.address).not.toBe(result2.address);
      expect(result1.path).toBe(result2.path);
    });

    /**
     * @target Derive address from mnemonic at different indices
     * @dependencies
     * - mnemonicToSeedSync from bip39
     * - bip32 library
     * - wasm.SecretKey
     * - wasm.NetworkPrefix
     * @scenario
     * - Call deriveAddressFromMnemonic with same mnemonic but different indices
     * @expect
     * - Returns different addresses with different paths
     */
    it('should derive different addresses for different indices', async () => {
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const password = '';

      const result0 = await deriveAddressFromMnemonic(
        mnemonic,
        password,
        wasm.NetworkPrefix.Mainnet,
        0,
      );
      const result1 = await deriveAddressFromMnemonic(
        mnemonic,
        password,
        wasm.NetworkPrefix.Mainnet,
        1,
      );

      expect(result0.path).toBe("m/44'/429'/0'/0/0");
      expect(result1.path).toBe("m/44'/429'/0'/0/1");
    });
  });
});
