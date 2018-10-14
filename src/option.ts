import { IOptions } from '../index';

export class Option {
    private _options: IOptions = {};

    constructor () {}

    get(key: string = null): IOptions | any {
        if (key) {
            return this._options[key];
        }
        return this._options;
    }

    set(dataOrKey: IOptions | string, value: any = null): IOptions {
        if (dataOrKey instanceof Object) {
            const data = dataOrKey;
            for (const key of Object.keys(data)) {
                this._options[key] = data[key];
            }
        } else {
            const key: string = dataOrKey;
            this._options[key] = value;
        }
        return this._options;
    }
}