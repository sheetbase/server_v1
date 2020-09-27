# ⛔️ DEPRECATED

We are updating version 3 of the module: https://github.com/sheetbase/server!

# Sheetbase Module: @sheetbase/server

Sheetbase core module for backend app.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/serverv1.svg?branch=master)](https://travis-ci.com/sheetbase/serverv1) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/serverv1/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/serverv1?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/server.svg)](https://www.npmjs.com/package/@sheetbase/server) [![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

Using npm: `npm install --save @sheetbase/server`

```ts
import * as Sheetbase from "@sheetbase/server";
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

- Docs homepage: https://sheetbase.github.io/server

- API reference: https://sheetbase.github.io/server/api

<!-- <block:body> -->

## Getting started

Install: `npm install --save @sheetbase/server`

Usage:

```ts
import { sheetbase } from "@sheetbase/server";

const Sheetbase = sheetbase({
  /* configs */
});

Sheetbase.Router.get("/", (req, res) => {
  return res.send("Hello!");
});
```

## Configs

Sheetbase app configurations.

### allowMethodsWhenDoGet

- Type: `boolean`
- Default: `false`

Allows POST, PUT, ... when do GET method, useful for testing in browser without re-deploy the web app.

### views

- Type: `string`
- Default: `''`

Views folder, where to put view templating file. Examples: `views`, `public/views`

### disabledRoutes

- Type: `string[]`
- Default: `[]`

List of disabled routes, format: `method:endpoint`. Examples: `[ 'GET:/', 'POST:/me' ]`

### routingErrors

- Type: [RoutingErrors](https://github.com/sheetbase/serverv1/blob/d15caa7d464e98057e94ca810d22d88881214310/src/lib/types.ts#L67)
- Default: `{}`

List of routing errors, by codes, when do `res.error(code)`, the router will show the coresponding error to the client.

Examples: `{ foo: 'The Foo error.' }`. Then: `res.error('foo')`, the result will be:

```json
{
  "error": true,
  "status": 400,
  "code": "foo",
  "message": "The Foo error."
}
```

## Routing

Sheetbase provide a routing system like [ExpressJS](https://expressjs.com).

The router supports these methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. But only `GET` and `POST` is real HTTP methods, others are just play as a way to organize the app.

`router.get('/', ...)`, accepts a GET request to `...?e=/`

`router.post('/', ...)`, accepts a POST request to `...?e=/`

`router.put('/', ...)`, accepts a POST request to `...?e=/&method=PUT`

`router.patch('/', ...)`, accepts a POST request to `...?e=/&method=PATCH`

`router.delete('/', ...)`, accepts a POST request to `...?e=/&method=DELETE`

`router.all('/', ...)`, accepts all request to `...?e=/`

### Basic use

```ts
router.get("/", (req, res) => {
  return res.send("Hello, world!");
});
```

### Request

```ts
{
  query: Object;
  params: Object; // same as query
  body: Object;
}
```

### Response

- `send`: return string as html or object as json.
- `html`: return html page.
- `json`: return json data.
- `render`: render html template, supports native GAS template, [Handlebars](https://handlebarsjs.com/) and [Ejs](https://ejs.co/).
- `success`: return json data in form of a [ResponseSuccess](https://github.com/sheetbase/serverv1/blob/e6e1235f6b30635860bf3b3945b7fc09f715611b/src/lib/types.ts#L43).
- `error`: return json data in form of a [ResponseError](https://github.com/sheetbase/serverv1/blob/e6e1235f6b30635860bf3b3945b7fc09f715611b/src/lib/types.ts#L32).

### Routing errors

Use `setErrors` to resgister your app routing errors. So that you can just do `res.error(code)` later.

```ts
// set errors
router.setErrors({
  error1: "Error 1",
  error2: { status: 500, message: "Error 2" }
});

// later, in a route
return res.error("error1");
```

### With middlewares

For a certain route.

```ts
const Middleware = (req, res, next) => {
  return next();
};

router.get("/", Middleware, (req, res) => {
  return res.send("Final!");
});
```

For all routes.

```ts
router.use((req, res, next) => {
  return next();
});
```

### Middleware data

Want to send data downstream.

```ts
return next({ foo: "bar" });
```

### Render HTML template

To render HTML template with [Handlebars](https://handlebarsjs.com/) or [Ejs](https://ejs.co/).

Place your template files with the coresponding extensions somewhere in the project, may be `views` folder. Remmber to set it in configs.

For Handlebars, file extension would be `.hbs.html`, for Ejs it is `ejs.html`;

Add the vendor js to your app, before main app code. With app-scripts, the build script would be `sheetbase-app-scripts build --vendor <path to js file>`

<!-- </block:body> -->

## License

**@sheetbase/server** is released under the [MIT](https://github.com/sheetbase/serverv1/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/serverv1/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
