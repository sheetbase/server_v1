/**
 * 
 * Name: @sheetbase/core-server
 * Description: Sheetbase core module for backend app.
 * Version: 0.0.2
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-core-server.git
 *
 */
 
import { ISheetbaseModule } from './types/module';

declare const sheetbaseModuleExports: {(): ISheetbaseModule};
const sheetbase = sheetbaseModuleExports();
const Sheetbase = sheetbase;

for (const key of Object.keys(sheetbase)) {
	this[key] = sheetbase[key];
}

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

 