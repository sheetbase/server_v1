import { SheetbaseModule } from '../index';

const Sheetbase = SheetbaseModule({
    views: 'path/to/views'
});

export function example1() {
    let views = Sheetbase.Option.get('views');
    Logger.log(views);
}