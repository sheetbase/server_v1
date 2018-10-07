import { IConfig } from './types/module';
import { IHttpError } from './types/http';

declare const HandlebarsModule: {()};
var Handlebars = Handlebars || HandlebarsModule();
declare const EjsModule: {()};
var Ejs = Ejs || EjsModule();

export class Response {
    private _Config: IConfig;
    private _allowedExtensions: string[] = [
        'gs', 'hbs', 'ejs'
    ];

    constructor (Config: IConfig) {
        this._Config = Config;
    }

    send(content: any) {
        if(content instanceof Object) return this.json(content); 
        return this.html(content);
    }

    html(html: string) {
        return HtmlService.createHtmlOutput(html);
    }
    
    render(template: any, data: any = {}, viewEngine: string = null) {
        viewEngine = viewEngine ||  this._Config.get('view engine') || 'gs';
        if (typeof template === 'string') {
            const fileName: string = template;
            const views: string = this._Config.get('views');
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
            const handlebars = Handlebars.compile(templateText);
            outputHtml = handlebars(data);
        } else if(viewEngine === 'ejs') {
            outputHtml = Ejs.render(templateText, data);
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
    
    success(data: any, meta: any = null) {
        let responseData = data;
        if (!responseData) {
            throw new Error('No response data.');
        }
        if (!(responseData instanceof Object)) {
            responseData = { value: responseData };
        }
        if (!responseData.error) {
            responseData = {
                success: true,
                status: 200,
                data: responseData
            };
            meta = meta || {};
            if (!(meta instanceof Object)) meta = { value: meta };
            meta.at = (new Date()).getTime();
            responseData.meta = meta;
        }
        return this.json(responseData);
    }

    error(code: string = 'app/unknown', message: string = 'Something wrong!', httpCode: number = 500, data: any = {}) {
        let theError: IHttpError = {
            error: true,
            status: httpCode,
            data,
            meta: {
                at: (new Date()).getTime(),
                code,
                message
            }
        };
        return this.json(theError);
    }
}