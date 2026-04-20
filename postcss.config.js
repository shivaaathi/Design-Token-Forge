/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        /* Preserve CSS custom property names — critical for token system */
        cssDeclarationSorter: false,
        mergeRules: false,
        /* Keep the first comment block (license/attribution) */
        discardComments: { removeAllButFirst: true },
      }],
    }),
  ],
};
