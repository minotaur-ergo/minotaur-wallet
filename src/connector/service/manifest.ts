import { ManifestV3Export } from '@crxjs/vite-plugin';
import packageJson from '../../../package.json'

const manifest: ManifestV3Export = {
  short_name: 'Minotaur wallet connector',
  name: 'Minotaur wallet dApp connector',
  version: packageJson.version,
  manifest_version: 3,
  minimum_chrome_version: '48',
  icons: {
    192: 'icons/192.png',
  },
  action: {
    default_popup: 'src/connector/extension.html',
  },
  background: {
      service_worker: "src/connector/service/chrome/background.ts",
      type: "module"
  },
  content_scripts: [
    {
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['src/connector/service/chrome/injector.ts'],
      run_at: 'document_end',
      all_frames: true,
    },
    {
        "js": ["src/connector/service/chrome/content.ts"],
        "matches": ["file://*/*", "http://*/*", "https://*/*"]
      }  
  ]
};

export { manifest };
