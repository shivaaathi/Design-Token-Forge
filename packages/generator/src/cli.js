#!/usr/bin/env node
/**
 * Design Token Forge CLI
 * Usage: dtf --color "#E53F28" --name "acme" --output ./acme-theme.css
 */
import { parseArgs } from 'node:util';
import { generateTheme } from './theme-generator.js';

const { values } = parseArgs({
  options: {
    color:  { type: 'string',  short: 'c' },
    name:   { type: 'string',  short: 'n' },
    output: { type: 'string',  short: 'o', default: './brand-theme.css' },
    help:   { type: 'boolean', short: 'h' },
  },
});

if (values.help || !values.color) {
  console.log(`
  Design Token Forge — Theme Generator

  Usage:
    dtf --color "#E53F28" --name "acme" --output ./src/acme-theme.css

  Options:
    -c, --color   Brand primary color (hex)           [required]
    -n, --name    Product name (data-product selector) [optional]
    -o, --output  Output CSS file path                 [default: ./brand-theme.css]
    -h, --help    Show this help
  `);
  process.exit(values.help ? 0 : 1);
}

try {
  await generateTheme(values);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
