import { reaction, action } from 'mobx';
import { serialize, update, serializable, getDefaultModelSchema } from 'serializr';
import * as Storage from './storage';
import { mergeObservables } from './merge-x';
import { types } from './types';
import { persistObject } from './persist-object';
export function persist(...args) {
    const [a, b, c] = args;
    if (a in types) {
        return serializable(types[a](b));
    }
    else if (args.length === 1) {
        return (target) => persistObject(target, a);
    }
    else {
        return serializable.apply(null, args);
    }
}
export function create({ storage = Storage, jsonify = true, debounce = 0 } = {}) {
    if (typeof localStorage !== 'undefined' && localStorage === storage)
        storage = Storage;
    return function hydrate(key, store, initialState = {}, customArgs = {}) {
        const schema = getDefaultModelSchema(store);
        function hydration() {
            const promise = storage.getItem(key)
                .then((d) => !jsonify ? d : JSON.parse(d))
                .then(action(`[mobx-persist ${key}] LOAD_DATA`, (persisted) => {
                if (persisted && typeof persisted === 'object') {
                    update(schema, store, persisted, null, customArgs);
                }
                mergeObservables(store, initialState);
                return store;
            }));
            promise.rehydrate = hydration;
            return promise;
        }
        const result = hydration();
        reaction(() => serialize(schema, store), (data) => storage.setItem(key, !jsonify ? data : JSON.stringify(data)), {
            delay: debounce
        });
        return result;
    };
}
