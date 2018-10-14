# Sheetbase Module: @sheetbase/core-server

Sheetbase core module for backend app.

<!-- <block:header> -->

[![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

- Using npm: `npm install --save @sheetbase/core-server`

- As a library: `1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`

  Set the _Indentifier_ to **Sheetbase** and select the lastest version, [view code](https://script.google.com/d/1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ/edit?usp=sharing).

## Scopes

`https://www.googleapis.com/auth/script.scriptapp`

## Examples

```ts
function example1() {
  let views = Sheetbase.Option.get("views");
  Logger.log(views);
}
```

## Documentation

See the docs: https://sheetbase.github.io/module-core-server

## API

An overview of the API, for detail please refer [the documentation](https://sheetbase.github.io/module-core-server).

### Sheetbase

```ts
export interface IModule {
  Option: IOption;
  HTTP: IHttp;
  Request: IRequest;
  Response: IResponse;
  Router: IRouter;
  init(options?: IOptions): IModule;
  app(options?: IOptions): IApp;
}
```

### Sheetbase.Option

```ts
export interface IOption {
  get(key?: string): IOptions | any;
  set(dataOrKey: IOptions | string, value?: any): IOptions;
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
  query(e: IHttpEvent);
  body(e: IHttpEvent);
}
```

### Sheetbase.Response

```ts
export interface IResponse {
  send(content: any);
  html(html: string);
  render(file: string, data?: any, viewEngine?: string);
  json(object: any);
  success(data: any, meta?: any);
  error(code?: string, message?: string, httpCode?: number, meta?: any);
}
```

### Sheetbase.Router

```ts
export interface IRouter {
  use(...handlers: (string | IRouteHandler)[]);
  all(routeName: string, ...handlers: IRouteHandler[]);
  get(routeName: string, ...handlers: IRouteHandler[]);
  post(routeName: string, ...handlers: IRouteHandler[]);
  put(routeName: string, ...handlers: IRouteHandler[]);
  patch(routeName: string, ...handlers: IRouteHandler[]);
  delete(routeName: string, ...handlers: IRouteHandler[]);
  route(method: string, routeName: string);
}
```

## License

**@sheetbase/core-server** is released under the [MIT](https://github.com/sheetbase/module-core-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

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

<!-- </block:footer> -->
