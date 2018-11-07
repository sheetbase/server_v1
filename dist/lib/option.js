var OptionService = /** @class */ (function () {
    function OptionService() {
        this.options = {
            allowMethodsWhenDoGet: false,
            views: 'views',
            'view engine': 'gs'
        };
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
export { OptionService };
