import axios from 'axios';
import { writeFileSync, readdirSync } from 'fs';
const exec = async () => {
  // reading all tokens
  const tokenDir = './src/icons/';
  const files = readdirSync(tokenDir).filter(
    (item) => item.endsWith('.svg') || item.endsWith('.png'),
  );
  const res = (
    await Promise.all(
      files.map(async (iconFile) => {
        try {
          const [tokenId, fileExtension] = iconFile.split('.');
          const detail = (
            await axios.get(
              `https://api.ergoplatform.com/api/v1/tokens/${tokenId}`,
            )
          ).data;
          const box = (
            await axios.get(
              `https://api.ergoplatform.com/api/v1/boxes/${detail.boxId}`,
            )
          ).data;
          return {
            id: tokenId,
            boxId: detail.boxId,
            decimals: detail.decimals,
            description: detail.description,
            emissionAmount: detail.emissionAmount.toString(),
            height: box.settlementHeight,
            name: detail.name,
            networkType: 'Main Net',
            txId: box.transactionId,
            fileExtension: fileExtension,
          };
        } catch (e) {
          console.log(iconFile, e);
        }
        return '';
      }),
    )
  ).filter((item) => item !== '');
  const sortedTokens = res.sort((a, b) => a.id.localeCompare(b.id));
  const code =
    'import type { TokenType } from "."\n\nexport const tokens: Array<TokenType> = ' +
    JSON.stringify(sortedTokens, undefined, 2);
  writeFileSync('src/tokens.ts', code);
};

exec().then(() => null);
