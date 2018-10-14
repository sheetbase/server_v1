import { IHttpEvent } from '../index';

export class Request {

    constructor () {}

    query(e: IHttpEvent) {
        if (!e) { throw new Error('No Http event.'); }
        return (e.parameter || {});
    }

    body(e: IHttpEvent) {
        if (!e) { throw new Error('No Http event.'); }
        let body = JSON.parse(e.postData ? e.postData.contents : '{}');
        return body;
    }
}