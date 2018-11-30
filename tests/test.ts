/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    sheetbase,

    o2a,
    a2o,
    uniqueId,
    honorData,
    routingErrorBuilder,
    routingError,
    addonRoutesExposedChecker,
    addonRoutesExposed,

    OptionService,
    RequestService,
    ResponseService,
    RouterService,

    RoutingErrors,
} from '../src/public_api';

/**
 * create instances for testing
 */
let Option = new OptionService();
const Request = new RequestService();
let Response = new ResponseService(Option);
let Router = new RouterService();

const Sheetbase = sheetbase();

/*
 * mock global objects
 */
const g: any = global;

// GAS
g.HtmlService = {
    createHtmlOutput: (html: string) => html + ' output',
    createTemplateFromFile: (tmplPath: string) => {
        return {
            getRawContent: () => `File '${tmplPath}' content`,
            evaluate: () => ({
                getContent: () => `File '${tmplPath}' content as html rendered by GS`,
            }),
        };
    },
};
g.ContentService = {
    MimeType: {
        JSON: 'JSON',
    },
    createTextOutput: (value) => {
        return {
            value,
            setMimeType: (mimeType) => mimeType,
        };
    },
};

// view engines
g.ejs = {
    render: (tmpl, data) => `${tmpl} as html rendered by ejs`,
};
g.Handlebars = {
    compile: (tmpl) => {
        return (data) => `${tmpl} as html rendered by handlebars`;
    },
};

/**
 * helpers
 */
function createFakedTemplateFromText(tmpl: string) {
    return {
        getRawContent: () => tmpl,
        evaluate: () => {
            return {
                getContent: () => `${tmpl} as html rendered by GS`,
            };
        },
    };
}

// faked router objects
const req = {};
const res = Response;
const next = () => true;

/**
 * Test starts
 */

describe('Test module members', () => {
    it('.HTTP should exist', () => {
        expect(Sheetbase.HTTP).to.not.null;
    });
    it('.Option should exist', () => {
        expect(Sheetbase.Option).to.not.null;
    });
    it('.Request should exist', () => {
        expect(Sheetbase.Request).to.not.null;
    });
    it('.Response should exist', () => {
        expect(Sheetbase.Response).to.not.null;
    });
    it('.Router should exist', () => {
        expect(Sheetbase.Router).to.not.null;
    });
});

describe('HTTP test', () => {
    it('#get should work', () => {
        Sheetbase.Router.get('/', (req, res, next) => res.send('GET / response'));
        Sheetbase.Router.get('/me', (req, res, next) => res.send('GET /me response'));
        const result1 = Sheetbase.HTTP.get({});
        const result2 = Sheetbase.HTTP.get({
            parameter: { e: '/me' },
        });
        expect(result1).to.equal('GET / response output');
        expect(result2).to.equal('GET /me response output');
    });

    it('#post should work', () => {
        Sheetbase.Router.post('/', (req, res, next) => res.send('POST / response'));
        Sheetbase.Router.post('/me', (req, res, next) => res.send('POST /me response'));
        const result1 = Sheetbase.HTTP.post({});
        const result2 = Sheetbase.HTTP.post({
            parameter: { e: '/me' },
        });
        expect(result1).to.equal('POST / response output');
        expect(result2).to.equal('POST /me response output');
    });

    it('#get should work (NOT allows custom methods)', () => {
        Sheetbase.Router.get('/', (req, res, next) => res.send('GET / response'));
        Sheetbase.Router.post('/', (req, res, next) => res.send('POST / response'));
        const resultGET = Sheetbase.HTTP.get({});
        const resultPOST = Sheetbase.HTTP.get({
            parameter: { method: 'POST' },
        });
        expect(resultGET).to.equal('GET / response output');
        expect(resultPOST).to.equal('GET / response output');
    });

    it('#get should work (custom methods)', () => {
        Sheetbase.Option.set({ allowMethodsWhenDoGet: true });

        Sheetbase.Router.get('/', (req, res, next) => res.send('GET / response'));
        Sheetbase.Router.post('/', (req, res, next) => res.send('POST / response'));
        Sheetbase.Router.put('/', (req, res, next) => res.send('PUT / response'));
        Sheetbase.Router.patch('/', (req, res, next) => res.send('PATCH / response'));
        Sheetbase.Router.delete('/', (req, res, next) => res.send('DELETE / response'));
        const resultGET = Sheetbase.HTTP.get({});
        const resultPOST = Sheetbase.HTTP.get({
            parameter: { method: 'POST' },
        });
        const resultPUT = Sheetbase.HTTP.get({
            parameter: { method: 'PUT' },
        });
        const resultPATCH = Sheetbase.HTTP.get({
            parameter: { method: 'PATCH' },
        });
        const resultDELETE = Sheetbase.HTTP.get({
            parameter: { method: 'DELETE' },
        });
        expect(resultGET).to.equal('GET / response output');
        expect(resultPOST).to.equal('POST / response output');
        expect(resultPUT).to.equal('PUT / response output');
        expect(resultPATCH).to.equal('PATCH / response output');
        expect(resultDELETE).to.equal('DELETE / response output');
    });
});

