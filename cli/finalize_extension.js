import fs from 'fs';
import process from 'process';
import { fileURLToPath } from 'url';

const manifestPath = "extension/manifest.json";

const updateWebAccessibleResource = (root) => {
    root.web_accessible_resources = root.web_accessible_resources.map(web => {
        web.resources = web.resources.map(item => {
            if(item.startsWith('assets/content.ts')){
                fs.renameSync('extension/' + item, 'extension/assets/content.js')
                return 'assets/content.js'
            }
            return item
        })
        return web;
    });
    return root
}

const removeUnusedContentScript = (root) => {
    root.content_scripts = root.content_scripts.filter(item => {
        if(item.js.filter(element => element.startsWith('assets/content.ts')).length > 0){
            item.js.forEach(element => {
                fs.unlinkSync('extension/' + element);
            });
            return false
        }
        return true
    });
    return root;
}

const main = async() => {
    let data = fs.readFileSync(manifestPath, 'utf8');
    let root = JSON.parse(data);
    root = updateWebAccessibleResource(root);
    root = removeUnusedContentScript(root);
    fs.writeFileSync(manifestPath, JSON.stringify(root, undefined, 4));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main()
      .then(() => process.exit(0))
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  }
  