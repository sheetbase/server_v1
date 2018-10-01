// import { IHandlebarsModule } from '@sheetbase/handlebars-server';
// import { IEjsModule } from '@sheetbase/ejs-server';
declare const Handlebars/*: IHandlebarsModule*/;
declare const Ejs/*: IEjsModule*/;

import { ISheetbaseModule, IApp, IResponse, IRouter, IConfig } from './types/module';
import { IHttpRequest, IHttpEvent, IHttpHandler, IHttpError } from './types/http';
import { IAppConfigs } from './types/data';


export function sheetbaseModuleExports(): ISheetbaseModule {

    class Config {
        private configs: any = {};

        constructor () { }

        get(key: string = null): any {
            if (key) return this.configs[key];
            return this.configs;
        }

        set(dataOrKey: IAppConfigs | string, value: any = null) {
            if (dataOrKey instanceof Object) {
                const data = dataOrKey;
                for (const key of Object.keys(data)) {
                    this.configs[key] = data[key];
                }
            } else {
                const key = dataOrKey;
                this.configs[key] = value;
            }
            // auto generated
            if (!this.configs['backendUrl']) {
                this.configs['backendUrl'] = ScriptApp.getService().getUrl();
            }
            return this.configs;
        }
    }

    class Http {
        private config: IConfig;
        private router: IRouter;
        private response: IResponse;
        private allowedMethods: string[] = [
            'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
        ];

        constructor (config: IConfig, router: IRouter, response: IResponse) {
            this.config = config;
            this.router = router;
            this.response = response;
        }

        get(e: IHttpEvent) {
            return this.http(e, 'GET');
        }
    
        post(e: IHttpEvent) {
            return this.http(e, 'POST');
        }

        private http(e: IHttpEvent, method: string) {
            let endpoint: string = (e.parameter || {}).e || '';
            if (endpoint.substr(0,1) !== '/') { endpoint = '/'+ endpoint; }
            // methods
            const allowMethodsWhenDoGet: boolean = this.config.get('allowMethodsWhenDoGet');
            if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
                method = (<string> (e.parameter || {}).method || 'GET').toUpperCase();
                method = (this.allowedMethods.indexOf(method) > -1) ? method: 'GET';
            }
            // request object
            let req: IHttpRequest = {
                queries: e.parameter || {},
                params: e.parameter || {},
                body: {},
                data: {}
            };
            if(method === 'GET' && allowMethodsWhenDoGet) {
                try {
                    req.body = JSON.parse((e.parameter || {}).body || '{}');
                } catch (error) {
                    req.body = {};
                }
            } else {                
                req.body = JSON.parse(e.postData ? e.postData.contents : '{}');
            }
            // response object
            let res: IResponse = this.response;
            // run handlers
            let handlers: IHttpHandler[] = this.router.route(method, endpoint);
            return this.run(handlers, req, res);
        }
    
        private run(handlers: IHttpHandler[], req: IHttpRequest, res: IResponse) {
            let handler: IHttpHandler = handlers.shift();
            if (!handler) {
                throw new Error('Invalid router handler!');
            }
            if (handlers.length < 1) {
                return handler(req, res);
            } else {
                let next = (data: any) => {
                    if (data) {
                        if (!(data instanceof Object)) {
                            data = { value: data };
                        }
                        req.data = Object.assign({}, req.data || {}, data || {});
                    }
                    return this.run(handlers, req, res);
                }
                return handler(req, res, next);
            }
        }
    }

    class Request {

        constructor () { }

        queries(e: IHttpEvent) {
            if (!e) {
                throw new Error('No Http event.');
            }
            return (e.parameter || {});
        }
        query(e: IHttpEvent, key: string = null) {
            let queries = this.queries(e);
            if (key) return queries[key];
            return queries;
        }

        params(e: IHttpEvent) {
            return this.queries(e);
        }
        param(e: IHttpEvent, key: string = null) {
            return this.query(e, key);
        }

        body(e: IHttpEvent, key: string = null) {
            if (!e) {
                throw new Error('No Http event.');
            }
            let body = JSON.parse(e.postData ? e.postData.contents : '{}');
            if (key) return body[key];
            return body;
        }
    }

    class Response {
        private config: IConfig;
        private allowedExtensions: string[] = [
            'gs', 'hbs', 'ejs'
        ];

        constructor (config: IConfig) {
            this.config = config;
        }

        send(content: any) {
            if(content instanceof Object) return this.json(content); 
            return this.html(content);
        }
    
        html(html: string) {
            return HtmlService.createHtmlOutput(html);
        }
        
        render(file: any, data: any = {}) {
            const views: string = this.config.get('views') || 'views';
            let fileExt: string = (<string[]> file.split('.')).pop();
            fileExt = (this.allowedExtensions.indexOf(fileExt) > -1) ? fileExt: null;
            const viewEngine = fileExt || this.config.get('view engine') || 'gs';
            // render accordingly
            let template = HtmlService.createTemplateFromFile(`${views}/${file}`);
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

    class Router {
        private routes = {};
        private sharedMiddlewares = [];
        private routeMiddlewares = {};

        constructor () { }

        use(...handlers: any[]) {
            if (!!handlers[0] && handlers[0] instanceof Function) {
                this.sharedMiddlewares = this.sharedMiddlewares.concat(handlers);
            } else {
                const routeName = handlers.shift();
                this.register('ALL', routeName, handlers);
            }
        }

        all(routeName: string, ...handlers: any[]) {
            this.register('ALL', routeName, ...handlers);
        }
        get(routeName: string, ...handlers: any[]) {
            this.register('GET', routeName, ...handlers);
        }
        post(routeName: string, ...handlers: any[]) {
            this.register('POST', routeName, ...handlers);
        }
        put(routeName: string, ...handlers: any[]) {
            this.register('PUT', routeName, ...handlers);
        }        
        patch(routeName: string, ...handlers: any[]) {
            this.register('PATCH', routeName, ...handlers);
        }
        delete(routeName: string, ...handlers: any[]) {
            this.register('DELETE', routeName, ...handlers);
        }        

        route(method: string, routeName: string) {
            var notFoundHandler: IHttpHandler = (req, res) => {
                try {                    
                    return res.render('404');
                } catch (error) {
                    return res.html('<h1>404! Not found.</h1>');
                }
            };
            let handler = this.routes[method + ':' + routeName] || notFoundHandler;
            let handlers = this.routeMiddlewares[method + ':' + routeName] || [];
            // shared middlewares
            handlers = this.sharedMiddlewares.concat(handlers);
            // main handler
            handlers.push(handler);
            return handlers;
        }

        private register(method: string, routeName: string, ...handlers: any[]) {
            if (!routeName) {
                throw new Error('Invalid route name.');
            }
            if(handlers.length < 1) {
                throw new Error('No handlers.');
            }
            // remove invalid handlers
            for (let i = 0; i < handlers.length; i++) {
                if (!handlers[i] || (i !== 0 && !(handlers[i] instanceof Function))) {
                    handlers.splice(i, 1);
                }
            }
            // register
            method = method || 'ALL';
            let handler = handlers.pop();
            if (method === 'ALL' || method === 'GET') {
                this.routes['GET:'+ routeName] = handler;
                this.routeMiddlewares['GET:'+ routeName] = handlers;
            }
            if (method === 'ALL' || method === 'POST') {
                this.routes['POST:'+ routeName] = handler;
                this.routeMiddlewares['POST:'+ routeName] = handlers;
            }
            if (method === 'ALL' || method === 'PUT') {
                this.routes['PUT:'+ routeName] = handler;
                this.routeMiddlewares['PUT:'+ routeName] = handlers;
            }            
            if (method === 'ALL' || method === 'PATCH') {
                this.routes['PATCH:'+ routeName] = handler;
                this.routeMiddlewares['PATCH:'+ routeName] = handlers;
            }
            if (method === 'ALL' || method === 'DELETE') {
                this.routes['DELETE:'+ routeName] = handler;
                this.routeMiddlewares['DELETE:'+ routeName] = handlers;
            }
        }
    }

    // exports
    const config = new Config();
    const router = new Router();
    const request = new Request();
    const response = new Response(config);
    const http = new Http(config, router, response);
    const app = (configs: IAppConfigs = {}): IApp => {
        config.set(configs);
        return {
            // router
            use: router.use,
            all: router.all,
            get: router.get,
            post: router.post,
            put: router.put,
            patch: router.patch,
            delete: router.delete,
            // config
            set: config.set
        };
    }
    return {
        app: app,
        Config: config,
        Router: router,
        Request: request,
        Response: response,
        HTTP: http
    };
}