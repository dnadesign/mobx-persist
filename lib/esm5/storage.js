export function clear() {
    return new Promise(function (resolve, reject) {
        try {
            window.localStorage.clear();
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
export function getItem(key) {
    return new Promise(function (resolve, reject) {
        try {
            var value = window.localStorage.getItem(key);
            resolve(value);
        }
        catch (err) {
            reject(err);
        }
    });
}
export function removeItem(key) {
    return new Promise(function (resolve, reject) {
        try {
            window.localStorage.removeItem(key);
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
export function setItem(key, value) {
    return new Promise(function (resolve, reject) {
        try {
            window.localStorage.setItem(key, value);
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
