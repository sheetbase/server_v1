# Install

## With NPM

`npm install --save @sheetbase/core-server`

For TS/ES2015 project:

```ts
import { sheetbase } from '@sheetbase/core-server';

const Sheetbase = sheetbase();

Sheetbase.Router.get('/', (req, res) => {
    return res.send('Hi!');
});

Sheetbase.Router.post('/', (req, res) => {
    return res.json({ greeting: 'Hi!' });
});
```

## As Google Apps Script library

See how to use GAS library: <https://developers.google.com/apps-script/guides/libraries>

Core server ID: `1bhE_YkXnzZLr9hZk_5NXgCY6bAe73UHIGjM4dvyRJLLTyccpu5vS6jeJ`

```js
var Sheetbase = SheetbaseModule.Sheetbase.sheetbase();
```