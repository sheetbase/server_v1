import { IHttpEvent } from './http';

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
    use: {(...handlers: any[])};
    all: {(routeName: string, ...handlers: any[])};
    get: {(routeName: string, ...handlers: any[])};
    post: {(routeName: string, ...handlers: any[])};
    put: {(routeName: string, ...handlers: any[])};
    patch: {(routeName: string, ...handlers: any[])};
    delete: {(routeName: string, ...handlers: any[])};
    route?: {(routeName: string, ...handlers: any[])};
}

export interface IApp {
    use: {(...handlers: any[])};
    all: {(routeName: string, ...handlers: any[])};
    get: {(routeName: string, ...handlers: any[])};
    post: {(routeName: string, ...handlers: any[])};
    put: {(routeName: string, ...handlers: any[])};
    patch: {(routeName: string, ...handlers: any[])};
    delete: {(routeName: string, ...handlers: any[])};
    set: {(key: string, value: any)};
}

export interface IAppConfigs {
    allowMethodsWhenDoGet?: boolean;
    [key: string]: any;
}
