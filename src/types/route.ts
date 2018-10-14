import { IResponse } from './module';

export interface IRouteRequest {
    query?: IRouteQuery;
    body?: any;
    data?: any;
}

export interface IRouteResponse extends IResponse {}

export interface IRouteQuery {
    e?: string;
    method?: string;
    body?: string;
	[key: string]: any;
}

export interface IResponseError {
    error: boolean;
    status: number;
    code?: string;
    message?: string;
    meta?: {
        at?: number;
        [key: string]: any;
    }
}

export interface IResponseSuccess {
    success: boolean;
    status: number;
    data: any;
    meta?: {
        at?: number;
        [key: string]: any;
    }
}

export interface IRouteNext {
    <Data>(data?: Data): IRouteHandler;
}

export interface IRouteHandler {
    (req: IRouteRequest, res: IRouteResponse, next?: IRouteNext);
}


export interface IRoutingErrors {
    [code: string]: {
        status?: number;
        message?: string;
    }
}

export interface IAddonRoutesOptions {
    endpoint?: string;
    middlewares?: IRouteHandler[];
}