#!/usr/bin/env node

const { spawn } = require('child_process');

const args = process.argv.slice(2);

const command = 'npx';
const commandArgs = ['expo', 'start', '--dev-client', ...args];

const expo = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: true
});

expo.on('exit', (code) => {
  process.exit(code);
});
