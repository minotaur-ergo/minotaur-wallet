#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

function execCommand(command, options = {}) {
  try {
    const env = {
      ...process.env,
      NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/',
      ...(process.env.NPM_TOKEN && {
        NPM_CONFIG__AUTH_TOKEN: process.env.NPM_TOKEN,
      }),
    };

    return execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      env,
      ...options,
    }).trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function getPackageInfo(packagePath) {
  const packageJsonPath = join(packagePath, 'package.json');
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } catch (error) {
    throw new Error(
      `Failed to read package.json at ${packageJsonPath}: ${error.message}`,
    );
  }
}

function isVersionPublished(packageName, version) {
  try {
    const result = execCommand(`npm view ${packageName}@${version} version`);
    return result === version;
  } catch (error) {
    return false;
  }
}

function publishPackage(packagePath) {
  try {
    execCommand('npm publish --access public', { cwd: packagePath });
    return true;
  } catch (error) {
    throw new Error(`Failed to publish package: ${error.message}`);
  }
}

function main() {
  const packagePath = process.argv[2];

  if (!packagePath) {
    console.error('Usage: node release.js <package-path>');
    process.exit(1);
  }

  if (!process.env.NPM_TOKEN) {
    console.error('Error: NPM_TOKEN environment variable is required');
    process.exit(1);
  }

  try {
    console.log('Setting up npm authentication...');
    execCommand(
      `npm config set //registry.npmjs.org/:_authToken ${process.env.NPM_TOKEN}`,
    );
    execCommand('npm config set registry https://registry.npmjs.org/');

    const { name, version } = getPackageInfo(packagePath);

    console.log(`Checking package: ${name}@${version}`);

    if (isVersionPublished(name, version)) {
      console.log(`Version ${version} is already published on npm`);
      return;
    }

    console.log(`Version ${version} not found on npm, publishing...`);
    publishPackage(packagePath);
    console.log(`Successfully published ${name}@${version}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
