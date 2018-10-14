import { IOptions } from './option';
import { IHttpEvent } from './http';
import { IRouteHandler } from './route';

export interface IModule {
    Option: IOption;
    HTTP: IHttp;
    Request: IRequest;
    Response: IResponse;
    Router: IRouter;
    init(options?: IOptions): IModule;
    app(options?: IOptions): IApp;
}

export interface IApp {
    use(...handlers: (string | IRouteHandler)[]);
    all(routeName: string, ...handlers: IRouteHandler[]);
    get(routeName: string, ...handlers: IRouteHandler[]);
    post(routeName: string, ...handlers: IRouteHandler[]);
    put(routeName: string, ...handlers: IRouteHandler[]);
    patch(routeName: string, ...handlers: IRouteHandler[]);
    delete(routeName: string, ...handlers: IRouteHandler[]);
    set(dataOrKey: IOptions | string, value?: any): IOptions;
}

export interface IOption {
    get(key?: string): IOptions | any;
    set(dataOrKey: IOptions | string, value?: any): IOptions;
}

export interface IHttp {
    get(e: IHttpEvent);
    post(e: IHttpEvent);
}

export interface IRequest {
    query(e: IHttpEvent);
    body(e: IHttpEvent);
}

export interface IResponse {
    send(content: any);
    html(html: string);
    render(file: string, data?: any, viewEngine?: string);
    json(object: any);
    success(data: any, meta?: any);
    error(code?: string, message?: string, httpCode?: number, meta?: any);
}

export interface IRouter {
    use(...handlers: (string | IRouteHandler)[]);
    all(routeName: string, ...handlers: IRouteHandler[]);
    get(routeName: string, ...handlers: IRouteHandler[]);
    post(routeName: string, ...handlers: IRouteHandler[]);
    put(routeName: string, ...handlers: IRouteHandler[]);
    patch(routeName: string, ...handlers: IRouteHandler[]);
    delete(routeName: string, ...handlers: IRouteHandler[]);
    route(method: string, routeName: string);
}
