import { IHttpEvent, IHttpHandler } from './http';

export interface IModule {
    app(configs?: IConfigs): IApp;
    Config: IConfig;
    HTTP: IHttp;
    Request: IRequest;
    Response: IResponse;
    Router: IRouter;
}

export interface IConfig {
    get(key?: string);
    set<Value>(dataOrKey: IConfigs | string, value?: Value);
}

export interface IHttp {
    get(e: IHttpEvent);
    post(e: IHttpEvent);
}

export interface IRequest {
    queries(e: IHttpEvent);
    params(e: IHttpEvent);
    query(e: IHttpEvent, key?: string);
    param(e: IHttpEvent, key?: string);
    body(e: IHttpEvent, key?: string);
}

export interface IResponse {
    send<Content>(content: Content);
    html(html: string);
    render<Data>(file: string, data?: Data, viewEngine?: string);
    json<Obj>(object: Obj);
    success<Data, Meta>(data: Data, meta?: Meta);
    error<Data>(code?: string, message?: string, httpCode?: number, data?: Data);
}

export interface IRouter {
    use(...handlers: (string | IHttpHandler)[]);
    all(routeName: string, ...handlers: IHttpHandler[]);
    get(routeName: string, ...handlers: IHttpHandler[]);
    post(routeName: string, ...handlers: IHttpHandler[]);
    put(routeName: string, ...handlers: IHttpHandler[]);
    patch(routeName: string, ...handlers: IHttpHandler[]);
    delete(routeName: string, ...handlers: IHttpHandler[]);
    route?(method: string, routeName: string);
}

export interface IApp {
    use(...handlers: (string | IHttpHandler)[]);
    all(routeName: string, ...handlers: IHttpHandler[]);
    get(routeName: string, ...handlers: IHttpHandler[]);
    post(routeName: string, ...handlers: IHttpHandler[]);
    put(routeName: string, ...handlers: IHttpHandler[]);
    patch(routeName: string, ...handlers: IHttpHandler[]);
    delete(routeName: string, ...handlers: IHttpHandler[]);
    set<Value>(dataOrKey: IConfigs | string, value?: Value);
}



export interface IConfigs {
    // system
    allowMethodsWhenDoGet?: boolean;
    // app (shared)
    apiKey?: string;
    backendUrl?: string;
    databaseId?: string;
    encryptionKey?: string;
    authUrl?: string;
}