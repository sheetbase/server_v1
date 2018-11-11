export function o2a<Obj, K extends keyof Obj, P extends Obj[K]>(
    object: Obj,
    keyName = '$key',
): Array<(P extends {[key: string]: any} ? P: {value: P}) & {$key: string}> {
    const array = [];
    for (const key of Object.keys(object)) {
        if (object[key] instanceof Object) {
        object[key][keyName] = key;
        } else {
        const value = object[key];
        object[key] = {};
        object[key][keyName] = key;
        object[key]['value'] = value;
        }
        array.push(object[key]);
    }
    return array;
}

export function a2o<Obj>(
    array: Obj[],
    keyName = 'key',
): {[key: string]: Obj} {
    const object = {};
    for (let i = 0; i < (array || []).length; i++) {
        const item = array[i];
        object[
        item[keyName] ||
        item['slug'] ||
        (item['id'] ? '' + item['id'] : null) ||
        (item['#'] ? '' + item['#'] : null) ||
        ('' + Math.random() * 1E20)
        ] = item;
    }
    return object;
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
    for (const key in data) {
        if (data[key] === '' || data[key] === null || data[key] === undefined) {
        // delete null key
        delete data[key];
        }
        else if ((data[key] + '').toLowerCase() === 'true') {
        // boolean TRUE
        data[key] = true;
        }
        else if ((data[key] + '').toLowerCase() === 'false') {
        // boolean FALSE
        data[key] = false;
        }
        else if (!isNaN(data[key])) {
        // number
        if (Number(data[key]) % 1 === 0) {
            // tslint:disable-next-line:ban
            data[key] = parseInt(data[key], 2);
        }
        if (Number(data[key]) % 1 !== 0) {
            // tslint:disable-next-line:ban
            data[key] = parseFloat(data[key]);
        }
        }
        else {
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
