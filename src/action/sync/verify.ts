import Address from '../../db/entities/Address';
import { AddressInfo, Token } from '../../util/network/models';
import { TokenData } from '../Types';
import { AddressDbAction, BoxContentDbAction } from '../db';

class VerifyAddress {
  private readonly address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  verifyContent = async (expected: AddressInfo): Promise<boolean> => {
    return (
      (await this.verifyTokens(expected.tokens)) &&
      (await this.verifyTotalErg(expected.nanoErgs))
    );
  };

  /**
   * compare dbTokens of the address with expectedTokens given from explorer.
   * @param expectedTokens : Token[]
   * @returns
   */
  verifyTokens = async (expectedTokens: Token[]): Promise<boolean> => {
    const dbTokens: TokenData[] = await BoxContentDbAction.getAddressTokens(
      this.address.id
    );
    const expected = expectedTokens
      .map((item) => {
        return { tokenId: item.tokenId, amount: BigInt(item.amount) };
      })
      .sort((a, b) => a.tokenId.localeCompare(b.tokenId));
    const available = dbTokens
      .map((item) => {
        return { tokenId: item.tokenId, amount: BigInt(item.total) };
      })
      .sort((a, b) => a.tokenId.localeCompare(b.tokenId));
    if (expected.length !== available.length) return false;
    const remains = expected.filter((item, index) => {
      return (
        available[index].tokenId !== item.tokenId ||
        available[index].amount !== item.amount
      );
    });
    return remains.length === 0;
  };

  verifyTotalErg = async (expectedTotalErg: bigint) => {
    const totalDbErg = await AddressDbAction.getAddressTotalErg(
      this.address.id
    );
    return totalDbErg?.erg() === expectedTotalErg;
  };
}

export { VerifyAddress };
