/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    sheetbase,

    o2a,
    a2o,
    uniqueId,
    honorData,

    Options,
} from '../src/public_api';

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

const { Response } = sheetbase();
const res = Response;
    res.send = (content): any => content;
    res.html = (html): any => html;
    res.json = (json): any => json;
    res.render = (file): any => file;

const next = () => true;

/**
 * Test starts
 */

describe('Test module members', () => {
    const Sheetbase = sheetbase();

    it('.HTTP should exist', () => {
        expect(!!Sheetbase.HTTP).to.equal(true);
    });
    it('.Option should exist', () => {
        expect(!!Sheetbase.Option).to.equal(true);
    });
    it('.Request should exist', () => {
        expect(!!Sheetbase.Request).to.equal(true);
    });
    it('.Response should exist', () => {
        expect(!!Sheetbase.Response).to.equal(true);
    });
    it('.Router should exist', () => {
        expect(!!Sheetbase.Router).to.equal(true);
    });
});

describe('HTTP test', () => {
    let Sheetbase = sheetbase();

    beforeEach(() => {
        Sheetbase = sheetbase();
    });

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
    let Sheetbase = sheetbase();

    beforeEach(() => {
        Sheetbase = sheetbase();
    });

    it('#get should work (default values)', () => {
        const result: Options = Sheetbase.Option.get();

        expect(result.allowMethodsWhenDoGet).to.equal(false);
        expect(result.views).to.equal('');
        expect(result.disabledRoutes).to.eql([]);
        expect(result.routingErrors).to.eql({});
    });

    it('#get should work', () => {
        Sheetbase = sheetbase({
            allowMethodsWhenDoGet: true,
            views: 'public',
        });
        const result: Options = Sheetbase.Option.get();

        expect(result.allowMethodsWhenDoGet).to.equal(true);
        expect(result.views).to.equal('public');
    });

    it('#set should work', () => {
        const result1 = Sheetbase.Option.set('views', 'abc');
        expect(result1.views).to.equal('abc');
        expect(Sheetbase.Option.get('views')).to.equal('abc');

        const result2 = Sheetbase.Option.set({ views: 'xxx' });
        expect(result2.views).to.equal('xxx');
        expect(Sheetbase.Option.get()).to.have.property('views').equal('xxx');
    });

    it('#get/set allowMethodsWhenDoGet should work', () => {
        Sheetbase.Option.setAllowMethodsWhenDoGet(true);
        expect(Sheetbase.Option.getAllowMethodsWhenDoGet()).to.equal(true);
    });

    it('#get/set views should work', () => {
        Sheetbase.Option.setViews('my_views');
        expect(Sheetbase.Option.getViews()).to.equal('my_views');
    });

    it('#get/set disabledRoutes should work', () => {
        Sheetbase.Option.setDisabledRoutes(['get:/']);
        expect(Sheetbase.Option.getDisabledRoutes()).to.eql(['get:/']);
    });

    it('#get/set routingErrors should work', () => {
        const errors = {
            error1: 'Error 1',
            error2: { status: 400, message: 'Error 2' },
        };
        Sheetbase.Option.setRoutingErrors(errors);
        expect(Sheetbase.Option.getRoutingErrors()).to.eql(errors);
    });

});

