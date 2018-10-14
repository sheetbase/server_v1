import { IModule, IHttpEvent, IRouteRequest, IRouteResponse, IRouteHandler } from '../index';

export class Http {
    private _Sheetbase: IModule;
    private _allowedMethods: string[] = [
        'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
    ];

    constructor (Sheetbase: IModule) {
        this._Sheetbase = Sheetbase;
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
        const allowMethodsWhenDoGet: boolean = this._Sheetbase.Option.get('allowMethodsWhenDoGet');
        if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
            method = (<string> (e.parameter || {}).method || 'GET').toUpperCase();
            method = (this._allowedMethods.indexOf(method) > -1) ? method: 'GET';
        }
        // request object
        let req: IRouteRequest = {
            query: e.parameter || {},
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
        let res: IRouteResponse = this._Sheetbase.Response;
        // run handlers
        let handlers: IRouteHandler[] = this._Sheetbase.Router.route(method, endpoint);
        return this._run(handlers, req, res);
    }

    private _run(handlers: IRouteHandler[], req: IRouteRequest, res: IRouteResponse) {
        let handler: IRouteHandler = handlers.shift();
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