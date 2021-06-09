"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setItem = exports.removeItem = exports.getItem = exports.clear = void 0;
function clear() {
    return new Promise((resolve, reject) => {
        try {
            window.localStorage.clear();
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.clear = clear;
function getItem(key) {
    return new Promise((resolve, reject) => {
        try {
            const value = window.localStorage.getItem(key);
            resolve(value);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.getItem = getItem;
function removeItem(key) {
    return new Promise((resolve, reject) => {
        try {
            window.localStorage.removeItem(key);
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.removeItem = removeItem;
function setItem(key, value) {
    return new Promise((resolve, reject) => {
        try {
            window.localStorage.setItem(key, value);
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.setItem = setItem;
