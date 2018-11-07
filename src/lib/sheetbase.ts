import { OptionService } from './option';
import { HttpService } from './http';
import { RequestService } from './request';
import { ResponseService } from './response';
import { RouterService } from './router';

export const Option = new OptionService();
export const Router = new RouterService();
export const Request = new RequestService();
export const Response = new ResponseService(Option);
export const HTTP = new HttpService(Option, Response, Router);