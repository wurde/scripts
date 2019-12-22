'use strict'

/**
 * Dependencies
 */

const fs = require('fs');
const path = require('path');
const meow = require('meow');
const chalk = require('chalk');
const fse = require('fs-extra');
const showHelp = require('../helpers/showHelp');

/**
 * Constants
 */

const CONFIG_DIR = path.join(process.env.HOME, '.nodemon');

/**
 * Define helpers
 */

function requireFile(file) {
  if (!fse.pathExistsSync(file)) throw new Error(`Missing file: ${file}`);
}

/**
 * Parse args
 */

const cli = meow(`
  Usage
    $ cast nodemon
  
  Options:
    -a, --add FILE   Add a new monitoring script.
    --remove FILE    Remove a monitoring script.
`, {
  description: 'Filesystem monitoring scripts.',
  flags: {
    add: { type: 'string', alias: 'a' },
    remove: { type: 'string' },
  }
});

/**
 * Define script
 */

function nodemon(command = null) {
  showHelp(cli);

  const flags = Object.keys(cli.flags);
  command = command || flags.pop() || 'list';

  fse.mkdirpSync(CONFIG_DIR);

  if (command === 'list' || command === 'l') {
    const files = fs.readdirSync(CONFIG_DIR);
    console.log('list', files);
  } else if (command === 'add' || command === 'a') {
    const file = cli.flags.add;
    const filename = path.basename(file);
    const dst = path.join(CONFIG_DIR, filename)
    requireFile(file);

    console.log(chalk.white.bold(`\n  Adding script: ${dst}\n`));
    fse.ensureSymlinkSync(file, dst);
  } else if (command === 'remove') {
    const file = cli.flags.remove;
    const dst = path.join(CONFIG_DIR, file)
    requireFile(dst);

    console.log(chalk.white.bold(`\n  Removing script: ${dst}\n`));
    fs.unlinkSync(dst);
  }
}

/**
 * Export script
 */

module.exports = nodemon;
