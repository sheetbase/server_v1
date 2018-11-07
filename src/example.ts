import * as Sheetbase from './public_api';

export function example1() {
    Sheetbase.Option.set('views', 'hbs');
    const views = Sheetbase.Option.get('views');
    Logger.log(views);
}