describe('RequestService test', () => {
    let Sheetbase = sheetbase();

    beforeEach(() => {
        Sheetbase = sheetbase();
    });

    it('#query should work (blank)', () => {
        const result1 = Sheetbase.Request.query();
        const result2 = Sheetbase.Request.query({});
        expect(result1).to.eql({});
        expect(result2).to.eql({});
    });

    it('#params should work (blank)', () => {
        const result1 = Sheetbase.Request.params();
        const result2 = Sheetbase.Request.params({});
        expect(result1).to.eql({});
        expect(result2).to.eql({});
    });

    it('#body should work (blank)', () => {
        const result1 = Sheetbase.Request.body();
        const result2 = Sheetbase.Request.body({});
        expect(result1).to.eql({});
        expect(result2).to.eql({});
    });

    it('#query should work', () => {
        const result = Sheetbase.Request.query({
            parameter: {
                e: '/home',
            },
        });
        expect(result).to.eql({ e: '/home' });
    });

    it('#params should work', () => {
        const result = Sheetbase.Request.params({
            parameter: {
                e: '/home',
            },
        });
        expect(result).to.eql({ e: '/home' });
    });

    it('#body should work (no contents, malform)', () => {
        const result1 = Sheetbase.Request.body({
            postData: {},
        });
        const result2 = Sheetbase.Request.body({
            postData: {
                contents: 'a string',
            },
        });
        const result3 = Sheetbase.Request.body({
            postData: {
                contents: {a: 1, b: 2},
            },
        });
        expect(result1).to.eql({});
        expect(result2).to.eql({});
        expect(result3).to.eql({});
    });

    it('#body should work', () => {
        const result = Sheetbase.Request.body({
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
    let Sheetbase = sheetbase();

    beforeEach(() => {
        Sheetbase = sheetbase();
    });

    it('#setErrors should work', () => {
        const errors = {
            error1: 'Error 1',
            error2: { status: 400, message: 'Error 2' },
        };
        Sheetbase.Response.setErrors(errors);

        const result: Options = Sheetbase.Option.get();
        expect(result.routingErrors).to.eql(errors);
    });

    it('#html should work', () => {
        const result = Sheetbase.Response.html('a html');
        expect(result).to.equal('a html output');
    });

    it('#json should work', () => {
        const result: any = Sheetbase.Response.json({ a: 1 });
        expect(result).to.have.property('value').equal('{"a":1}');
    });

    it('#send should work', () => {
        const result1 = Sheetbase.Response.send('a html');
        const result2: any = Sheetbase.Response.send({ a: 1 });

        expect(result1).to.equal('a html output');
        expect(result2).to.have.property('value').equal('{"a":1}');
    });

    it('#render should work (from string, different)', () => {
        const tmpl = createFakedTemplateFromText('a template text');
        const result1 = Sheetbase.Response.render(tmpl); // no engine, keep as is
        const result2 = Sheetbase.Response.render(tmpl, {}, 'gs'); // default engine
        const result3 = Sheetbase.Response.render(tmpl, {}, 'ejs'); // ejs
        const result4 = Sheetbase.Response.render(tmpl, {}, 'hbs'); // handlebars

        expect(result1).to.equal('a template text output');
        expect(result2).to.equal('a template text as html rendered by GS output');
        expect(result3).to.equal('a template text as html rendered by ejs output');
        expect(result4).to.equal('a template text as html rendered by handlebars output');
    });

    it('#render should work (from file)', () => {
        const result1 = Sheetbase.Response.render('index');
        const result2 = Sheetbase.Response.render('index.gs');
        const result3 = Sheetbase.Response.render('index.ejs');
        const result4 = Sheetbase.Response.render('index.hbs');
        const result5 = Sheetbase.Response.render('index.html', {}, 'hbs'); // override file ext

        expect(result1).to.equal('File \'index\' content output');
        expect(result2).to.equal('File \'index.gs\' content as html rendered by GS output');
        expect(result3).to.equal('File \'index.ejs\' content as html rendered by ejs output');
        expect(result4).to.equal('File \'index.hbs\' content as html rendered by handlebars output');
        expect(result5).to.equal('File \'index.html\' content as html rendered by handlebars output');
    });

    it('#success should show error (no data)', () => {
        const result: any = Sheetbase.Response.success(null);
        const parsedResult = JSON.parse(result.value);

        expect(parsedResult).to.have.property('error').equal(true);
    });
    it('#success should work', () => {
        const result1: any = Sheetbase.Response.success(1); // a scalar value
        const result2: any = Sheetbase.Response.success({ a: 1 });
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
        const result1: any = Sheetbase.Response.success('data', 'a meta');
        const result2: any = Sheetbase.Response.success('data', { a: 1 });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1.meta).to.have.property('value').equal('a meta');
        expect(parsedResult2.meta).to.have.property('a').equal(1);
    });

    it('#error should work', () => {
        const result1: any = Sheetbase.Response.error();
        const result2: any = Sheetbase.Response.error({
            status: 400,
            code: 'error/an-error',
            message: 'An error.',
        });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1).to.have.property('error').equal(true);
        expect(parsedResult1).to.have.property('status').equal(500);
        expect(parsedResult1).to.have.property('code').equal('app/internal');
        expect(parsedResult1).to.have.property('message').equal('Unknown error.');
        expect(isNaN(parsedResult1.meta.at)).to.equal(false);

        expect(parsedResult2).to.have.property('error').equal(true);
        expect(parsedResult2).to.have.property('status').equal(400);
        expect(parsedResult2).to.have.property('code').equal('error/an-error');
        expect(parsedResult2).to.have.property('message').equal('An error.');
        expect(isNaN(parsedResult2.meta.at)).to.equal(false);
    });

    it('#error should work (custom meta)', () => {
        const result1: any = Sheetbase.Response.error({ message: 'an error' }, 'a meta');
        const result2: any = Sheetbase.Response.error({ message: 'an error' }, { a: 1 });
        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);

        expect(parsedResult1.meta).to.have.property('value').equal('a meta');
        expect(parsedResult2.meta).to.have.property('a').equal(1);
    });

    it('#error should work (passing a string)', () => {
        Sheetbase.Response.setErrors({
            error1: 'Error 1',
            error2: { message: 'Error 2' },
            error3: { status: 400, message: 'Error 3' },
        });

        const result1: any = Sheetbase.Response.error(); // default
        const result2: any = Sheetbase.Response.error('xxx'); // custom
        const result3: any = Sheetbase.Response.error('error1'); // a string
        const result4: any = Sheetbase.Response.error('error2'); // no status (default to 500)
        const result5: any = Sheetbase.Response.error('error3'); // has status

        const parsedResult1 = JSON.parse(result1.value);
        const parsedResult2 = JSON.parse(result2.value);
        const parsedResult3 = JSON.parse(result3.value);
        const parsedResult4 = JSON.parse(result4.value);
        const parsedResult5 = JSON.parse(result5.value);

        expect(parsedResult1).to.have.property('error').equal(true);
        expect(parsedResult1).to.have.property('status').equal(500);
        expect(parsedResult1).to.have.property('code').equal('app/internal');
        expect(parsedResult1).to.have.property('message').equal('Unknown error.');

        expect(parsedResult2).to.have.property('error').equal(true);
        expect(parsedResult2).to.have.property('status').equal(500);
        expect(parsedResult2).to.have.property('code').equal('app/internal');
        expect(parsedResult2).to.have.property('message').equal('xxx');

        expect(parsedResult3).to.have.property('error').equal(true);
        expect(parsedResult3).to.have.property('status').equal(500);
        expect(parsedResult3).to.have.property('code').equal('error1');
        expect(parsedResult3).to.have.property('message').equal('Error 1');

        expect(parsedResult4).to.have.property('error').equal(true);
        expect(parsedResult4).to.have.property('status').equal(500);
        expect(parsedResult4).to.have.property('code').equal('error2');
        expect(parsedResult4).to.have.property('message').equal('Error 2');

        expect(parsedResult5).to.have.property('error').equal(true);
        expect(parsedResult5).to.have.property('status').equal(400);
        expect(parsedResult5).to.have.property('code').equal('error3');
        expect(parsedResult5).to.have.property('message').equal('Error 3');
    });

});

describe('RouterService test', () => {
    let Sheetbase = sheetbase();

    beforeEach(() => {
        Sheetbase = sheetbase();
    });

    it('#setErrors should work', () => {
        const errors = {
            error1: 'Error 1',
            error2: { status: 400, message: 'Error 2' },
        };
        Sheetbase.Router.setErrors(errors);

        const result: Options = Sheetbase.Option.get();
        expect(result.routingErrors).to.eql(errors);
    });

    it('#setDisabled should work', () => {
        const disabledRoutes = ['get /'];
        Sheetbase.Router.setDisabled(disabledRoutes);

        const result: Options = Sheetbase.Option.get();
        expect(result.disabledRoutes).to.eql(disabledRoutes);

        // reset
        Sheetbase.Router.setDisabled([]);
    });

    it('404 handler', () => {
        const [ route ] = Sheetbase.Router.route('GET', '/');
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
        Sheetbase.Router.get('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Sheetbase.Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#get should work (with middlewares)', () => {
        const method = 'GET';
        Sheetbase.Router.get('/',
            (req, res, next) => next(), // middleware 1
            (req, res, next) => next(), // middleware 2
            (req, res) => res.send(method + ' / result'),
        );
        const [ middleware1, middleware2, route ] = Sheetbase.Router.route(method, '/');
        const middleware1Result = middleware1(req, res, next as any);
        const middleware2Result = middleware2(req, res, () => 'next >' as any);
        const routeResult = route(req, res);

        expect(middleware1Result).to.equal(true);
        expect(middleware2Result).to.equal('next >');
        expect(routeResult).to.equal(method + ' / result');
    });

    it('#post should work', () => {
        const method = 'POST';
        Sheetbase.Router.post('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Sheetbase.Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#put should work', () => {
        const method = 'PUT';
        Sheetbase.Router.put('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Sheetbase.Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#patch should work', () => {
        const method = 'PATCH';
        Sheetbase.Router.patch('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Sheetbase.Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#delete should work', () => {
        const method = 'DELETE';
        Sheetbase.Router.delete('/', (req, res) => res.send(method + ' / result'));
        const [ route ] = Sheetbase.Router.route(method, '/'); // get the route
        const result = route(req, res);

        expect(route instanceof Function).to.equal(true);
        expect(result).to.equal(method + ' / result');
    });

    it('#all should work', () => {
        Sheetbase.Router.all('/', (req, res) => res.send('a result'));
        const [ routeGET ] = Sheetbase.Router.route('GET', '/');
        const [ routePOST ] = Sheetbase.Router.route('POST', '/');
        const [ routePUT ] = Sheetbase.Router.route('PUT', '/');
        const [ routePATCH ] = Sheetbase.Router.route('PATCH', '/');
        const [ routeDELETE ] = Sheetbase.Router.route('DELETE', '/');

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
        Sheetbase.Router.use(hdlr);
        const result1 = Sheetbase.Router.route('GET', '/');
        const middlewareResult1 = result1[0](req, res, next as any); // the first middleware

        expect(result1.length).to.equal(2);
        expect(middlewareResult1).to.equal('next >');

        // use 3 more middlewares
        Sheetbase.Router.use(hdlr, hdlr, hdlr);
        const result2 = Sheetbase.Router.route('GET', '/');
        const middlewareResult2 = result2[3](req, res, next as any); // the last middleware

        expect(result2.length).to.equal(5);
        expect(middlewareResult2).to.equal('next >');
    });

    it('#use should work (for a specific route)', () => {
        // only for /me
        Sheetbase.Router.use('/me', (req, res, next) => next());
        const result1 = Sheetbase.Router.route('GET', '/me');
        const middlewareResult1 = result1[0](req, res, next as any);
        const result2 = Sheetbase.Router.route('GET', '/');

        expect(result1.length).to.equal(2);
        expect(middlewareResult1).to.equal(true);
        expect(result2.length).to.equal(1); // not for this route
    });

    it('disabled routes should work', () => {
        Sheetbase.Router.setDisabled(['get /']);
        Sheetbase.Router.get('/', (req, res) => res.send('a result'));
        const [ route ] = Sheetbase.Router.route('GET', '/');
        const result1 = route(req, res);
        expect(result1).to.equal('errors/404');
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
