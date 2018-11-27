/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    sheetbase,

    o2a,
    a2o,
    uniqueId,
    honorData,

    HttpService,
    OptionService,
    RequestService,
    ResponseService,
    RouterService,
} from '../src/public_api';

/**
 * create instances for testing
 */
let Option = new OptionService();
const Request = new RequestService();
let Response = new ResponseService(Option);
let Router = new RouterService();
const HTTP = new HttpService(Option, Response, Router);

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

describe('HttpService test', () => {

    it('#get should work');
    it('#post should work');

});

describe('OptionService test', () => {
    afterEach(() => {
        // reset options
        Option = new OptionService();
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

    it('#use should work');

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