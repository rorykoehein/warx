// todo: add duplicate key check
function reverseKeysAndValues(obj){
    let ret = {};
    for(let key in obj){
        if(ret.hasOwnProperty(key)) {
            throw new Error('duplicate value while performing swap ' + obj[key]);
        }
        ret[obj[key]] = key;
    }
    return ret;
}

const keyMap = {
    action: 'a',
    alive: 'l',
    data: 'd',
    playerId: 'p',
    sendTime: 's',
    type: 't',
};

const valueMap = {
    MOVE_REQUESTED: 'm',
    PING: '0',
    PONG: '1',
};

const reverseKeyMap = reverseKeysAndValues(keyMap);
const reverseValueMap = reverseKeysAndValues(valueMap);

const replaceKeyAndValue = (object, keyMap, valueMap) =>
    // todo does it work for arrays?
    Object.keys(object).reduce((acc, key) => {
        const value = object[key];
        acc[keyMap[key] || key] = typeof value === 'object'
            ? replaceKeyAndValue(value, keyMap, valueMap)
            : valueMap[value] || value;
        return acc;
    }, {});

export const packKey = key => keyMap[key] || key;
export const unpackKey = key => reverseKeyMap[key] || key;
export const pack = message => message; //replaceKeyAndValue(message, keyMap, valueMap);
export const unpack = message => message; //replaceKeyAndValue(message, reverseKeyMap, reverseValueMap);
