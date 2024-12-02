import axios from 'axios';
import { writeFileSync, readdirSync, readFileSync } from 'fs';
const exec = async () => {
  // reading all tokens
  const tokenDir = './svgs/';
  const files = readdirSync(tokenDir);
  // for(const iconFile of files) {
  const res = (
    await Promise.all(
      files.map(async (iconFile) => {
        try {
          const iconB64 = readFileSync(tokenDir + iconFile).toString('base64');
          const tokenId = iconFile.split('.')[0];
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
          const componentName = `Icon${tokenId}`;
          const jsonName = `token-${tokenId}`;
          const jsonFileContent = `import ${componentName} from './icons/${componentName}';
import { Token } from './types';
            
const ${jsonName.replace('-', '_')}: Token = {
    id: '${tokenId}',
    boxId: '${detail.boxId}',
    decimals: ${detail.decimals},
    description: \`${detail.description}\`,
    emissionAmount: ${detail.emissionAmount.toString()}n,
    height: ${box.settlementHeight},
    icon: ${componentName},
    iconB64: '${iconB64}',
    name: \`${detail.name}\`,
    networkType: 'Main Net',
    txId: '${box.transactionId}',
};

export default ${jsonName.replace('-', '_')};
`;
          writeFileSync(`src/${jsonName}.ts`, jsonFileContent);
          return tokenId;
        } catch (e) {
          console.log(iconFile, e);
        }
        return '';
      }),
    )
  ).filter((item) => item !== '');
  const imports = res.map(
    (item) => `import Token${item} from './token-${item}'`,
  );
  const maps = res.map((item) => `\t'${item}': Token${item}`);
  const indexCode = `import { Token } from './types';
${imports.join('\n')}

const tokenRecords = {
${maps.join(',\n')}
}

const tokens: Map<string, Token> = new Map(Object.entries(tokenRecords));

export default tokens;
`;
  writeFileSync('src/index.ts', indexCode);
};

await exec();
