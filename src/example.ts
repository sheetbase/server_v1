import { IModule } from './types/module';
declare const SheetbaseModule: {(): IModule};
var Sheetbase = Sheetbase || SheetbaseModule();

export function example1() {
    let configs = Sheetbase.Config.get();
    Logger.log(configs);
}

export function example2() {
    Sheetbase.Config.set('a', 456);
    let configs = Sheetbase.Config.get();
    Logger.log(configs);
}