import { IModule, IOptions } from '../index';

export class App {
    private _Sheetbase: IModule;
    
    use;
    all;
    get;
    post;
    put;
    patch;
    delete;

    set;

    constructor (Sheetbase: IModule, options?: IOptions) {
        this._Sheetbase = Sheetbase;
        this._Sheetbase.Option.set(options);

        // Router
        this.use = this._Sheetbase.Router.use;
        this.all = this._Sheetbase.Router.all;
        this.get = this._Sheetbase.Router.get;
        this.post = this._Sheetbase.Router.post;
        this.put = this._Sheetbase.Router.put;
        this.patch = this._Sheetbase.Router.patch;
        this.delete = this._Sheetbase.Router.delete;

        // Option
        this.set = this._Sheetbase.Option.set;
    }


}
