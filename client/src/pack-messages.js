const isJSONObject = value => {
    const type = typeof value;
    return !(type === 'string' || type === 'number' || type === 'boolean' || Array.isArray(value) || value === null);
};

function reverseKeysAndValues(object){
    let reverse = {};
    Object.keys(object).forEach(key => {
        const value = object[key];
        if(reverse.hasOwnProperty(key)) {
            throw new Error('duplicate value while performing swap ' + object[key]);
        }
        if(isJSONObject(value)) {
            reverse[key] = reverseKeysAndValues(value);
        } else {
            reverse[object[key]] = key;
        }
    });
    return reverse;
}

const keyMap = {
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
        SHOT_REQUESTED: 's',
        MOVE_REQUESTED: 'm',
        MOVE: 'o',
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

const reverseKeyMap = reverseKeysAndValues(keyMap);
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

export const packKey = key => keyMap[key] || key;
export const unpackKey = key => reverseKeyMap[key] || key;
export const pack = message => replaceKeyAndValue(message, keyMap, valueMap, true);
export const unpack = message => replaceKeyAndValue(message, reverseKeyMap, reverseValueMap, false);
