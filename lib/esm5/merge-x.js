import { isObservableMap, isObservableArray, isObservableObject } from 'mobx';
export function mergeObservables(target, source) {
    var t = target;
    var s = source;
    if (typeof t === 'object' && typeof s === 'object') {
        for (var key in t) {
            if (t[key] && typeof t[key] === 'object' && typeof s[key] === 'object') {
                if (isObservableMap(t[key]))
                    t[key].merge(s[key]);
                else if (isObservableArray(t[key]))
                    t[key].replace(s[key]);
                else if (isObservableObject(t[key]))
                    t[key] = mergeObservables(t[key], s[key]);
            }
            else if (s[key] !== undefined) {
                t[key] = s[key];
            }
        }
    }
    return t;
}
