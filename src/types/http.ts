import { IResponse } from './module';

export interface IHttpRequest {
    queries?: IHttpQueries,
    params?: IHttpQueries;
    body?: any;
    data?: any;
}

export interface IHttpError {
    error: boolean;
    status: number;
    data?: any;
    meta?: {
        at?: number;
        code?: string;
        message?: string;
        [key: string]: any;
    }
}

export interface IHttpSuccess {
    success: boolean;
    status: number;
    data: any;
    meta?: {
        at?: number;
        [key: string]: any;
    }
}

export interface IHttpEvent {
    parameter?: any;
    postData?: any;
}

export interface IHttpNext {
    <Data> (data?: Data): IHttpHandler;
}

export interface IHttpHandler {
    (req: IHttpRequest, res: IResponse, next?: IHttpNext);
}

export interface IHttpQueries {
    e?: string;
    method?: string;
    body?: string;
}

export interface IRoutingErrors {
    [code: string]: {
        status?: number;
        message?: string;
    }
}

export interface IAddonRoutesOptions {
    customName?: string;
    middlewares?: IHttpHandler[];
}