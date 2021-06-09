import { reaction, action } from 'mobx';
import { serialize, update, serializable, getDefaultModelSchema } from 'serializr';
import * as Storage from './storage';
import { mergeObservables } from './merge-x';
import { types } from './types';
import { persistObject } from './persist-object';
export function persist() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var a = args[0], b = args[1], c = args[2];
    if (a in types) {
        return serializable(types[a](b));
    }
    else if (args.length === 1) {
        return function (target) { return persistObject(target, a); };
    }
    else {
        return serializable.apply(null, args);
    }
}
export function create(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.storage, storage = _c === void 0 ? Storage : _c, _d = _b.jsonify, jsonify = _d === void 0 ? true : _d, _e = _b.debounce, debounce = _e === void 0 ? 0 : _e;
    if (typeof localStorage !== 'undefined' && localStorage === storage)
        storage = Storage;
    return function hydrate(key, store, initialState, customArgs) {
        if (initialState === void 0) { initialState = {}; }
        if (customArgs === void 0) { customArgs = {}; }
        var schema = getDefaultModelSchema(store);
        function hydration() {
            var promise = storage.getItem(key)
                .then(function (d) { return !jsonify ? d : JSON.parse(d); })
                .then(action("[mobx-persist " + key + "] LOAD_DATA", function (persisted) {
                if (persisted && typeof persisted === 'object') {
                    update(schema, store, persisted, null, customArgs);
                }
                mergeObservables(store, initialState);
                return store;
            }));
            promise.rehydrate = hydration;
            return promise;
        }
        var result = hydration();
        reaction(function () { return serialize(schema, store); }, function (data) { return storage.setItem(key, !jsonify ? data : JSON.stringify(data)); }, {
            delay: debounce
        });
        return result;
    };
}
