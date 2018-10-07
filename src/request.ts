import { IHttpEvent } from './types/http';

export class Request {

    constructor () { }

    queries(e: IHttpEvent) {
        if (!e) {
            throw new Error('No Http event.');
        }
        return (e.parameter || {});
    }
    query(e: IHttpEvent, key: string = null) {
        let queries = this.queries(e);
        if (key) return queries[key];
        return queries;
    }

    params(e: IHttpEvent) {
        return this.queries(e);
    }
    param(e: IHttpEvent, key: string = null) {
        return this.query(e, key);
    }

    body(e: IHttpEvent, key: string = null) {
        if (!e) {
            throw new Error('No Http event.');
        }
        let body = JSON.parse(e.postData ? e.postData.contents : '{}');
        if (key) return body[key];
        return body;
    }
}