// @flow

type KeyMap = {
    [string]: string
}

const isJSONObject = value => {
    const type = typeof value;
    return !(type === 'string' || type === 'number' || type === 'boolean' || Array.isArray(value) || value === null);
};

function reverseKeysAndValues(object: Object){
    let reverse = {};
    Object.keys(object).forEach(key => {
        const value = object[key];
        if(isJSONObject(value)) {
            if(reverse[key]) {
                throw new Error('duplicate value while performing swap ' + object[key]);
            }
            reverse[key] = reverseKeysAndValues(value);
        } else {
            if(reverse[object[key]]) {
                throw new Error('duplicate value while performing swap ' + object[key]);
            }
            reverse[object[key]] = key;
        }
    });
    return reverse;
}

const keyMap: KeyMap = {
    action: 'a',
    alive: 'l',
    data: 'd',
    direction: 'i',
    playerId: 'p',
    sendTime: 's',
    type: 't',
};

const valueMap = {
    type: {
        MOVE_START_REQUESTED: 'a',
        MOVE_STOP_REQUESTED: 'o',
        // MOVE_STOPPED: 's',
        // MOVE_STARTED: 'r',
        // MOVE_SYNC: 'm',
        MOVE_SYNCS: 'm',
        MOVE: 'v',
        PING: '0',
        PONG: '1',
    },
    direction: {
        up: 'u',
        right: 'r',
        down: 'd',
        left: 'l',
    }
};

const getValue = (key, value, valueMap) => (valueMap[key] && valueMap[key][value]) || value;

const reverseKeyMap: KeyMap = reverseKeysAndValues(keyMap);
const reverseValueMap = reverseKeysAndValues(valueMap);

const replaceKeyAndValue = (object, keyMap, valueMap, pack) =>
    object && Object.keys(object).reduce((acc, key) => {
        const value = object[key];
        const newKey = keyMap[key] || key;
        acc[newKey] = isJSONObject(value)
            ? replaceKeyAndValue(value, keyMap, valueMap, pack)
            : getValue(pack ? key : newKey, value, valueMap);
        return acc;
    }, {});

export const packKey = (key: string) => keyMap[key] || key;
export const unpackKey = (key: string) => reverseKeyMap[key] || key;
export const pack = (message: Object) => replaceKeyAndValue(message, keyMap, valueMap, true);
export const unpack = (message: Object) => replaceKeyAndValue(message, reverseKeyMap, reverseValueMap, false);
