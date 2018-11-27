import * as Sheetbase from './public_api';

function load_() {
    return Sheetbase.sheetbase({ views: 'views' });
}

export function example1() {
    const Sheetbase = load_();

    const views = Sheetbase.Option.get('views');
    Logger.log(views);
}

export function example2(): void {
    const o = {
        a: 1,
        b: 2,
        c: {
            c1: 1,
            c2: 2,
        },
    };
    const a = Sheetbase.o2a(o);
    Logger.log(a);
}

export function example3(): void {
    const a = [1, 2, {a: 1, b: 2, c: 3}, {key: 'd', d1: 2, d2: 2}];
    const o = Sheetbase.a2o(a);
    Logger.log(o);
}

export function example4(): void {
    Logger.log( Sheetbase.uniqueId() );
    Logger.log( Sheetbase.uniqueId(32) );
    Logger.log( Sheetbase.uniqueId(12, '1') );
}

export function example5(): void {
    const o = {
        a: 1,
        a1: '1',
        b: true,
        b1: 'TRUE',
        c: { c1: 1, c2: 2 },
        c1: '{ "c1": 1, "c2": 2 }',
        d: null,
    };
    const output = Sheetbase.honorData(o);
    Logger.log(output);
}