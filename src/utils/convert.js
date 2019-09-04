"use strict";
// Derived from waves-api
//
Object.defineProperty(exports, "__esModule", { value: true });
import bignumber_1 from 'bignumber.js';
import converters_1 from './converters';
function performBitwiseAnd(a, b) {
    let sa = a.toString(2).split('.')[0];
    let sb = b.toString(2).split('.')[0];
    let len = Math.min(sa.length, sb.length);
    let s1 = sa.slice(sa.length - len);
    let s2 = sb.slice(sb.length - len);
    let result = new Array(len);
    for (let i = len - 1; i >= 0; i--) {
        result[i] = (s1[i] === '1' && s2[i] === '1') ? '1' : '0';
    }
    return parseInt(result.join(''), 2);
}
const Convert = {
    booleanToBytes: function (input) {
        if (typeof input !== 'boolean') {
            throw new Error('Boolean input is expected');
        }
        return input ? [1] : [0];
    },
    bytesToByteArrayWithSize: function (input) {
        if (!(input instanceof Array || input instanceof Uint8Array)) {
            throw new Error('Byte array or Uint8Array input is expected');
        }
        else if (input instanceof Array && !(input.every(function (n) { return typeof n === 'number'; }))) {
            throw new Error('Byte array contains non-numeric elements');
        }
        if (!(input instanceof Array)) {
            input = Array.prototype.slice.call(input);
        }
        let lengthBytes = converters_1.int16ToBytes(input.length, true);
        return lengthBytes.concat(input);
    },
    shortToByteArray: function (input) {
        if (typeof input !== 'number') {
            throw new Error('Numeric input is expected');
        }
        return converters_1.int16ToBytes(input, true);
    },
    longToByteArray: function (input) {
        if (typeof input !== 'number') {
            throw new Error('Numeric input is expected');
        }
        let bytes = new Array(7);
        for (let k = 7; k >= 0; k--) {
            bytes[k] = input & (255);
            input = input / 256;
        }
        return bytes;
    },
    idxToByteArray: function (input) {
        return converters_1.int32ToBytes(input, true);
    },
    bigNumberToByteArray: function (input) {
        if (!(input instanceof bignumber_1.default)) {
            throw new Error('BigNumber input is expected');
        }
        let performBitwiseAnd255 = performBitwiseAnd.bind(null, new bignumber_1.default(255));
        let bytes = new Array(7);
        for (let k = 7; k >= 0; k--) {
            bytes[k] = performBitwiseAnd255(input);
            input = input.div(256);
        }
        return bytes;
    },
    stringToByteArray: function (input) {
        if (typeof input !== 'string') {
            throw new Error('String input is expected');
        }
        return converters_1.stringToByteArray(input);
    },
    stringToByteArrayWithSize: function (input) {
        if (typeof input !== 'string') {
            throw new Error('String input is expected');
        }
        let stringBytes = converters_1.stringToByteArray(input);
        let lengthBytes = converters_1.int16ToBytes(stringBytes.length, true);
        return lengthBytes.concat(stringBytes);
    }
};

export default Convert;
//# sourceMappingURL=convert.js.map
