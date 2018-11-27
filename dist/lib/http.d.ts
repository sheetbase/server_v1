import { HttpEvent } from './types';
import { OptionService } from './option';
import { ResponseService } from './response';
import { RouterService } from './router';
export declare class HttpService {
    private optionService;
    private responseService;
    private routerService;
    private allowedMethods;
    constructor(optionService: OptionService, responseService: ResponseService, routerService: RouterService);
    get(e: HttpEvent): any;
    post(e: HttpEvent): any;
    private http;
    private execute;
}
