import * as Sheetbase from './public_api';

function app() {
    return Sheetbase.sheetbase({ views: 'views' });
}

export function example1() {
    const { Option } = app();

    const views = Option.get('views');
    Logger.log(views);
}

export function example2(): void {
    const { Utils } = app();

    const o = {
        a: 1,
        b: 2,
        c: {
            c1: 1,
            c2: 2,
        },
    };
    const a = Utils.o2a(o);
    Logger.log(a);
}

export function example3(): void {
    const { Utils } = app();

    const a = [1, 2, {a: 1, b: 2, c: 3}, {key: 'd', d1: 2, d2: 2}];
    const o = Utils.a2o(a);
    Logger.log(o);
}

export function example4(): void {
    const { Utils } = app();

    Logger.log( Utils.uniqueId() );
    Logger.log( Utils.uniqueId(32) );
    Logger.log( Utils.uniqueId(12, '1') );
}

export function example5(): void {
    const { Utils } = app();

    const o = {
        a: 1,
        a1: '1',
        b: true,
        b1: 'TRUE',
        c: { c1: 1, c2: 2 },
        c1: '{ "c1": 1, "c2": 2 }',
        d: null,
    };
    const output = Utils.honorData(o);
    Logger.log(output);
}