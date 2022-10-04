export default {
  '*.ts': () => 'tsc',
  '*.{js,ts}': 'eslint --fix',
  '*': 'prettier --ignore-unknown --write .',
};
