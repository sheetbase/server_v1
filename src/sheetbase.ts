import { IModule, IApp, IOptions } from '../index';

import { App } from './app';
import { Option } from './option';
import { Http } from './http';
import { Request } from './request';
import { Response } from './response';
import { Router } from './router';

export class Sheetbase {
    Option: Option;
    HTTP: Http;
    Request: Request;
    Response: Response;
    Router: Router;

    constructor(options?: IOptions) {
        this.Option = new Option();
        this.HTTP = new Http(this);
        this.Request = new Request();
        this.Response = new Response(this);
        this.Router = new Router();

        this.init(options);
    }

    init(options?: IOptions): IModule {
        this.Option.set(options);
        return this;
    }

    app(options?: IOptions): IApp {
        return new App(this, options);
    }
}
