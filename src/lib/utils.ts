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
