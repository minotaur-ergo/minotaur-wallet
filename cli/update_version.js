const fs = require('fs');

async function main() {
  try {
    if(process.argv.length < 2){
      throw Error("No version specified")
    }
    console.log(process.argv[2])
    for(let file_path of ['package.json', 'electron/package.json']) {
      let data = fs.readFileSync(file_path, 'utf8');
      let root = JSON.parse(data);
      root.version = process.argv[2]
      data = JSON.stringify(root, null, 2);
      fs.writeFileSync(file_path, data, 'utf8');
    }
  } catch (error) {
    throw error;
  }
}


if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}
