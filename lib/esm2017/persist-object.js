"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistObject = void 0;
const serializr_1 = require("serializr");
const types_1 = require("./types");
// const demo = {
//     title: true,
//     name: {
//         type: 'object',
//         schema: {
//             first: true,
//             second: true,
//             last: true
//         }
//     }
// }
function persistObject(target, schema) {
    const model = createModel(schema);
    serializr_1.setDefaultModelSchema(target, model);
    return target;
}
exports.persistObject = persistObject;
function createModel(params) {
    const schema = {};
    Object.keys(params).forEach(key => {
        if (typeof params[key] === 'object') {
            if (params[key].type in types_1.types) {
                if (typeof params[key].schema === 'object') {
                    schema[key] = types_1.types[params[key].type](createModel(params[key].schema));
                }
                else {
                    schema[key] = types_1.types[params[key].type](params[key].schema);
                }
            }
        }
        else if (params[key] === true) {
            schema[key] = true;
        }
    });
    return serializr_1.createSimpleSchema(schema);
}
