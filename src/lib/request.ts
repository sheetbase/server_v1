import { HttpEvent } from './types';

export class RequestService {

    constructor () {}

    query(e: HttpEvent) {
        if (!e) { throw new Error('No Http event.'); }
        return (e.parameter || {});
    }

    body(e: HttpEvent) {
        if (!e) { throw new Error('No Http event.'); }
        const body = JSON.parse(e.postData ? e.postData.contents : '{}');
        return body;
    }
}