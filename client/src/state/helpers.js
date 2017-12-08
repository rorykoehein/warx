// @flow

type ListableObject = {
    [any]: any
};

export const emptyList = [];

export const toList = (object: ListableObject) => object && Object.keys(object).map(key => object[key]) || emptyList;

export const reduceReducers = (...reducers) => (previous, current) =>
    reducers.reduce(
        (p, r) => r(p, current),
        previous
    );
