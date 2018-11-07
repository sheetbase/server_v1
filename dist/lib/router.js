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
export { RouterService };
