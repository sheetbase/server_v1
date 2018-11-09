import { sheetbase } from './public_api';

export function example1() {
    const Sheetbase = sheetbase({ views: 'views' });

    const views = Sheetbase.Option.get('views');
    Logger.log(views);
}