import { IHttpEvent, IHttpHandler } from './http';
import { IAppConfigs } from './data';

export interface ISheetbaseModule {
    app: {(configs?: IAppConfigs): IApp};
    Config: IConfig;
    HTTP: IHttp;
    Request: IRequest;
    Response: IResponse;
    Router: IRouter;
}

export interface IConfig {
    get: {(key?: string)};
    set: {(dataOrKey: IAppConfigs | string, value?: any)};
}

export interface IHttp {
    get: {(e: IHttpEvent)};
    post: {(e: IHttpEvent)};
}

export interface IRequest {
    queries: {(e: IHttpEvent)};
    params: {(e: IHttpEvent)};
    query: {(e: IHttpEvent, key?: string)};
    param: {(e: IHttpEvent, key?: string)};
    body: {(e: IHttpEvent, key?: string)};
}

export interface IResponse {
    send: {(content: any)};
    html: {(html: string)};
    render: {(file: string, data?: any)};
    json: {(object: any)};
    success: {(data: any, meta?: any)};
    error: {(code?: string, message?: string, httpCode?: number, data?: any)};
}

export interface IRouter {
    use: {(...handlers: (string | IHttpHandler)[])};
    all: {(routeName: string, ...handlers: IHttpHandler[])};
    get: {(routeName: string, ...handlers: IHttpHandler[])};
    post: {(routeName: string, ...handlers: IHttpHandler[])};
    put: {(routeName: string, ...handlers: IHttpHandler[])};
    patch: {(routeName: string, ...handlers: IHttpHandler[])};
    delete: {(routeName: string, ...handlers: IHttpHandler[])};
    route?: {(method: string, routeName: string)};
}

export interface IApp {
    use: {(...handlers: (string | IHttpHandler)[])};
    all: {(routeName: string, ...handlers: IHttpHandler[])};
    get: {(routeName: string, ...handlers: IHttpHandler[])};
    post: {(routeName: string, ...handlers: IHttpHandler[])};
    put: {(routeName: string, ...handlers: IHttpHandler[])};
    patch: {(routeName: string, ...handlers: IHttpHandler[])};
    delete: {(routeName: string, ...handlers: IHttpHandler[])};
    set: {(dataOrKey: IAppConfigs | string, value?: any)};
}
