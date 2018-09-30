import { ISheetbaseModule } from './types/module';

declare const sheetbaseExports: {(): ISheetbaseModule};
const sheetbase = sheetbaseExports();
const Sheetbase = sheetbase;

export { sheetbase, Sheetbase };

export function sheetbase_core_example1() {
    let configs = Sheetbase.Config.get();
    Logger.log(configs);
}

export function sheetbase_core_example2() {
    Sheetbase.Config.set('a', 456);
    let configs = Sheetbase.Config.get();
    Logger.log(configs);
}
