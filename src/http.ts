import { IConfig, IRouter, IResponse } from './types/module';
import { IHttpEvent, IHttpRequest, IHttpHandler } from './types/http';

export class Http {
    private _Config: IConfig;
    private _Router: IRouter;
    private _Response: IResponse;
    private _allowedMethods: string[] = [
        'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
    ];

    constructor (Config: IConfig, Router: IRouter, Response: IResponse) {
        this._Config = Config;
        this._Router = Router;
        this._Response = Response;
    }

    get(e: IHttpEvent) {
        return this._http(e, 'GET');
    }

    post(e: IHttpEvent) {
        return this._http(e, 'POST');
    }

    private _http(e: IHttpEvent, method: string) {
        let endpoint: string = (e.parameter || {}).e || '';
        if (endpoint.substr(0,1) !== '/') { endpoint = '/'+ endpoint; }
        // methods
        const allowMethodsWhenDoGet: boolean = this._Config.get('allowMethodsWhenDoGet');
        if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
            method = (<string> (e.parameter || {}).method || 'GET').toUpperCase();
            method = (this._allowedMethods.indexOf(method) > -1) ? method: 'GET';
        }
        // request object
        let req: IHttpRequest = {
            queries: e.parameter || {},
            params: e.parameter || {},
            body: {},
            data: {}
        };
        if(method === 'GET' && allowMethodsWhenDoGet) {
            try {
                req.body = JSON.parse((e.parameter || {}).body || '{}');
            } catch (error) {
                req.body = {};
            }
        } else {                
            req.body = JSON.parse(e.postData ? e.postData.contents : '{}');
        }
        // response object
        let res: IResponse = this._Response;
        // run handlers
        let handlers: IHttpHandler[] = this._Router.route(method, endpoint);
        return this._run(handlers, req, res);
    }

    private _run(handlers: IHttpHandler[], req: IHttpRequest, res: IResponse) {
        let handler: IHttpHandler = handlers.shift();
        if (!handler) {
            throw new Error('Invalid router handler!');
        }
        if (handlers.length < 1) {
            return handler(req, res);
        } else {
            let next = (data: any) => {
                if (data) {
                    if (!(data instanceof Object)) {
                        data = { value: data };
                    }
                    req.data = Object.assign({}, req.data || {}, data || {});
                }
                return this._run(handlers, req, res);
            }
            return handler(req, res, next);
        }
    }
}