describe('OptionService test', () => {
    afterEach(() => {
        Option = new OptionService(); // reset options
    });

    it('#get should work (default values)', () => {
        const Option = new OptionService();

        const allowMethods = Option.get('allowMethodsWhenDoGet');
        const views = Option.get('views');

        expect(allowMethods).to.equal(false);
        expect(views).to.equal('');
    });

    it('#get should work', () => {
        const Option = new OptionService({
            allowMethodsWhenDoGet: true,
            views: 'public',
        });

        const allowMethods = Option.get('allowMethodsWhenDoGet');
        const views = Option.get('views');

        expect(allowMethods).to.equal(true);
        expect(views).to.equal('public');
    });

    it('#set should work', () => {
        const result1 = Option.set('views', 'abc');
        expect(result1.views).to.equal('abc');
        expect(Option.get('views')).to.equal('abc');

        const result2 = Option.set({ views: 'xxx' });
        expect(result2.views).to.equal('xxx');
        expect(Option.get()).to.have.property('views').equal('xxx');
    });

});

describe('RequestService test', () => {
    it('#query should work (blank)', () => {
        const result1 = Request.query();
        const result2 = Request.query({});
        expect(result1).to.eql({});
        expect(result2).to.eql({});
    });

    it('#params should work (blank)', () => {
        const result1 = Request.params();
        const result2 = Request.params({});
        expect(result1).to.eql({});
        expect(result2).to.eql({});
    });

    it('#body should work (blank)', () => {
        const result1 = Request.body();
        const result2 = Request.body({});
        expect(result1).to.eql({});
        expect(result2).to.eql({});
    });

    it('#query should work', () => {
        const result = Request.query({
            parameter: {
                e: '/home',
            },
        });
        expect(result).to.eql({ e: '/home' });
    });

    it('#params should work', () => {
        const result = Request.params({
            parameter: {
                e: '/home',
            },
        });
        expect(result).to.eql({ e: '/home' });
    });

    it('#body should work (no contents, malform)', () => {
        const result1 = Request.body({
            postData: {},
        });
        const result2 = Request.body({
            postData: {
                contents: 'a string',
            },
        });
        const result3 = Request.body({
            postData: {
                contents: {a: 1, b: 2},
            },
        });
        expect(result1).to.eql({});
        expect(result2).to.eql({});
        expect(result3).to.eql({});
    });

    it('#body should work', () => {
        const result = Request.body({
            postData: {
                contents: '{"a":1,"b":2}',
            },
        });
        expect(result).to.eql({
            a: 1, b: 2,
        });
    });

});

