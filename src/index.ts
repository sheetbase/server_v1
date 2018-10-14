import { IModule, IOptions } from '../index';
import { Sheetbase } from './sheetbase';

export declare const SheetbaseModule: {(options?: IOptions): IModule};

declare const options: IOptions; 
export const moduleExports: IModule = new Sheetbase(options);
