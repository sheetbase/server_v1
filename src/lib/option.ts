import { Options } from './types';

export class OptionService {
    private options: Options = {
        allowMethodsWhenDoGet: false,
        views: '',
    };

    constructor (options: Options = {}) {
        this.options = {... this.options, ... options};
    }

    get(key: string = null): Options | any {
        if (key) {
            return this.options[key];
        }
        return this.options;
    }

    set(dataOrKey: Options | string, value: any = null): Options {
        if (dataOrKey instanceof Object) {
            const data = dataOrKey;
            for (const key of Object.keys(data)) {
                this.options[key] = data[key];
            }
        } else {
            const key: string = dataOrKey;
            this.options[key] = value;
        }
        return this.options;
    }
}