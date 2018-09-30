import { IResponse } from './module';

export interface IHttpRequest {
    queries?: any,
    params?: any;
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
    (data?: any): IHttpHandler;
}

export interface IHttpHandler {
    (req: IHttpRequest, res: IResponse, next?: IHttpNext);
}