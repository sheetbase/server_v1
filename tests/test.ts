/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { sheetbase } from '../src/public_api';

const Sheetbase = sheetbase();

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

describe('Test module members (proxies)', () => {
    it('#set should exist', () => {
        expect(Sheetbase.set).to.not.null;
    });
    it('#use should exist', () => {
        expect(Sheetbase.use).to.not.null;
    });
    it('#all should exist', () => {
        expect(Sheetbase.all).to.not.null;
    });
    it('#get should exist', () => {
        expect(Sheetbase.get).to.not.null;
    });
    it('#post should exist', () => {
        expect(Sheetbase.post).to.not.null;
    });
    it('#put should exist', () => {
        expect(Sheetbase.put).to.not.null;
    });
    it('#patch should exist', () => {
        expect(Sheetbase.patch).to.not.null;
    });
    it('#delete should exist', () => {
        expect(Sheetbase.delete).to.not.null;
    });
});

describe('HttpService test', () => {

    it('#get should work');
    it('#post should work');

});

describe('OptionService test', () => {

    it('#get should work (default values)', () => {
        const allowMethods = Sheetbase.Option.get('allowMethodsWhenDoGet');
        const views = Sheetbase.Option.get('views');
        const engine = Sheetbase.Option.get('view engine');
        expect(allowMethods).to.be.false;
        expect(views).to.equal('views');
        expect(engine).to.equal('gs');
    });

    it('#set should work', () => {
        const result = Sheetbase.Option.set({
            views: 'xxx',
        });
        expect(result.views).to.equal('xxx');
    });

    it('#get should work', () => {
        const result = Sheetbase.Option.get('views');
        expect(result).to.equal('xxx');
    });

});

describe('RequestService test', () => {

    it('#query should work');
    it('#body should work');

});

describe('ResponseService test', () => {

    it('#send should work');
    it('#html should work');
    it('#render should work');
    it('#json should work');
    it('#success should work');
    it('#error should work');

});

describe('RouterService test', () => {

    it('#use should work');
    it('#all should work');
    it('#get should work');
    it('#post should work');
    it('#put should work');
    it('#patch should work');
    it('#delete should work');

});