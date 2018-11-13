(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Sheetbase = {})));
}(this, (function (exports) { 'use strict';

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var HttpService = /** @class */ (function () {
        function HttpService(optionService, responseService, routerService) {
            this.allowedMethods = [
                'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
            ];
            this.optionService = optionService;
            this.responseService = responseService;
            this.routerService = routerService;
        }
        HttpService.prototype.get = function (e) {
            return this.http(e, 'GET');
        };
        HttpService.prototype.post = function (e) {
            return this.http(e, 'POST');
        };
        HttpService.prototype.http = function (e, method) {
            var endpoint = (e.parameter || {}).e || '';
            if (endpoint.substr(0, 1) !== '/') {
                endpoint = '/' + endpoint;
            }
            // methods
            var allowMethodsWhenDoGet = this.optionService.get('allowMethodsWhenDoGet');
            if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
                method = ((e.parameter || {}).method || 'GET').toUpperCase();
                method = (this.allowedMethods.indexOf(method) > -1) ? method : 'GET';
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
            var res = this.responseService;
            // run handlers
            var handlers = this.routerService.route(method, endpoint);
            return this.run(handlers, req, res);
        };
        HttpService.prototype.run = function (handlers, req, res) {
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
                        req.data = __assign({}, (req.data || {}), (data || {}));
                    }
                    return _this.run(handlers, req, res);
                };
                return handler(req, res, next);
            }
        };
        return HttpService;
    }());

    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };
    var OptionService = /** @class */ (function () {
        function OptionService(options) {
            this.options = {
                allowMethodsWhenDoGet: false,
                views: 'views'
            };
            this.options = __assign$1({}, this.options, options);
        }
        OptionService.prototype.get = function (key) {
            if (key === void 0) { key = null; }
            if (key) {
                return this.options[key];
            }
            return this.options;
        };
        OptionService.prototype.set = function (dataOrKey, value) {
            if (value === void 0) { value = null; }
            if (dataOrKey instanceof Object) {
                var data = dataOrKey;
                for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                    var key = _a[_i];
                    this.options[key] = data[key];
                }
            }
            else {
                var key = dataOrKey;
                this.options[key] = value;
            }
            return this.options;
        };
        return OptionService;
    }());

    var RequestService = /** @class */ (function () {
        function RequestService() {
        }
        RequestService.prototype.query = function (e) {
            if (!e) {
                throw new Error('No Http event.');
            }
            return (e.parameter || {});
        };
        RequestService.prototype.body = function (e) {
            if (!e) {
                throw new Error('No Http event.');
            }
            var body = JSON.parse(e.postData ? e.postData.contents : '{}');
            return body;
        };
        return RequestService;
    }());

    var __assign$2 = (undefined && undefined.__assign) || function () {
        __assign$2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };
    var ResponseService = /** @class */ (function () {
        function ResponseService(optionService) {
            this.allowedExtensions = [
                'gs', 'hbs', 'ejs',
            ];
            this.optionService = optionService;
        }
        ResponseService.prototype.send = function (content) {
            if (content instanceof Object)
                return this.json(content);
            return this.html(content);
        };
        ResponseService.prototype.html = function (html) {
            return HtmlService.createHtmlOutput(html);
        };
        ResponseService.prototype.render = function (template, data, viewEngine) {
            if (data === void 0) { data = {}; }
            if (viewEngine === void 0) { viewEngine = null; }
            viewEngine = (viewEngine || 'gs');
            if (typeof template === 'string') {
                var fileName = template;
                var views = this.optionService.get('views');
                var fileExt = template.split('.').pop();
                fileExt = (this.allowedExtensions.indexOf(fileExt) > -1) ? fileExt : null;
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
                    // NOTE: somehow this doesn't work
                    outputHtml = template.evaluate().getContent();
                }
                catch (error) {
                    outputHtml = templateText;
                }
            }
            else if (viewEngine === 'handlebars' || viewEngine === 'hbs') {
                var compiler = Handlebars.compile(templateText);
                outputHtml = compiler(data);
            }
            else if (viewEngine === 'ejs') {
                outputHtml = ejs.render(templateText, data);
            }
            else {
                outputHtml = templateText;
            }
            return this.html(outputHtml);
        };
        ResponseService.prototype.json = function (object) {
            var JSONString = JSON.stringify(object);
            var JSONOutput = ContentService.createTextOutput(JSONString);
            JSONOutput.setMimeType(ContentService.MimeType.JSON);
            return JSONOutput;
        };
        ResponseService.prototype.success = function (data, meta) {
            if (meta === void 0) { meta = {}; }
            if (!(data instanceof Object)) {
                data = { value: data };
            }
            else {
                data = {
                    success: true,
                    status: 200,
                    data: data,
                    meta: __assign$2({ at: (new Date()).getTime() }, meta)
                };
            }
            return this.json(data);
        };
        ResponseService.prototype.error = function (code, message, httpCode, meta) {
            if (code === void 0) { code = 'app/unknown'; }
            if (message === void 0) { message = 'Something wrong!'; }
            if (httpCode === void 0) { httpCode = 500; }
            if (meta === void 0) { meta = {}; }
            var error = {
                error: true,
                status: httpCode,
                code: code,
                message: message,
                meta: __assign$2({ at: (new Date()).getTime() }, meta)
            };
            return this.json(error);
        };
        return ResponseService;
    }());

    var RouterService = /** @class */ (function () {
        function RouterService() {
            this.routes = {};
            this.sharedMiddlewares = [];
            this.routeMiddlewares = {};
        }
        RouterService.prototype.use = function () {
            var handlers = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                handlers[_i] = arguments[_i];
            }
            if (!!handlers[0] && handlers[0] instanceof Function) {
                this.sharedMiddlewares = this.sharedMiddlewares.concat(handlers);
            }
            else {
                var routeName = handlers.shift();
                this.register('ALL', routeName, handlers);
            }
        };
        RouterService.prototype.all = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this.register.apply(this, ['ALL', routeName].concat(handlers));
        };
        RouterService.prototype.get = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this.register.apply(this, ['GET', routeName].concat(handlers));
        };
        RouterService.prototype.post = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this.register.apply(this, ['POST', routeName].concat(handlers));
        };
        RouterService.prototype.put = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this.register.apply(this, ['PUT', routeName].concat(handlers));
        };
        RouterService.prototype.patch = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this.register.apply(this, ['PATCH', routeName].concat(handlers));
        };
        RouterService.prototype["delete"] = function (routeName) {
            var handlers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                handlers[_i - 1] = arguments[_i];
            }
            this.register.apply(this, ['DELETE', routeName].concat(handlers));
        };
        RouterService.prototype.route = function (method, routeName) {
            var notFoundHandler = function (req, res) {
                try {
                    return res.render('errors/404');
                }
                catch (error) {
                    return res.html("\n\t\t\t\t\t<h1>404!</h1>\n\t\t\t\t\t<p>Not found.</p>\n\t\t\t\t");
                }
            };
            var handler = this.routes[method + ':' + routeName] || notFoundHandler;
            var handlers = this.routeMiddlewares[method + ':' + routeName] || [];
            // shared middlewares
            handlers = this.sharedMiddlewares.concat(handlers);
            // main handler
            handlers.push(handler);
            return handlers;
        };
        RouterService.prototype.register = function (method, routeName) {
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
                this.routes['GET:' + routeName] = handler;
                this.routeMiddlewares['GET:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'POST') {
                this.routes['POST:' + routeName] = handler;
                this.routeMiddlewares['POST:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'PUT') {
                this.routes['PUT:' + routeName] = handler;
                this.routeMiddlewares['PUT:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'PATCH') {
                this.routes['PATCH:' + routeName] = handler;
                this.routeMiddlewares['PATCH:' + routeName] = handlers;
            }
            if (method === 'ALL' || method === 'DELETE') {
                this.routes['DELETE:' + routeName] = handler;
                this.routeMiddlewares['DELETE:' + routeName] = handlers;
            }
        };
        return RouterService;
    }());

    function o2a(object, keyName) {
        if (keyName === void 0) { keyName = '$key'; }
        var array = [];
        for (var _i = 0, _a = Object.keys(object || {}); _i < _a.length; _i++) {
            var key = _a[_i];
            if (object[key] instanceof Object) {
                object[key][keyName] = key;
            }
            else {
                var value = object[key];
                object[key] = {};
                object[key][keyName] = key;
                object[key]['value'] = value;
            }
            array.push(object[key]);
        }
        return array;
    }
    function a2o(array, keyName) {
        if (keyName === void 0) { keyName = 'key'; }
        var object = {};
        for (var i = 0; i < (array || []).length; i++) {
            var item = array[i];
            object[item[keyName] ||
                item['slug'] ||
                (item['id'] ? '' + item['id'] : null) ||
                (item['#'] ? '' + item['#'] : null) ||
                ('' + Math.random() * 1E20)] = item;
        }
        return object;
    }
    function uniqueId(length, startWith) {
        if (length === void 0) { length = 12; }
        if (startWith === void 0) { startWith = '-'; }
        var maxLoop = length - 8;
        var ASCII_CHARS = startWith + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
        var lastPushTime = 0;
        var lastRandChars = [];
        var now = new Date().getTime();
        var duplicateTime = (now === lastPushTime);
        lastPushTime = now;
        var timeStampChars = new Array(8);
        var i;
        for (i = 7; i >= 0; i--) {
            timeStampChars[i] = ASCII_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        var uid = timeStampChars.join('');
        if (!duplicateTime) {
            for (i = 0; i < maxLoop; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        }
        else {
            for (i = maxLoop - 1; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < maxLoop; i++) {
            uid += ASCII_CHARS.charAt(lastRandChars[i]);
        }
        return uid;
    }
    function honorData(data) {
        if (data === void 0) { data = {}; }
        for (var key in data) {
            if (data[key] === '' || data[key] === null || data[key] === undefined) {
                // delete null key
                delete data[key];
            }
            else if ((data[key] + '').toLowerCase() === 'true') {
                // boolean TRUE
                data[key] = true;
            }
            else if ((data[key] + '').toLowerCase() === 'false') {
                // boolean FALSE
                data[key] = false;
            }
            else if (!isNaN(data[key])) {
                // number
                if (Number(data[key]) % 1 === 0) {
                    // tslint:disable-next-line:ban
                    data[key] = parseInt(data[key], 2);
                }
                if (Number(data[key]) % 1 !== 0) {
                    // tslint:disable-next-line:ban
                    data[key] = parseFloat(data[key]);
                }
            }
            else {
                // JSON
                try {
                    data[key] = JSON.parse(data[key]);
                }
                catch (e) {
                    // continue
                }
            }
        }
        return data;
    }

    function sheetbase(options) {
        var Option = new OptionService(options);
        var Router = new RouterService();
        var Request = new RequestService();
        var Response = new ResponseService(Option);
        var HTTP = new HttpService(Option, Response, Router);
        return {
            Option: Option,
            Router: Router,
            Request: Request,
            Response: Response,
            HTTP: HTTP
        };
    }

    exports.HttpService = HttpService;
    exports.OptionService = OptionService;
    exports.RequestService = RequestService;
    exports.ResponseService = ResponseService;
    exports.RouterService = RouterService;
    exports.o2a = o2a;
    exports.a2o = a2o;
    exports.uniqueId = uniqueId;
    exports.honorData = honorData;
    exports.sheetbase = sheetbase;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sheetbase-core-server.umd.js.map
