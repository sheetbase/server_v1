import { compile } from 'handlebars';
import { render } from 'ejs';

import { ResponseError } from './types';

import { OptionService } from './option';

export class ResponseService {
    private optionService: OptionService;

    private allowedExtensions: string[] = [
        'gs', 'hbs', 'ejs',
    ];

    constructor (optionService: OptionService) {
        this.optionService = optionService;
    }

    send(content: any) {
        if(content instanceof Object) return this.json(content);
        return this.html(content);
    }

    html(html: string) {
        return HtmlService.createHtmlOutput(html);
    }

    render(template: any, data: any = {}, viewEngine: string = null) {
        viewEngine = (viewEngine ||  this.optionService.get('view engine') || 'gs') as string;
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
            const render = compile(templateText);
            outputHtml = render(data);
        } else if(viewEngine === 'ejs') {
            outputHtml = render(templateText, data);
        } else {
            outputHtml = templateText;
        }
        return this.html(outputHtml);
    }

    json(object: any) {
        const JSONString = JSON.stringify(object);
        const JSONOutput = ContentService.createTextOutput(JSONString);
        JSONOutput.setMimeType(ContentService.MimeType.JSON);
        return JSONOutput;
    }

    success(data: any, meta: any = {}) {
        if (!(data instanceof Object)) {
            data = { value: data };
        } else {
            data = {
                success: true,
                status: 200,
                data,
                meta: {
                    at: (new Date()).getTime(),
                    ... meta,
                },
            };
        }
        return this.json(data);
    }

    error(
        code = 'app/unknown',
        message = 'Something wrong!',
        httpCode = 500,
        meta: any = {},
    ) {
        const error: ResponseError = {
            error: true,
            status: httpCode,
            code,
            message,
            meta: {
                at: (new Date()).getTime(),
                ... meta,
            },
        };
        return this.json(error);
    }
}