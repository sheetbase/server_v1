/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { sheetbase, o2a, a2o, uniqueId } from '../src/public_api';

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

describe('UtilsService test', () => {

    it('#o2a should work', () => {
        const OBJ = { a: 1, b: 2, c: { c1: 1, c2: 2 } };
        const ARR = [
            { $key: 'a', value: 1 },
            { $key: 'b', value: 2 },
            { $key: 'c', c1: 1, c2: 2 },
        ];
        const arr = o2a(OBJ);
        expect(arr).deep.equal(ARR);
    });

    it('#a2o should work', () => {
        const ARR = [{id: 'a', a: 1}, {key: 'b', b: 1}, {slug: 'c', b: 1}];
        const OBJ = {
            a: {id: 'a', a: 1},
            b: {key: 'b', b: 1},
            c: {slug: 'c', b: 1},
        };
        const obj = a2o(ARR);
        expect(obj).deep.equal(OBJ);
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

});