"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.persist = void 0;
const mobx_1 = require("mobx");
const serializr_1 = require("serializr");
const Storage = __importStar(require("./storage"));
const merge_x_1 = require("./merge-x");
const types_1 = require("./types");
const persist_object_1 = require("./persist-object");
function persist(...args) {
    const [a, b, c] = args;
    if (a in types_1.types) {
        return serializr_1.serializable(types_1.types[a](b));
    }
    else if (args.length === 1) {
        return (target) => persist_object_1.persistObject(target, a);
    }
    else {
        return serializr_1.serializable.apply(null, args);
    }
}
exports.persist = persist;
function create({ storage = Storage, jsonify = true, debounce = 0 } = {}) {
    if (typeof localStorage !== 'undefined' && localStorage === storage)
        storage = Storage;
    return function hydrate(key, store, initialState = {}, customArgs = {}) {
        const schema = serializr_1.getDefaultModelSchema(store);
        function hydration() {
            const promise = storage.getItem(key)
                .then((d) => !jsonify ? d : JSON.parse(d))
                .then(mobx_1.action(`[mobx-persist ${key}] LOAD_DATA`, (persisted) => {
                if (persisted && typeof persisted === 'object') {
                    serializr_1.update(schema, store, persisted, null, customArgs);
                }
                merge_x_1.mergeObservables(store, initialState);
                return store;
            }));
            promise.rehydrate = hydration;
            return promise;
        }
        const result = hydration();
        mobx_1.reaction(() => serializr_1.serialize(schema, store), (data) => storage.setItem(key, !jsonify ? data : JSON.stringify(data)), {
            delay: debounce
        });
        return result;
    };
}
exports.create = create;