describe('ResponseService test', () => {

    it('#html should work', () => {
        const result = Response.html('a html');
        expect(result).to.equal('a html output');
    });

    it('#json should work', () => {
        const result: any = Response.json({ a: 1 });
        expect(result).to.have.property('value').equal('{"a":1}');
    });

    it('#send should work', () => {
        const result1 = Response.send('a html');
        const result2: any = Response.send({ a: 1 });

        expect(result1).to.equal('a html output');
        expect(result2).to.have.property('value').equal('{"a":1}');
    });

    it('#render should work (from string, different)', () => {
        const tmpl = createFakedTemplateFromText('a template text');
        const result1 = Response.render(tmpl); // no engine, keep as is
        const result2 = Response.render(tmpl, {}, 'gs'); // default engine
        const result3 = Response.render(tmpl, {}, 'ejs'); // ejs
        const result4 = Response.render(tmpl, {}, 'hbs'); // handlebars

        expect(result1).to.equal('a template text output');
        expect(result2).to.equal('a template text as html rendered by GS output');
        expect(result3).to.equal('a template text as html rendered by ejs output');
        expect(result4).to.equal('a template text as html rendered by handlebars output');
    });

    it('#render should work (from file)', () => {
        const result1 = Response.render('index');
        const result2 = Response.render('index.gs');
        const result3 = Response.render('index.ejs');
        const result4 = Response.render('index.hbs');
        const result5 = Response.render('index.html', {}, 'hbs'); // override file ext

        expect(result1).to.equal('File \'index\' content output');
        expect(result2).to.equal('File \'index.gs\' content as html rendered by GS output');
        expect(result3).to.equal('File \'index.ejs\' content as html rendered by ejs output');
        expect(result4).to.equal('File \'index.hbs\' content as html rendered by handlebars output');
        expect(result5).to.equal('File \'index.html\' content as html rendered by handlebars output');
    });

    it('#error should show error (no data)', () => {
        const result: any = Response.success(null);
        const parsedResult = JSON.parse(result.value);

        expect(parsedResult).to.have.property('error').equal(true);
    });
    it('#success should work', () => {
        const result1: any = Response.success(1); // a scalar value
        const result2: any = Response.success({ a: 1 });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1).to.have.property('success').equal(true);
        expect(parsedResult1).to.have.property('status').equal(200);
        expect(parsedResult1).to.have.property('data').eql({ value: 1 });
        expect(isNaN(parsedResult1.meta.at)).to.equal(false);

        expect(parsedResult2).to.have.property('success').equal(true);
        expect(parsedResult2).to.have.property('status').equal(200);
        expect(parsedResult2).to.have.property('data').eql({ a: 1 });
        expect(isNaN(parsedResult2.meta.at)).to.equal(false);
    });
    it('#success should work (custom meta)', () => {
        const result1: any = Response.success('data', 'a meta');
        const result2: any = Response.success('data', { a: 1 });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1.meta).to.have.property('value').equal('a meta');
        expect(parsedResult2.meta).to.have.property('a').equal(1);
    });

    it('#error should work', () => {
        const result1: any = Response.error();
        const result2: any = Response.error({ status: 400, code: 'error/an-error', message: 'An error.' });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1).to.have.property('error').equal(true);
        expect(parsedResult1).to.have.property('status').equal(500);
        expect(parsedResult1).to.have.property('code').equal('unknown');
        expect(parsedResult1).to.have.property('message').equal('Unknown error.');
        expect(isNaN(parsedResult1.meta.at)).to.equal(false);

        expect(parsedResult2).to.have.property('error').equal(true);
        expect(parsedResult2).to.have.property('status').equal(400);
        expect(parsedResult2).to.have.property('code').equal('error/an-error');
        expect(parsedResult2).to.have.property('message').equal('An error.');
        expect(isNaN(parsedResult2.meta.at)).to.equal(false);
    });

    it('#error should work (custom meta)', () => {
        const result1: any = Response.error({ message: 'an error' }, 'a meta');
        const result2: any = Response.error({ message: 'an error' }, { a: 1 });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1.meta).to.have.property('value').equal('a meta');
        expect(parsedResult2.meta).to.have.property('a').equal(1);
    });
});

