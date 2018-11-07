import { HttpEvent } from './types';
import { OptionService } from './option';
import { ResponseService } from './response';
import { RouterService } from './router';
export declare class HttpService {
    private option;
    private response;
    private router;
    private allowedMethods;
    constructor(option: OptionService, response: ResponseService, router: RouterService);
    get(e: HttpEvent): any;
    post(e: HttpEvent): any;
    private http;
    private run;
}
