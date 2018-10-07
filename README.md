# Sheetbase Module: core-server

Core Module to build Sheetbase Backend. Homepage: https://sheetbase.net

[![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

# Install

- NPM: ``$ npm install --save @sheetbase/core-server``

- As library: ``1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`` (set Indentifier to **Sheetbase** and select the lastest version, [view code](https://script.google.com/d/1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ/edit?usp=sharing))

## Scopes

``https://www.googleapis.com/auth/script.scriptapp``

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

[MIT][license_url]

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/module-core-server/blob/master/LICENSE

[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp

[patreon_badge]: https://ionicabizau.github.io/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan

[paypal_donate_badge]: https://ionicabizau.github.io/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan

[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase