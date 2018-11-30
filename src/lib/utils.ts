import { RoutingErrors, ResponseError, RoutingError } from './types';

export function o2a<Obj, K extends keyof Obj, P extends Obj[K]>(
    object: Obj,
    keyName = '$key',
): Array<(P extends {[key: string]: any} ? P: {value: P}) & {$key: string}> {
    const arr = [];
    for (const key of Object.keys(object || {})) {
        if (object[key] instanceof Object) {
            object[key][keyName] = key;
        } else {
            const value = object[key];
            object[key] = {};
            object[key][keyName] = key;
            object[key]['value'] = value;
        }
        arr.push(object[key]);
    }
    return arr;
}

export function a2o<Obj>(
    array: Obj[],
    keyName = 'key',
): {[key: string]: Obj} {
    const obj = {};
    for (let i = 0; i < (array || []).length; i++) {
        const item = array[i];
        obj[
            item[keyName] ||
            item['key'] ||
            item['slug'] ||
            (item['id'] ? '' + item['id'] : null) ||
            (item['#'] ? '' + item['#'] : null) ||
            ('' + Math.random() * 1E20)
        ] = item;
    }
    return obj;
}

export function uniqueId(
    length = 12,
    startWith = '-',
): string {
    const maxLoop = length - 8;
    const ASCII_CHARS = startWith + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    let lastPushTime = 0;
    const lastRandChars = [];
    let now = new Date().getTime();
    const duplicateTime = (now === lastPushTime);
    lastPushTime = now;
    const timeStampChars = new Array(8);
    let i;
    for (i = 7; i >= 0; i--) {
        timeStampChars[i] = ASCII_CHARS.charAt(now % 64);
        now = Math.floor(now / 64);
    }
    let uid = timeStampChars.join('');
    if (!duplicateTime) {
        for (i = 0; i < maxLoop; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
        }
    } else {
        for (i = maxLoop - 1; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
        }
        lastRandChars[i]++;
    }
    for (i = 0; i < maxLoop; i++) {
        uid += ASCII_CHARS.charAt(lastRandChars[i]);
    }
    return uid;
}

export function honorData<Obj>(
    data: Obj | any = {},
): ({[K in keyof Obj]: any}) {
    for (const key of Object.keys(data)) {
        if (data[key] === '' || data[key] === null || data[key] === undefined) {
            // delete null key
            delete data[key];
        } else if ((data[key] + '').toLowerCase() === 'true') {
            // boolean TRUE
            data[key] = true;
        } else if ((data[key] + '').toLowerCase() === 'false') {
            // boolean FALSE
            data[key] = false;
        } else if (!isNaN(data[key])) {
            // number
            // tslint:disable:ban radix
            if (Number(data[key]) % 1 === 0) {
                data[key] = parseInt(data[key]);
            }
            if (Number(data[key]) % 1 !== 0) {
                data[key] = parseFloat(data[key]);
            }
        } else {
            // JSON
            try {
                data[key] = JSON.parse(data[key]);
            } catch (e) {
                // continue
            }
        }
    }
    return data;
}

/**
 * Routing helpers
 */
export function routingErrorBuilder(errors: RoutingErrors, errorHandler?: {(err: ResponseError)}): {
    (code?: string, overrideHandler?: {(err: ResponseError)});
} {
    return (code?: string, overrideHandler?: {(err: ResponseError)}) => {
        // error
        let error = errors[code];
        if (!error) {
            error = { status: 500, message: code || 'Unknown.' };
            code = 'internal';
        } else {
            error = (typeof error === 'string') ? { message: error } : error;
        }
        const { status = 400, message } = error as RoutingError;
        // handler
        const handler = overrideHandler || errorHandler;
        if (!!handler && handler instanceof Function) {
            return handler({ code, message, status });
        } else {
            return { code, message, status };
        }
    };
}

export function routingError(errors: RoutingErrors, code?: string, errorHandler?: {(err: ResponseError)}) {
    const builder = routingErrorBuilder(errors, errorHandler);
    return builder(code);
}

export function addonRoutesExposedChecker(disabledRoutes: string | string[]): {
    (method: string, routeName: string): boolean;
} {
    return (method: string, routeName: string): boolean => {
        let enable = true;
        // cheking value (against disabledRoutes)
        const value: string = method.toLowerCase() + ':' + routeName;
        const valueSpaced: string = method.toLowerCase() + ' ' + routeName;
        const valueUppercase: string = method.toUpperCase() + ':' + routeName;
        const valueSpacedUppercase: string = method.toUpperCase() + ' ' + routeName;
        const values: string[] = [
            value, // get:/xxx
            valueUppercase, // GET:/xxx
            (value).replace(':/', ':'), // get:xxx
            (valueUppercase).replace(':/', ':'), // GET:xxx
            valueSpaced, // get /xxx
            valueSpacedUppercase, // GET /xxx
            (valueSpaced).replace(' /', ' '), // get xxx
            (valueSpacedUppercase).replace(' /', ' '), // GET xxx
        ];
        // check
        for (let i = 0; i < values.length; i++) {
            if (disabledRoutes.indexOf(values[i]) > -1) {
                enable = false;
            }
        }
        return enable;
    };
}

export function addonRoutesExposed(
    disabledRoutes: string | string[],
    method: string,
    routeName: string,
): boolean {
    const checker = addonRoutesExposedChecker(disabledRoutes);
    return checker(method, routeName);
}
