import { Handlebars, HandlebarsModule } from '@sheetbase/handlebars-server';
import { Ejs, EjsModule } from '@sheetbase/ejs-server';

import { IModule, IResponseError } from '../index';

export class Response {
    private _Sheetbase: IModule;
    private _allowedExtensions: string[] = [
        'gs', 'hbs', 'ejs'
    ];

    constructor (Sheetbase: IModule) {
        this._Sheetbase = Sheetbase;
    }

    send(content: any) {
        if(content instanceof Object) return this.json(content); 
        return this.html(content);
    }

    html(html: string) {
        return HtmlService.createHtmlOutput(html);
    }
    
    render(template: any, data: any = {}, viewEngine: string = null) {
        viewEngine = <string> (viewEngine ||  this._Sheetbase.Option.get('view engine') || 'gs');
        if (typeof template === 'string') {
            const fileName: string = template;
            const views: string = <string> this._Sheetbase.Option.get('views');
            let fileExt: string = (<string[]> template.split('.')).pop();
            fileExt = (this._allowedExtensions.indexOf(fileExt) > -1) ? fileExt: null;
            if (fileExt) { viewEngine = fileExt; }
            template = HtmlService.createTemplateFromFile((views ? views + '/': '') + fileName);
        }
        // render accordingly
        const templateText: string = template.getRawContent();
        let outputHtml: string;
        if (viewEngine === 'native' || viewEngine === 'gs') {
            try {
                for (const key of Object.keys(data)) {
                    template[key] = data[key];
                }
                // TODO: somehow this doesn't work
                outputHtml = template.evaluate().getContent();
            } catch (error) {
                outputHtml = templateText;
            }
        } else if (viewEngine === 'handlebars' || viewEngine === 'hbs') {
            let handlebars: any;
            if (typeof Handlebars !== 'undefined') {
                handlebars = Handlebars;
            } else if (typeof HandlebarsModule !== 'undefined') {
                handlebars = HandlebarsModule();
            } else {
                throw new Error('No Handlebars module, please install @sheetbase/handlebars-server.');
            }
            const render = handlebars.compile(templateText);
            outputHtml = render(data);
        } else if(viewEngine === 'ejs') {
            let ejs: any;
            if (typeof Ejs !== 'undefined') {
                ejs = Ejs;
            } else if (typeof EjsModule !== 'undefined') {
                ejs = EjsModule();
            } else {
                throw new Error('No Ejs module, please install @sheetbase/ejs-server.');
            }
            outputHtml = ejs.render(templateText, data);
        } else {
            outputHtml = templateText;
        }
        return this.html(outputHtml);
    }
    
    json(object: any) {
        let JSONString = JSON.stringify(object);
        let JSONOutput = ContentService.createTextOutput(JSONString);
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
                    ... meta
                }
            };
        }
        return this.json(data);
    }

    error(code: string = 'app/unknown', message: string = 'Something wrong!', httpCode: number = 500, meta: any = {}) {
        let error: IResponseError = {
            error: true,
            status: httpCode,
            code,
            message,
            meta: {
                at: (new Date()).getTime(),
                ... meta
            }
        };
        return this.json(error);
    }
}