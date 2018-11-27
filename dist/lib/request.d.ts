import { HttpEvent } from './types';
export declare class RequestService {
    constructor();
    query(e?: HttpEvent): any;
    params(e?: HttpEvent): any;
    body(e?: HttpEvent): {};
}
