var HttpService = /** @class */ (function () {
    function HttpService(option, response, router) {
        this.allowedMethods = [
            'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
        ];
        this.option = option;
        this.response = response;
        this.router = router;
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
        var allowMethodsWhenDoGet = this.option.get('allowMethodsWhenDoGet');
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
        var res = this.response;
        // run handlers
        var handlers = this.router.route(method, endpoint);
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
                    req.data = Object.assign({}, req.data || {}, data || {});
                }
                return _this.run(handlers, req, res);
            };
            return handler(req, res, next);
        }
    };
    return HttpService;
}());
export { HttpService };
