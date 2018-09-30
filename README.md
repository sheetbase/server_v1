# Sheetbase Module: core-server

Core Module to build Sheetbase Backend. Homepage: https://sheetbase.net

# Install

- NPM: ``$ npm install --save @sheetbase/core-server``

- As library: ``1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`` (set Indentifier to **Sheetbase**, [view code](https://script.google.com/d/1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ/edit?usp=sharing))

## Usage

```ts
// register http events
function doGet(e) { return Sheetbase.HTTP.get(e); }
function doPost(e) { return Sheetbase.HTTP.post(e); }

// config the app
Sheetbase.Config.set('views', 'path/to/views');
Sheetbase.Config.set('view engine', 'hbs');

// routes
Sheetbase.Router.get('/', (req, res) => {
    return res.html('<h1>GET</h1>');
});
Sheetbase.Router.post('/', (req, res) => {
    return res.html('<h1>POST</h1>');
});
Sheetbase.Router.put('/', (req, res) => {
    return res.html('<h1>PUT</h1>');
});
Sheetbase.Router.patch('/', (req, res) => {
    return res.html('<h1>PATCH</h1>');
});
Sheetbase.Router.delete('/', (req, res) => {
    return res.html('<h1>DELETE</h1>');
});
```

## License

[MIT][license-url]

[license-url]: https://github.com/sheetbase/module-core-server/blob/master/LICENSE