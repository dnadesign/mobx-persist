import { createSimpleSchema, setDefaultModelSchema, } from 'serializr';
import { types } from './types';
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
export function persistObject(target, schema) {
    var model = createModel(schema);
    setDefaultModelSchema(target, model);
    return target;
}
function createModel(params) {
    var schema = {};
    Object.keys(params).forEach(function (key) {
        if (typeof params[key] === 'object') {
            if (params[key].type in types) {
                if (typeof params[key].schema === 'object') {
                    schema[key] = types[params[key].type](createModel(params[key].schema));
                }
                else {
                    schema[key] = types[params[key].type](params[key].schema);
                }
            }
        }
        else if (params[key] === true) {
            schema[key] = true;
        }
    });
    return createSimpleSchema(schema);
}
