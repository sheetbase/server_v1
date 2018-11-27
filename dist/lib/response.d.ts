import { ResponseError } from './types';
import { OptionService } from './option';
export declare class ResponseService {
    private optionService;
    private allowedExtensions;
    constructor(optionService: OptionService);
    send(content: string | {}): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput;
    html(html: string): GoogleAppsScript.HTML.HtmlOutput;
    render(template: any, data?: {}, viewEngine?: string): GoogleAppsScript.HTML.HtmlOutput;
    json(object: {}): GoogleAppsScript.Content.TextOutput;
    success(data: {}, meta?: any): GoogleAppsScript.Content.TextOutput;
    error(err?: ResponseError, meta?: any): GoogleAppsScript.Content.TextOutput;
}
