var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/core-server
 * Export name: Sheetbase
 * Description: Sheetbase core module for backend app.
 * Version: 0.0.5
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-core-server.git
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

function SheetbaseModule(options) {
    // import { IModule, IOptions } from '../index';
    var App = /** @class */ (function () {
        function App(Sheetbase, options) {
            this._Sheetbase = Sheetbase;
            this._Sheetbase.Option.set(options);
            // Router
            this.use = this._Sheetbase.Router.use;
            this.all = this._Sheetbase.Router.all;
            this.get = this._Sheetbase.Router.get;
            this.post = this._Sheetbase.Router.post;
            this.put = this._Sheetbase.Router.put;
            this.patch = this._Sheetbase.Router.patch;
            this["delete"] = this._Sheetbase.Router["delete"];
            // Option
            this.set = this._Sheetbase.Option.set;
        }
        return App;
    }());
    // import { IModule, IHttpEvent, IRouteRequest, IRouteResponse, IRouteHandler } from '../index';
    var Http = /** @class */ (function () {
        function Http(Sheetbase) {
            this._allowedMethods = [
                'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
            ];
            this._Sheetbase = Sheetbase;
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
            var allowMethodsWhenDoGet = this._Sheetbase.Option.get('allowMethodsWhenDoGet');
            if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
                method = ((e.parameter || {}).method || 'GET').toUpperCase();
                method = (this._allowedMethods.indexOf(method) > -1) ? method : 'GET';
            }
            // request object
            var req = {
                query: e.parameter || {},
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
            var res = this._Sheetbase.Response;
            // run handlers
            var handlers = this._Sheetbase.Router.route(method, endpoint);
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
    // import { IOptions } from '../index';
    var Option = /** @class */ (function () {
        function Option() {
            this._options = {};
        }
        Option.prototype.get = function (key) {
            if (key === void 0) { key = null; }
            if (key) {
                return this._options[key];
            }
            return this._options;
        };
        Option.prototype.set = function (dataOrKey, value) {
            if (value === void 0) { value = null; }
            if (dataOrKey instanceof Object) {
                var data = dataOrKey;
                for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                    var key = _a[_i];
                    this._options[key] = data[key];
                }
            }
            else {
                var key = dataOrKey;
                this._options[key] = value;
            }
            return this._options;
        };
        return Option;
    }());
    // import { IHttpEvent } from '../index';
    var Request = /** @class */ (function () {
        function Request() {
        }
        Request.prototype.query = function (e) {
            if (!e) {
                throw new Error('No Http event.');
            }
            return (e.parameter || {});
        };
        Request.prototype.body = function (e) {
            if (!e) {
                throw new Error('No Http event.');
            }
            var body = JSON.parse(e.postData ? e.postData.contents : '{}');
            return body;
        };
        return Request;
    }());
    // import { Handlebars, HandlebarsModule } from '@sheetbase/handlebars-server';
    // import { Ejs, EjsModule } from '@sheetbase/ejs-server';
    // import { IModule, IResponseError } from '../index';
    var Response = /** @class */ (function () {
        function Response(Sheetbase) {
            this._allowedExtensions = [
                'gs', 'hbs', 'ejs'
            ];
            this._Sheetbase = Sheetbase;
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
            viewEngine = (viewEngine || this._Sheetbase.Option.get('view engine') || 'gs');
            if (typeof template === 'string') {
                var fileName = template;
                var views = this._Sheetbase.Option.get('views');
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
                var handlebars = void 0;
                if (typeof Handlebars !== 'undefined') {
                    handlebars = Handlebars;
                }
                else if (typeof HandlebarsModule !== 'undefined') {
                    handlebars = HandlebarsModule();
                }
                else {
                    throw new Error('No Handlebars module, please install @sheetbase/handlebars-server.');
                }
                var render = handlebars.compile(templateText);
                outputHtml = render(data);
            }
            else if (viewEngine === 'ejs') {
                var ejs = void 0;
                if (typeof Ejs !== 'undefined') {
                    ejs = Ejs;
                }
                else if (typeof EjsModule !== 'undefined') {
                    ejs = EjsModule();
                }
                else {
                    throw new Error('No Ejs module, please install @sheetbase/ejs-server.');
                }
                outputHtml = ejs.render(templateText, data);
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
            if (meta === void 0) { meta = {}; }
            if (!(data instanceof Object)) {
                data = { value: data };
            }
            else {
                data = {
                    success: true,
                    status: 200,
                    data: data,
                    meta: __assign({ at: (new Date()).getTime() }, meta)
                };
            }
            return this.json(data);
        };
        Response.prototype.error = function (code, message, httpCode, meta) {
            if (code === void 0) { code = 'app/unknown'; }
            if (message === void 0) { message = 'Something wrong!'; }
            if (httpCode === void 0) { httpCode = 500; }
            if (meta === void 0) { meta = {}; }
            var error = {
                error: true,
                status: httpCode,
                code: code,
                message: message,
                meta: __assign({ at: (new Date()).getTime() }, meta)
            };
            return this.json(error);
        };
        return Response;
    }());
    // import { IRouteHandler } from '../index';
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
    // import { IModule, IApp, IOptions } from '../index';
    // import { App } from './app';
    // import { Option } from './option';
    // import { Http } from './http';
    // import { Request } from './request';
    // import { Response } from './response';
    // import { Router } from './router';
    var Sheetbase = /** @class */ (function () {
        function Sheetbase(options) {
            this.Option = new Option();
            this.HTTP = new Http(this);
            this.Request = new Request();
            this.Response = new Response(this);
            this.Router = new Router();
            this.init(options);
        }
        Sheetbase.prototype.init = function (options) {
            this.Option.set(options);
            return this;
        };
        Sheetbase.prototype.app = function (options) {
            return new App(this, options);
        };
        return Sheetbase;
    }());
    var moduleExports = new Sheetbase(options);
    return moduleExports || {};
}
exports.SheetbaseModule = SheetbaseModule;
// add 'Sheetbase' to the global namespace
(function (process) {
    process['Sheetbase'] = SheetbaseModule();
})(this);
// code from global.ts
(function (process) {
    // proxy of Sheetbase.app
    var Sheetbase = process['Sheetbase'];
    process['sheetbase'] = Sheetbase.app;
})(this);
