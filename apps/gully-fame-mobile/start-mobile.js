#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

const expo = spawn('npx', ['expo', 'start', '--dev-client', '--clear', ...args], {
  stdio: 'inherit',
  cwd: __dirname
});

expo.on('exit', (code) => {
  process.exit(code || 0);
});
