import { ResponseError, ResponseSuccess, RoutingErrors } from './types';
import { OptionService } from './option';

declare const ejs: any;
declare const Handlebars: any;

export class ResponseService {
    private optionService: OptionService;

    private allowedExtensions: string[] = [
        'gs', 'hbs', 'ejs',
    ];

    constructor (optionService: OptionService) {
        this.optionService = optionService;
    }

    setErrors(errors: RoutingErrors, override = false): void {
        this.optionService.setRoutingErrors(errors, override);
    }

    send(content: string | {}) {
        if(content instanceof Object) return this.json(content);
        return this.html(content);
    }

    html(html: string) {
        return HtmlService.createHtmlOutput(html);
    }

    render(template: any, data: {} = {}, viewEngine = 'raw') {
        if (typeof template === 'string') {
            const fileName: string = template;
            const views: string = this.optionService.get('views') as string;
            let fileExt: string = (template.split('.') as string[]).pop();
            fileExt = (this.allowedExtensions.indexOf(fileExt) > -1) ? fileExt : null;
            if (fileExt) { viewEngine = fileExt; }
            template = HtmlService.createTemplateFromFile((views ? views + '/' : '') + fileName);
        }
        // render accordingly
        const templateText: string = template.getRawContent();
        let outputHtml: string;
        if (viewEngine === 'native' || viewEngine === 'gs') {
            try {
                for (const key of Object.keys(data)) {
                    template[key] = data[key];
                }
                // NOTE: somehow this doesn't work
                outputHtml = template.evaluate().getContent();
            } catch (error) {
                outputHtml = templateText;
            }
        } else if (viewEngine === 'handlebars' || viewEngine === 'hbs') {
            const render = Handlebars.compile(templateText);
            outputHtml = render(data);
        } else if(viewEngine === 'ejs') {
            outputHtml = ejs.render(templateText, data);
        } else {
            outputHtml = templateText;
        }
        return this.html(outputHtml);
    }

    json(object: {}) {
        const JSONString = JSON.stringify(object);
        const JSONOutput = ContentService.createTextOutput(JSONString);
        JSONOutput.setMimeType(ContentService.MimeType.JSON);
        return JSONOutput;
    }

    success(data: {}, meta: any = {}) {
        if (!data) return this.error();

        if (!(data instanceof Object)) {
            data = { value: data };
        }
        if (!(meta instanceof Object)) {
            meta = { value: meta };
        }

        const success: ResponseSuccess = {
            success: true,
            status: 200,
            data,
            meta: {
                at: (new Date()).getTime(),
                ... meta,
            },
        };
        return this.json(success);
    }

    error(
        err: ResponseError = {},
        meta: any = {},
    ) {
        if (!err.status) err.status = 500;
        if (!err.code) err.code = 'unknown';
        if (!err.message) err.message = 'Unknown error.';
        if (!(meta instanceof Object)) {
            meta = { value: meta };
        }

        const error: ResponseError = {
            ... err,
            error: true,
            meta: {
                at: (new Date()).getTime(),
                ... meta,
            },
        };
        return this.json(error);
    }
}