import { Options } from './types';
export declare class OptionService {
    private options;
    constructor();
    get(key?: string): Options | any;
    set(dataOrKey: Options | string, value?: any): Options;
}
