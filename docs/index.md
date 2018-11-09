# @sheetbase/core-server

- [Guides](#guides)

- [API Reference](https://sheetbase.github.io/core-server/api)

## Guides

Sheetbase core server guides.

### Install

`npm install --save @sheetbase/core-server`

### Use

```ts
import { sheetbase } from "./public_api";

const Sheetbase = sheetbase({
  views: "hbs"
});

export function example1() {
  const views = Sheetbase.Option.get("views");
  Logger.log(views);
}
```
