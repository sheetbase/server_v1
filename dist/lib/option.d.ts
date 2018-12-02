import { Options, RoutingErrors } from './types';
export declare class OptionService {
    private options;
    constructor(options?: Options);
    get(key?: string): Options | any;
    set(dataOrKey: Options | string, value?: any): Options;
    getAllowMethodsWhenDoGet(): boolean;
    setAllowMethodsWhenDoGet(value: boolean): void;
    getViews(): string;
    setViews(value: string): void;
    getDisabledRoutes(): string | string[];
    setDisabledRoutes(value: string[], override?: boolean): void;
    getRoutingErrors(): RoutingErrors;
    setRoutingErrors(value: RoutingErrors, override?: boolean): void;
}
