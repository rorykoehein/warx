// @flow

export const emptyList = [];

export const toList = (object: any) => object && Object.keys(object).map(key => object[key]) || emptyList;

export const reduceReducers = (...reducers: Array<Function>): Function =>
    (prev: Function, current: Function) =>
        reducers.reduce((p, r) => r(p, current), prev);

let nextId = 0;
export const generateId = () => `${nextId++}`; // make it a string, we later may want to replace by base 64 number or so
