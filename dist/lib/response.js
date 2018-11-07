var __assign = (this && this.__assign) || function () {
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
import { compile } from 'handlebars';
import { render } from 'ejs';
var ResponseService = /** @class */ (function () {
    function ResponseService(option) {
        this.allowedExtensions = [
            'gs', 'hbs', 'ejs',
        ];
        this.option = option;
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
        viewEngine = (viewEngine || this.option.get('view engine') || 'gs');
        if (typeof template === 'string') {
            var fileName = template;
            var views = this.option.get('views');
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
            var render_1 = compile(templateText);
            outputHtml = render_1(data);
        }
        else if (viewEngine === 'ejs') {
            outputHtml = render(templateText, data);
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
                meta: __assign({ at: (new Date()).getTime() }, meta)
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
            meta: __assign({ at: (new Date()).getTime() }, meta)
        };
        return this.json(error);
    };
    return ResponseService;
}());
export { ResponseService };
