import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { readFileSync, writeFileSync } from 'fs';
import { existsSync } from 'node:fs';

const MAJOR = 'MAJOR';
const MINOR = 'MINOR';
const PATCH = 'PATCH';
const PRE_RELEASE = 'PRE_RELEASE';
const NUMBER_OF_COMMITS = 'NUMBER_OF_COMMITS';
const CHANGE_LOG = 'CHANGE_LOG';
const VERSION_PREFIX_INPUT = 'version_prefix';
const ERROR_ON_FAILURE = 'error_on_failure';
const CHANGELOG_PATH_INPUT = 'changelog_path';
const PACKAGE_JSON_PATHS_INPUT = 'package_json_paths';
const DEFAULT_CHANGELOG_FILENAME = 'CHANGELOG';
const MARKDOWN_EXTENSION = '.md';
const findChangelogFilePath = () => {
  const possibleFilenames = [
    `${DEFAULT_CHANGELOG_FILENAME}${MARKDOWN_EXTENSION}`,
    DEFAULT_CHANGELOG_FILENAME,
  ];
  for (const filename of possibleFilenames) {
    if (existsSync(filename)) {
      return filename;
    }
  }
  throw new Error(
    `The default changelog file '${DEFAULT_CHANGELOG_FILENAME}' with or without '${MARKDOWN_EXTENSION}' extension was not found.`,
  );
};
const extractVersionFromChangelog = (changeLog, versionPrefix, version) => {
  const lines = changeLog.split(/\r?\n|\r|\n/g);
  const startIndex =
    lines.findIndex((line) => line.startsWith(versionPrefix + version)) + 1;
  const endIndexFound = lines
    .slice(startIndex)
    .findIndex((line) => line.startsWith(versionPrefix));
  const endIndex =
    endIndexFound === -1 ? lines.length : endIndexFound + startIndex;
  return lines.slice(startIndex, endIndex).join('\n');
};
const getChangelog = (version) => {
  core.info('Extracting changelog');
  const errorOnFailure = core.getInput(ERROR_ON_FAILURE) === 'false';
  try {
    const versionPrefix =
      core.getInput(VERSION_PREFIX_INPUT, { trimWhitespace: false }) ?? '## ';
    const changelogPath =
      core.getInput(CHANGELOG_PATH_INPUT, { trimWhitespace: false }) ??
      findChangelogFilePath();
    const changelog = readFileSync(changelogPath, 'utf8');
    const versionChangelog = extractVersionFromChangelog(
      changelog,
      versionPrefix,
      version,
    );
    core.info(`Changelog content: ${versionChangelog}`);
    if (versionChangelog) {
      core.exportVariable(CHANGE_LOG, versionChangelog);
    } else if (errorOnFailure) {
      core.setFailed(`Version ${version} not found in ${changelogPath}.`);
    }
  } catch (error) {
    if (errorOnFailure) {
      if (error instanceof Error) {
        core.setFailed(error.message);
      } else {
        core.setFailed('Unknown error occurred');
      }
    }
  }
};
const getLastestTag = async () => {
  let tag;
  const options = {
    listeners: {
      stdout: (data) => {
        tag = data.toString().trim();
        core.info(`Tag retreived: ${tag}`);
      },
      stderr: (data) => {
        core.error(data.toString().trim());
        core.setFailed(
          'No tag found on this branch, please verify you have one in your remote repository and the fetch-depth option set to 0, on the checkout action.',
        );
      },
    },
  };
  await exec.exec('git', ['describe', '--tags', '--abbrev=0'], options);
  return tag;
};
const formatSemanticValuesFromTag = (tag) => {
  if (tag.includes('v')) {
    tag = tag.split('v')[1];
  }
  const versionsIndicator = tag.split('.');
  if (versionsIndicator.length > 2 && versionsIndicator[2].includes('-')) {
    const preSplit = versionsIndicator[2].split('-');
    versionsIndicator[2] = preSplit[0];
    core.exportVariable(PRE_RELEASE, preSplit[1]);
  } else {
    core.exportVariable(PRE_RELEASE, '');
  }
  core.exportVariable(MAJOR, versionsIndicator[0]);
  core.exportVariable(MINOR, versionsIndicator[1]);
  core.exportVariable(PATCH, versionsIndicator[2]);
};
const getNumberOfCommits = async () => {
  const options = {
    listeners: {
      stdout: (data) => {
        core.exportVariable(NUMBER_OF_COMMITS, data.toString().trim());
      },
      stderr: (data) => {
        core.error(data.toString());
        core.setFailed('Unable to get the number of commits. See error above.');
      },
    },
  };
  await exec.exec('git', ['rev-list', '--count', 'HEAD'], options);
};
const updatePackageJsonVersions = (major, minor, patch, preRelease) => {
  const packageJsonPathsInput = core.getInput(PACKAGE_JSON_PATHS_INPUT, {
    trimWhitespace: true,
  });
  if (!packageJsonPathsInput) {
    core.info('No package.json paths provided, skipping version update');
    return;
  }
  const packageJsonPaths = packageJsonPathsInput
    .split(',')
    .map((path) => path.trim())
    .filter((path) => path.length > 0);
  const version = preRelease
    ? `${major}.${minor}.${patch}-${preRelease}`
    : `${major}.${minor}.${patch}`;
  core.info(`Updating package.json files to version: ${version}`);
  for (const packageJsonPath of packageJsonPaths) {
    try {
      if (!existsSync(packageJsonPath)) {
        core.warning(`Package.json not found at: ${packageJsonPath}`);
        continue;
      }
      const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      packageJson.version = version;
      writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf8',
      );
      core.info(`Updated version in: ${packageJsonPath}`);
    } catch (error) {
      if (error instanceof Error) {
        core.error(`Failed to update ${packageJsonPath}: ${error.message}`);
      } else {
        core.error(`Failed to update ${packageJsonPath}: Unknown error`);
      }
    }
  }
};
const handleError = (err) => {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
};
const main = async () => {
  try {
    const tag = await getLastestTag();
    if (tag) {
      await getNumberOfCommits();
      formatSemanticValuesFromTag(tag);
      const major = process.env[MAJOR] || '';
      const minor = process.env[MINOR] || '';
      const patch = process.env[PATCH] || '';
      const preRelease = process.env[PRE_RELEASE] || '';
      const version = [[major, minor, patch].join('.'), preRelease]
        .filter(Boolean)
        .join('-');
      getChangelog(version);
      updatePackageJsonVersions(major, minor, patch, preRelease);
    } else {
      core.setFailed(`No valid tag found: ${tag}`);
    }
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    core.setFailed(message);
  }
};
process.on('unhandledRejection', handleError);
main().catch(handleError);
