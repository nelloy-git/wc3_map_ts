
const PADCHAR = '=';
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function getbyte(s: string, i: number) {
    let x = s.charCodeAt(i);
    if (x > 255) {
        throw "INVALID_CHARACTER_ERR: DOM Exception 5";
    }
    return x;
}

export function encode64(s: string) {
    let b10: number;
    let i: number;
    let x: string[] = [];

    let imax = s.length - s.length % 3;

    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8) | getbyte(s, i + 2);
        x.push(ALPHA.charAt(b10 >>> 18));
        x.push(ALPHA.charAt((b10 >>> 12) & 0x3F));
        x.push(ALPHA.charAt((b10 >>> 6) & 0x3f));
        x.push(ALPHA.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
        case 1:
            b10 = getbyte(s, i) << 16;
            x.push(ALPHA.charAt(b10 >>> 18) + ALPHA.charAt((b10 >>> 12) & 0x3F) +
                   PADCHAR + PADCHAR);
            break;
        case 2:
            b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8);
            x.push(ALPHA.charAt(b10 >>> 18) + ALPHA.charAt((b10 >>> 12) & 0x3F) +
                ALPHA.charAt((b10 >>> 6) & 0x3f) + PADCHAR);
            break;
    }
    return x.join('');
}

function getbyte64(s: string, i: number) {
    let idx = ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw "Cannot decode base64";
    }
    return idx;
}

export function decode64(s: string) {
    let pads: number, i: number, b10: number;
    let imax = s.length;
    if (imax === 0) {
        return s;
    }

    if (imax % 4 !== 0) {
        throw "Cannot decode base64";
    }

    pads = 0;
    if (s.charAt(imax - 1) === PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    let x: string[] = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) |
            (getbyte64(s, i + 2) << 6) | getbyte64(s, i + 3);
        x.push(string.char(b10 >>> 16, (b10 >>> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
        case 1:
            b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6);
            x.push(string.char(b10 >>> 16, (b10 >>> 8) & 0xff));
            break;
        case 2:
            b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12);
            x.push(string.char(b10 >>> 16));
            break;
    }
    return x.join('');
}

export function to32BitHexString(num: number) {
    return string.format('%08X', num);
}

export function from32BitHexString(someHexString: string) {
    return tonumber(someHexString, 16) || 0;
}