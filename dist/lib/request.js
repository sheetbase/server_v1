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
export { RequestService };
