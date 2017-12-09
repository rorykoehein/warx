// @flow

export const emptyList = [];

export const toList = (object: any) => object && Object.keys(object).map(key => object[key]) || emptyList;
