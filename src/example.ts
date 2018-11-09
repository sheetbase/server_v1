import * as Sheetbase from './public_api';

export function example1() {
    const App = Sheetbase.sheetbase({ views: 'views' });

    const views = App.Option.get('views');
    Logger.log(views);
}