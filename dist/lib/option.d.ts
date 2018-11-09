import { Options } from './types';
export declare class OptionService {
    private options;
    constructor(options: Options);
    get(key?: string): Options | any;
    set(dataOrKey: Options | string, value?: any): Options;
}
