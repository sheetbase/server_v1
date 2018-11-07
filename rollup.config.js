export default {
    input: 'dist/public_api.js',
    output: {
        file: 'dist/bundles/sheetbase.umd.js',
        format: 'umd',
        name: 'Sheetbase',
        sourcemap: true,
        globals: {
            ejs: 'ejs',
            handlebars: 'Handlebars'
        }
    },
    external: [
        'ejs',
        'handlebars'
    ]
};