describe('RouterService test', () => {

    before(() => {
        res.send = (content): any => content;
        res.html = (html): any => html;
        res.json = (json): any => json;
        res.render = (file): any => file;
    });

    afterEach(() => {
        // reset router & response
        Router = new RouterService();
        Response = new ResponseService(Option);
    });

    it('404 handler', () => {
        const [ route ] = Router.route('GET', '/');
        expect(route instanceof Function).to.equal(true);

        // use 404 html text (no 404.html or can not be rendered)
        res.render = (): any => { throw null; }; // throw an error
        const result1 = route(req, res);
        expect(result1).to.contain('<h1>404!</h1>');

        // render errors/404.html
        res.render = (file): any => file; // restore
        const result2 = route(req, res);
        expect(result2).to.equal('errors/404');
    });

    it('#get should work', () => {
        const method = 'GET';

        Router.get('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#get should work (with middlewares)', () => {
        const method = 'GET';

        Router.get('/',
            (req, res, next) => next(), // middleware 1
            (req, res, next) => next(), // middleware 2
            (req, res) => res.send(method + ' / result'),
        );
        const [ middleware1, middleware2, route ] = Router.route(method, '/');
        const middleware1Result = middleware1(req, res, next as any);
        const middleware2Result = middleware2(req, res, () => 'next >' as any);
        const routeResult = route(req, res);

        expect(middleware1Result).to.equal(true);
        expect(middleware2Result).to.equal('next >');
        expect(routeResult).to.equal(method + ' / result');
    });

    it('#post should work', () => {
        const method = 'POST';

        Router.post('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });
    it('#put should work', () => {
        const method = 'PUT';

        Router.put('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });
    it('#patch should work', () => {
        const method = 'PATCH';

        Router.patch('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });
    it('#delete should work', () => {
        const method = 'DELETE';

        Router.delete('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#all should work', () => {
        Router.all('/', (req, res) => res.send('a result'));
        const [ routeGET ] = Router.route('GET', '/');
        const [ routePOST ] = Router.route('POST', '/');
        const [ routePUT ] = Router.route('PUT', '/');
        const [ routePATCH ] = Router.route('PATCH', '/');
        const [ routeDELETE ] = Router.route('DELETE', '/');

        expect(routeGET instanceof Function).to.equal(true);
        expect(routePOST instanceof Function).to.equal(true);
        expect(routePUT instanceof Function).to.equal(true);
        expect(routePATCH instanceof Function).to.equal(true);
        expect(routeDELETE instanceof Function).to.equal(true);
    });

    it('#use should work', () => {
        const hdlr = (req, res, next) => next(); // always pass middleware
        const next = () => 'next >'; // return a text when next() is call

        // use one middleware
        Router.use(hdlr);
        const result1 = Router.route('GET', '/');
        const middlewareResult1 = result1[0](req, res, next as any); // the first middleware

        expect(result1.length).to.equal(2);
        expect(middlewareResult1).to.equal('next >');

        // use 3 more middlewares
        Router.use(hdlr, hdlr, hdlr);
        const result2 = Router.route('GET', '/');
        const middlewareResult2 = result2[3](req, res, next as any); // the last middleware

        expect(result2.length).to.equal(5);
        expect(middlewareResult2).to.equal('next >');
    });

    it('#use should work (for a specific route)', () => {
        // only for /me
        Router.use('/me', (req, res, next) => next());
        const result1 = Router.route('GET', '/me');
        const middlewareResult1 = result1[0](req, res, next as any);
        const result2 = Router.route('GET', '/');

        expect(result1.length).to.equal(2);
        expect(middlewareResult1).to.equal(true);
        expect(result2.length).to.equal(1); // not for this route
    });

});

describe('UtilsService test', () => {

    it('#o2a should work', () => {
        const result = o2a({ a: 1, b: 2, c: { c1: 1, c2: 2 } });
        expect(result).to.eql([
            { $key: 'a', value: 1 },
            { $key: 'b', value: 2 },
            { $key: 'c', c1: 1, c2: 2 },
        ]);
    });

    it('#o2a should work (custom key name)', () => {
        const result = o2a({ a: 1 }, 'xxx');
        expect(result).to.eql([{ xxx: 'a', value: 1 }]);
    });

    it('#a2o should work', () => {
        const result = a2o([
            {slug: 'a', a: true},
            {id: 'b', b: true},
            {key: 'c', c: true},
            {'#': 'd', d: true},
            {xxx: 'e', key: 'e1', e: true},
        ], 'xxx');
        expect(result).eql({
            a: {slug: 'a', a: true},
            b: {id: 'b', b: true},
            c: {key: 'c', c: true},
            d: {'#': 'd', d: true},
            e: {xxx: 'e', key: 'e1', e: true},
        });
    });

    it('#uniqueId should works', () => {
        const id = uniqueId();
        expect(id.substr(0, 1)).to.equal('-');
        expect(id.length).to.equal(12);
    });

    it('#uniqueId should create id (32 chars)', () => {
        const id = uniqueId(32);
        expect(id.length).to.equal(32);
    });

    it('#uniqueId should create id (12 chars, start with 1)', () => {
        const id = uniqueId(null, '1');
        expect(id.substr(0, 1)).to.equal('1');
    });

    it('#honorData should work', () => {
        const result = honorData({
            a: 1,
            b: '',
            c: null,
            d: undefined,
            e: 'true',
            e1: 'TRUE',
            f: 'false',
            f1: 'FALSE',
            g: '2',
            h: '3.14',
            i: '{"a":1,"b":2}',
            i2: '[{"a":1,"b":2}]',
            j: 'me',
            j1: true,
            j2: false,
            j3: 4,
            j4: 5.9,
            j5: {c:3},
            j6: [{c:3, d:4}],
        });
        expect(result).to.eql({
            a: 1,
            e: true,
            e1: true,
            f: false,
            f1: false,
            g: 2,
            h: 3.14,
            i: {a:1,b:2},
            i2: [{a:1,b:2}],
            j: 'me',
            j1: true,
            j2: false,
            j3: 4,
            j4: 5.9,
            j5: {c:3},
            j6: [{c:3, d:4}],
        });
    });

});

describe('Routing helpers', () => {
    const ROUTING_ERRORS: RoutingErrors = {
        error1: { message: 'Error 1' },
        error2: { status: 500, message: 'Error 2' },
    };
    const errorHandler = (err) => err;
    const disaledRoutes = [
        'get:/xxx1',
        'GET:/xxx2',
        'get:xxx3',
        'GET:xxx4',
        'get /xxx5',
        'GET /xxx6',
        'get xxx7',
        'GET xxx8',
        'get:/xxx9',
    ];

    const routingErrorFunc = routingErrorBuilder(ROUTING_ERRORS, errorHandler);
    const addonRoutesExposedFunc = addonRoutesExposedChecker(disaledRoutes);

    it('should create the instances', () => {
        expect(routingErrorFunc instanceof Function).to.equal(true);
        expect(addonRoutesExposedFunc instanceof Function).to.equal(true);
    });

    it('routingErrorFunc should show correct error', () => {
        const result1 = routingErrorFunc(); // default
        const result2 = routingErrorFunc('xxx'); // custom
        const result3 = routingErrorFunc('error1'); // no status (default to 400)
        const result4 = routingErrorFunc('error2'); // has status
        expect(result1).to.eql({ code: 'internal', status: 500, message: 'Unknown.' });
        expect(result2).to.eql({ code: 'internal', status: 500, message: 'xxx' });
        expect(result3).to.eql({ code: 'error1', status: 400, message: 'Error 1' });
        expect(result4).to.eql({ code: 'error2', status: 500, message: 'Error 2' });
    });

    it('#routingError should show correct error (direct method)', () => {
        const result1 = routingError(ROUTING_ERRORS, null, errorHandler); // default
        const result2 = routingError(ROUTING_ERRORS, 'xxx', errorHandler); // invalid
        const result3 = routingError(
            ROUTING_ERRORS, 'error1', errorHandler,
        ); // no status (default to 400)
        const result4 = routingError(ROUTING_ERRORS, 'error2', errorHandler); // has status
        expect(result1).to.eql({ code: 'internal', status: 500, message: 'Unknown.' });
        expect(result2).to.eql({ code: 'internal', status: 500, message: 'xxx' });
        expect(result3).to.eql({ code: 'error1', status: 400, message: 'Error 1' });
        expect(result4).to.eql({ code: 'error2', status: 500, message: 'Error 2' });
    });

    it('routingErrorFunc should override the error handler', () => {
        const result1 = routingErrorFunc('error1', () => 'overridden');
        expect(result1).to.equal('overridden');
    });

    it('routingErrorFunc return the error if no error handler', () => {
        const result1 = routingError(ROUTING_ERRORS, 'error1');
        expect(result1).to.eql({ code: 'error1', status: 400, message: 'Error 1' });
    });

    it('addonRoutesExposedFunc should show correct result', () => {
        const result0 = addonRoutesExposedFunc('get', '/xxx0');
        const result1 = addonRoutesExposedFunc('get', '/xxx1');
        const result2 = addonRoutesExposedFunc('get', '/xxx2');
        const result3 = addonRoutesExposedFunc('get', '/xxx3');
        const result4 = addonRoutesExposedFunc('get', '/xxx4');
        const result5 = addonRoutesExposedFunc('get', '/xxx5');
        const result6 = addonRoutesExposedFunc('get', '/xxx6');
        const result7 = addonRoutesExposedFunc('get', '/xxx7');
        const result8 = addonRoutesExposedFunc('get', '/xxx8');
        expect(result0).to.equal(true);
        expect(result1).to.equal(false);
        expect(result2).to.equal(false);
        expect(result3).to.equal(false);
        expect(result4).to.equal(false);
        expect(result5).to.equal(false);
        expect(result6).to.equal(false);
        expect(result7).to.equal(false);
        expect(result8).to.equal(false);
    });

    it('#addonRoutesExposed should show correct result (direct method)', () => {
        const result0 = addonRoutesExposed(disaledRoutes, 'get', '/xxx0');
        const result1 = addonRoutesExposed(disaledRoutes, 'get', '/xxx1');
        const result2 = addonRoutesExposed(disaledRoutes, 'get', '/xxx2');
        const result3 = addonRoutesExposed(disaledRoutes, 'get', '/xxx3');
        const result4 = addonRoutesExposed(disaledRoutes, 'get', '/xxx4');
        const result5 = addonRoutesExposed(disaledRoutes, 'get', '/xxx5');
        const result6 = addonRoutesExposed(disaledRoutes, 'get', '/xxx6');
        const result7 = addonRoutesExposed(disaledRoutes, 'get', '/xxx7');
        const result8 = addonRoutesExposed(disaledRoutes, 'get', '/xxx8');
        expect(result0).to.equal(true);
        expect(result1).to.equal(false);
        expect(result2).to.equal(false);
        expect(result3).to.equal(false);
        expect(result4).to.equal(false);
        expect(result5).to.equal(false);
        expect(result6).to.equal(false);
        expect(result7).to.equal(false);
        expect(result8).to.equal(false);
    });

});