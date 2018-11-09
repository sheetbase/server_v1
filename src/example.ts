import { app } from './public_api';

const Sheetbase = app({
    views: 'hbs',
});

export function example1() {
    const views = Sheetbase.Option.get('views');
    Logger.log(views);
}