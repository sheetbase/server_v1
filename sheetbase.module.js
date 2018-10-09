var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/core-server
 * Export name: Sheetbase
 * Description: Sheetbase core module for backend app.
 * Version: 0.0.4
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-core-server.git
 */

function SheetbaseModule() {
    // import { IConfigs } from './types/module';
    var Config = /** @class */ (function () {
        function Config() {
            this._configs = {};
        }
        Config.prototype.get = function (key) {
            if (key === void 0) { key = null; }
            if (key)
                return this._configs[key];
            return this._configs;
        };
        Config.prototype.set = function (dataOrKey, value) {
            if (value === void 0) { value = null; }
            if (dataOrKey instanceof Object) {
                var data = dataOrKey;
                for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                    var key = _a[_i];
                    this._configs[key] = data[key];
                }
            }
            else {
                var key = dataOrKey;
                this._configs[key] = value;
            }
            // auto generated
            if (!this._configs['backendUrl']) {
                this._configs['backendUrl'] = ScriptApp.getService().getUrl();
            }
            return this._configs;
        };
        return Config;
    }());
    // import { IConfig, IRouter, IResponse } from './types/module';
    // import { IHttpEvent, IHttpRequest, IHttpHandler } from './types/http';
    var Http = /** @class */ (function () {
        function Http(Config, Router, Response) {
            this._allowedMethods = [
                'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
            ];
            this._Config = Config;
            this._Router = Router;
            this._Response = Response;
        }
        Http.prototype.get = function (e) {
            return this._http(e, 'GET');
        };
        Http.prototype.post = function (e) {
            return this._http(e, 'POST');
        };
        Http.prototype._http = function (e, method) {
            var endpoint = (e.parameter || {}).e || '';
            if (endpoint.substr(0, 1) !== '/') {
                endpoint = '/' + endpoint;
            }
            // methods
            var allowMethodsWhenDoGet = this._Config.get('allowMethodsWhenDoGet');
            if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
                method = ((e.parameter || {}).method || 'GET').toUpperCase();
                method = (this._allowedMethods.indexOf(method) > -1) ? method : 'GET';
            }
            // request object
            var req = {
                queries: e.parameter || {},
                params: e.parameter || {},
                body: {},
                data: {}
            };
            if (method === 'GET' && allowMethodsWhenDoGet) {
                try {
                    req.body = JSON.parse((e.parameter || {}).body || '{}');
                }
                catch (error) {
                    req.body = {};
                }
            }
            else {
                req.body = JSON.parse(e.postData ? e.postData.contents : '{}');
            }
            // response object
            var res = this._Response;
            // run handlers
            var handlers = this._Router.route(method, endpoint);
            return this._run(handlers, req, res);
        };
        Http.prototype._run = function (handlers, req, res) {
            var _this = this;
            var handler = handlers.shift();
            if (!handler) {
                throw new Error('Invalid router handler!');
            }
            if (handlers.length < 1) {
                return handler(req, res);
            }
            else {
                var next = function (data) {
                    if (data) {
                        if (!(data instanceof Object)) {
                            data = { value: data };
                        }
                        req.data = Object.assign({}, req.data || {}, data || {});
                    }
                    return _this._run(handlers, req, res);
                };
                return handler(req, res, next);
            }
        };
        return Http;
    }());
    // import { IHttpEvent } from './types/http';
    var Request = /** @class */ (function () {
        function Request() {
        }
        Request.prototype.queries = function (e) {
            if (!e) {
                throw new Error('No Http event.');
            }
            return (e.parameter || {});
        };
        Request.prototype.query = function (e, key) {
            if (key === void 0) { key = null; }
            var queries = this.queries(e);
            if (key)
                return queries[key];
            return queries;
        };
        Request.prototype.params = function (e) {
            return this.queries(e);
        };
        Request.prototype.param = function (e, key) {
            if (key === void 0) { key = null; }
            return this.query(e, key);
        };
        Request.prototype.body = function (e, key) {
            if (key === void 0) { key = null; }
            if (!e) {
                throw new Error('No Http event.');
            }
            var body = JSON.parse(e.postData ? e.postData.contents : '{}');
            if (key)
                return body[key];
            return body;
        };
        return Request;
    }());
    var Handlebars = Handlebars || HandlebarsModule();
    var Ejs = Ejs || EjsModule();
    var Response = /** @class */ (function () {
        function Response(Config) {
            this._allowedExtensions = [
                'gs', 'hbs', 'ejs'
            ];
            this._Config = Config;
        }
        Response.prototype.send = function (content) {
            if (content instanceof Object)
                return this.json(content);
            return this.html(content);
        };
        Response.prototype.html = function (html) {
            return HtmlService.createHtmlOutput(html);
        };
        Response.prototype.render = function (template, data, viewEngine) {
            if (data === void 0) { data = {}; }
            if (viewEngine === void 0) { viewEngine = null; }
            viewEngine = viewEngine || this._Config.get('view engine') || 'gs';
            if (typeof template === 'string') {
                var fileName = template;
                var views = this._Config.get('views');
                var fileExt = template.split('.').pop();
                fileExt = (this._allowedExtensions.indexOf(fileExt) > -1) ? fileExt : null;
                if (fileExt) {
                    viewEngine = fileExt;
                }
                template = HtmlService.createTemplateFromFile((views ? views + '/' : '') + fileName);
            }
            // render accordingly
            var templateText = template.getRawContent();
            var outputHtml;
            if (viewEngine === 'native' || viewEngine === 'gs') {
                try {
                    for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                        var key = _a[_i];
                        template[key] = data[key];
                    }
                    // TODO: somehow this doesn't work
                    outputHtml = template.evaluate().getContent();
                }
                catch (error) {
                    outputHtml = templateText;
                }
            }
            else if (viewEngine === 'handlebars' || viewEngine === 'hbs') {
                var handlebars = Handlebars.compile(templateText);
                outputHtml = handlebars(data);
            }
            else if (viewEngine === 'ejs') {
                outputHtml = Ejs.render(templateText, data);
            }
            else {
                outputHtml = templateText;
            }
            return this.html(outputHtml);
        };
        Response.prototype.json = function (object) {
            var JSONString = JSON.stringify(object);
            var JSONOutput = ContentService.createTextOutput(JSONString);
            JSONOutput.setMimeType(ContentService.MimeType.JSON);
            return JSONOutput;
        };
        Response.prototype.success = function (data, meta) {
            if (meta === void 0) { meta = null; }
            var responseData = data;
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
                if (!(meta instanceof Object))
                    meta = { value: meta };
                meta.at = (new Date()).getTime();
                responseData.meta = meta;
            }
            return this.json(responseData);
        };
        Response.prototype.error = function (code, message, httpCode, data) {
            if (code === void 0) { code = 'app/unknown'; }
            if (message === void 0) { message = 'Something wrong!'; }
            if (httpCode === void 0) { httpCode = 500; }
            if (data === void 0) { data = {}; }
            var theError = {
                error: true,
                status: httpCode,
                data: data,
                meta: {
                    at: (new Date()).getTime(),
                    code: code,
                    message: message
                }
            };
            return this.json(theError);
        };
        return Response;
    }());
    // import { IHttpHandler } from './types/http';
    var Router = /** @class */ (function () {
        function Router() {
            this._routes = {};
            this._sharedMiddlewares = [];
            this._routeMiddlewares = {};
        }
        Router.prototype.use = function () {
            var handlers = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                handlers[_i] = arguments[_i];
            }
            if (!!handlers[0] && handlers[0] instanceof Function) {
                this._sharedMiddlewares = this._sharedMiddlewares.concat(handlers);
            }
            else {
                var routeName = handlers.shift();
                this._register('ALL', routeName, handlers);
            }
        };
        Router.prototype.all = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this._register.apply(this, ['ALL', routeName].concat(handlers));
        };
        Router.prototype.get = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this._register.apply(this, ['GET', routeName].concat(handlers));
        };
        Router.prototype.post = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this._register.apply(this, ['POST', routeName].concat(handlers));
        };
        Router.prototype.put = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this._register.apply(this, ['PUT', routeName].concat(handlers));
        };
        Router.prototype.patch = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this._register.apply(this, ['PATCH', routeName].concat(handlers));
        };
        Router.prototype["delete"] = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this._register.apply(this, ['DELETE', routeName].concat(handlers));
        };
        Router.prototype.route = function (method, routeName) {
            var notFoundHandler = function (req, res) {
                try {
                    return res.render('errors/404');
                }
                catch (error) {
                    return res.html("\n\t\t\t\t\t<h1>404!</h1>\n\t\t\t\t\t<p>Not found.</p>\n\t\t\t\t");
                }
            };
            var handler = this._routes[method + ':' + routeName] || notFoundHandler;
            var handlers = this._routeMiddlewares[method + ':' + routeName] || [];
            // shared middlewares
            handlers = this._sharedMiddlewares.concat(handlers);
            // main handler
            handlers.push(handler);
            return handlers;
        };
        Router.prototype._register = function (method, routeName) {
            var handlers = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                handlers[_i - 2] = arguments[_i];
            }
            if (!routeName) {
                throw new Error('Invalid route name.');
            }
            if (handlers.length < 1) {
                throw new Error('No handlers.');
            }
            // remove invalid handlers
            for (var i = 0; i < handlers.length; i++) {
                if (!handlers[i] || (i !== 0 && !(handlers[i] instanceof Function))) {
                    handlers.splice(i, 1);
                }
            }
            // register
            method = method || 'ALL';
            var handler = handlers.pop();
            if (method === 'ALL' || method === 'GET') {
                this._routes['GET:' + routeName] = handler;
                this._routeMiddlewares['GET:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'POST') {
                this._routes['POST:' + routeName] = handler;
                this._routeMiddlewares['POST:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'PUT') {
                this._routes['PUT:' + routeName] = handler;
                this._routeMiddlewares['PUT:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'PATCH') {
                this._routes['PATCH:' + routeName] = handler;
                this._routeMiddlewares['PATCH:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'DELETE') {
                this._routes['DELETE:' + routeName] = handler;
                this._routeMiddlewares['DELETE:' + routeName] = handlers;
            }
        };
        return Router;
    }());
    // import { IModule, IApp, IConfigs } from './types/module';
    // import { Config } from './config';
    // import { Http } from './http';
    // import { Request } from './request';
    // import { Response } from './response';
    // import { Router } from './router';
    var config = new Config();
    var router = new Router();
    var request = new Request();
    var response = new Response(config);
    var http = new Http(config, router, response);
    var app = function (configs) {
        if (configs === void 0) { configs = {}; }
        config.set(configs);
        return {
            // router
            use: router.use,
            all: router.all,
            get: router.get,
            post: router.post,
            put: router.put,
            patch: router.patch,
            "delete": router["delete"],
            // config
            set: config.set
        };
    };
    var moduleExports = {
        app: app,
        Config: config,
        Router: router,
        Request: request,
        Response: response,
        HTTP: http
    };
    return moduleExports || {};
}
exports.SheetbaseModule = SheetbaseModule;
// add to the global namespace
var proccess = proccess || this;
proccess['Sheetbase'] = SheetbaseModule();
