# Sheetbase Module: @sheetbase/core-server

Sheetbase core module for backend app.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/core-server.svg?branch=master)](https://travis-ci.com/sheetbase/core-server) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/core-server/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/core-server?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/core-server.svg)](https://www.npmjs.com/package/@sheetbase/core-server) [![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

Using npm: `npm install --save @sheetbase/core-server`

```ts
import * as Sheetbase from "@sheetbase/core-server";
```

As a library: `1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`

Set the _Indentifier_ to **SheetbaseModule** and select the lastest version, [view code](https://script.google.com/d/1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ/edit?usp=sharing).

```ts
declare const SheetbaseModule: { Sheetbase: any };
const Sheetbase = SheetbaseModule.Sheetbase;
```

## Scopes

`https://www.googleapis.com/auth/script.scriptapp`

## Usage

- Docs homepage: https://sheetbase.github.io/core-server

- API reference: https://sheetbase.github.io/core-server/api

### Examples

```ts
import * as Sheetbase from "./public_api";

export function example1() {
  const App = Sheetbase.sheetbase({ views: "views" });

  const views = App.Option.get("views");
  Logger.log(views);
}
```

## License

**@sheetbase/core-server** is released under the [MIT](https://github.com/sheetbase/core-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/core-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
