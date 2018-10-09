# Sheetbase Module: @sheetbase/core-server

Sheetbase core module for backend app.

<!-- <content> -->

[![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </content> -->

## Install

- Using npm: `npm install --save @sheetbase/core-server`

- As a library: `1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`

  Set the _Indentifier_ to **Sheetbase** and select the lastest version, [view code](https://script.google.com/d/1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ/edit?usp=sharing).

## Scopes

`https://www.googleapis.com/auth/script.scriptapp`

## Examples

```ts
function example1() {
  let configs = Sheetbase.Config.get();
  Logger.log(configs);
}

function example2() {
  Sheetbase.Config.set("a", 456);
  let configs = Sheetbase.Config.get();
  Logger.log(configs);
}
```

## Documentation

See the docs: https://sheetbase.github.io/module-core-server

## API

An overview of the API, for detail please refer [the documentation](https://sheetbase.github.io/module-core-server)

### Sheetbase

```ts
export interface IModule {
  app(configs?: IConfigs): IApp;
  Config: IConfig;
  HTTP: IHttp;
  Request: IRequest;
  Response: IResponse;
  Router: IRouter;
}
```

### Sheetbase.Config

```ts
export interface IConfig {
  get(key?: string);
  set<Value>(dataOrKey: IConfigs | string, value?: Value);
}
```

### Sheetbase.HTTP

```ts
export interface IHttp {
  get(e: IHttpEvent);
  post(e: IHttpEvent);
}
```

### Sheetbase.Request

```ts
export interface IRequest {
  queries(e: IHttpEvent);
  params(e: IHttpEvent);
  query(e: IHttpEvent, key?: string);
  param(e: IHttpEvent, key?: string);
  body(e: IHttpEvent, key?: string);
}
```

### Sheetbase.Response

```ts
export interface IResponse {
  send<Content>(content: Content);
  html(html: string);
  render<Data>(file: string, data?: Data, viewEngine?: string);
  json<Obj>(object: Obj);
  success<Data, Meta>(data: Data, meta?: Meta);
  error<Data>(code?: string, message?: string, httpCode?: number, data?: Data);
}
```

### Sheetbase.Router

```ts
export interface IRouter {
  use(...handlers: (string | IHttpHandler)[]);
  all(routeName: string, ...handlers: IHttpHandler[]);
  get(routeName: string, ...handlers: IHttpHandler[]);
  post(routeName: string, ...handlers: IHttpHandler[]);
  put(routeName: string, ...handlers: IHttpHandler[]);
  patch(routeName: string, ...handlers: IHttpHandler[]);
  delete(routeName: string, ...handlers: IHttpHandler[]);
  route?(method: string, routeName: string);
}
```

## License

**@sheetbase/core-server** is released under the [MIT](https://github.com/sheetbase/module-core-server/blob/master/LICENSE) license.

<!-- <footer> -->

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

<!-- </footer> -->
