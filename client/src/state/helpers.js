// @flow

export const emptyList = [];

export const toList = (object: any) => object && Object.keys(object).map(key => object[key]) || emptyList;

export const reduceReducers = (...reducers) => (prev, current) => reducers.reduce((p, r) => r(p, current), prev);