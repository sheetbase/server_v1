export default {
    input: './dist/esm3/public_api.js',
    output: [
        {
            file: './dist/fesm3/sheetbase-core-server.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: './dist/bundles/sheetbase-core-server.umd.js',
            format: 'umd',
            sourcemap: true,
            name: 'Sheetbase',
            globals: {
                ejs: 'ejs',
                handlebars: 'Handlebars'
            }
        }
    ],
    external: [
        'ejs',
        'handlebars'
    ]
};