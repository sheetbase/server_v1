import { OptionService } from './option';
export declare class ResponseService {
    private option;
    private allowedExtensions;
    constructor(option: OptionService);
    send(content: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput;
    html(html: string): GoogleAppsScript.HTML.HtmlOutput;
    render(template: any, data?: any, viewEngine?: string): GoogleAppsScript.HTML.HtmlOutput;
    json(object: any): GoogleAppsScript.Content.TextOutput;
    success(data: any, meta?: any): GoogleAppsScript.Content.TextOutput;
    error(code?: string, message?: string, httpCode?: number, meta?: any): GoogleAppsScript.Content.TextOutput;
}
