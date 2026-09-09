#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');


process.env.NODE_OPTIONS = '--no-warnings';


process.env.NODE_NO_WARNINGS = '1';

try {
  
  execSync('npx expo start --clear', {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true,
    env: {
      ...process.env,
      NODE_OPTIONS: '--no-warnings',
    },
  });
} catch (error) {
  process.exit(1);
}
