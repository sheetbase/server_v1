import { ResponseService } from './response';
import { RouterService } from './router';

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
    params?: RouteQuery;
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
    error?: boolean;
    code?: string;
    message?: string;
    status?: number;
    meta?: {
        at?: number;
        [key: string]: any;
    };
}

export interface ResponseSuccess {
    data: any;
    success?: boolean;
    status?: number;
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

export interface RoutingError {
    message: string;
    code?: string | number;
    status?: number;
}

export interface RoutingErrors {
    [code: string]: string | RoutingError;
}

export interface AddonRoutesOptions {
    router: RouterService;
    disabledRoutes?: string | string[];
    endpoint?: string;
    middlewares?: RouteHandler[];
}
