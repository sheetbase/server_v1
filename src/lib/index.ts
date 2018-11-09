import { Options } from './types';

import { OptionService } from './option';
import { HttpService } from './http';
import { RequestService } from './request';
import { ResponseService } from './response';
import { RouterService } from './router';
import { UtilsService } from './utils';

export function sheetbase(options?: Options) {
    const Option = new OptionService(options);
    const Router = new RouterService();
    const Request = new RequestService();
    const Response = new ResponseService(Option);
    const HTTP = new HttpService(Option, Response, Router);
    const Utils = new UtilsService();
    return {
        Option,
        Router,
        Request,
        Response,
        HTTP,
        Utils,
    };
}
