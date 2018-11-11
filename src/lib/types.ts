import { ResponseService } from './response';

export interface HttpEvent {
    parameter?: any;
    postData?: any;
}

export interface Options {
    allowMethodsWhenDoGet?: boolean;
    views?: string;
}

export interface RouteRequest {
    query?: RouteQuery;
    body?: any;
    data?: any;
}

export interface RouteResponse extends ResponseService {}

export interface RouteQuery {
    e?: string;
    method?: string;
    body?: string;
    [key: string]: any;
}

export interface ResponseError {
    error: boolean;
    status: number;
    code?: string;
    message?: string;
    meta?: {
        at?: number;
        [key: string]: any;
    };
}

export interface ResponseSuccess {
    success: boolean;
    status: number;
    data: any;
    meta?: {
        at?: number;
        [key: string]: any;
    };
}

export interface RouteNext {
    <Data>(data?: Data): RouteHandler;
}

export interface RouteHandler {
    (req: RouteRequest, res: RouteResponse, next?: RouteNext);
}

export interface RoutingErrors {
    [code: string]: {
        status?: number;
        message?: string;
    };
}

export interface AddonRoutesOptions {
    endpoint?: string;
    middlewares?: RouteHandler[];
}