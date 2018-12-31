# Configs

Sheetbase app configurations.

## allowMethodsWhenDoGet

- Type: `boolean`
- Default: `false`

Allows POST, PUT, ... when do GET method, useful for testing in browser without re-deploy the web app.

## views

- Type: `string`
- Default: `''`

Views folder, where to put view templating file. Examples: `views`, `public/views`

## disabledRoutes

- Type: `string[]`
- Default: `[]`

List of disabled routes, format: `method:endpoint`. Examples: `[ 'GET:/', 'POST:/me' ]`

## routingErrors

- Type: [RoutingErrors](https://github.com/sheetbase/core-server/blob/d15caa7d464e98057e94ca810d22d88881214310/src/lib/types.ts#L67)
- Default: `{}`

List of routing errors, by codes, when do `res.error(code)`, the router will show the coresponding error to the client.

Examples: `{ foo: 'The Foo error.' }`. Then: `res.error('foo')`, the result will be:

```json
{
    error: true,
    status: 400,
    code: 'foo',
    message: 'The Foo error.'
}
```