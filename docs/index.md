# @sheetbase/core-server

- [Install](#1-install)

- [Config](#2-config)

- [API Reference](https://sheetbase.github.io/core-server/api)

## Install

### With NPM

`npm install --save @sheetbase/core-server`

For TS/ES2015 project:

```ts
import { sheetbase } from "@sheetbase/core-server";

const Sheetbase = sheetbase();

Sheetbase.Router.get("/", (req, res) => {
  return res.send("Hi!");
});

Sheetbase.Router.post("/", (req, res) => {
  return res.json({ greeting: "Hi!" });
});
```

### By Google Apps Script library

See how to use GAS library: <https://developers.google.com/apps-script/guides/libraries>

Core server ID: `1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`

```js
var Sheetbase = SheetbaseModule.Sheetbase.sheetbase();
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

- Type: [RoutingErrors](https://github.com/sheetbase/core-server/blob/d15caa7d464e98057e94ca810d22d88881214310/src/lib/types.ts#L67)
- Default: `{}`

List of routing errors, by codes, when do `res.error([code])`, the router will show the coresponding error to the client.

Examples: `{ foo: 'The Foo error.' }`. Then: `res.error('foo')`, the result will be:

```json
{
  "error": true,
  "status": 400,
  "code": "foo",
  "message": "The Foo error."
}
```
