import { IConfigs } from './types/module';

export class Config {
    private _configs: any = {};

    constructor () {}

    get(key: string = null): any {
        if (key) return this._configs[key];
        return this._configs;
    }

    set(dataOrKey: IConfigs | string, value: any = null) {
        if (dataOrKey instanceof Object) {
            const data = dataOrKey;
            for (const key of Object.keys(data)) {
                this._configs[key] = data[key];
            }
        } else {
            const key = dataOrKey;
            this._configs[key] = value;
        }
        // auto generated
        if (!this._configs['backendUrl']) {
            this._configs['backendUrl'] = ScriptApp.getService().getUrl();
        }
        return this._configs;
    }
}