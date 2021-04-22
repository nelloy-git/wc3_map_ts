import { Log } from "../Utils";

let __path__ = Macro(getFilePath())

export type bytes = string;

declare namespace string {
    function char(this:void, int: number): string;

    function pack(this:void, fmt: string, s:number): string;
    function unpack(this:void, fmt: string, s:string): number;
}

declare namespace math {
    /** @tupleReturn */
    function frexp(this:void, v: number): [number, number]
}

export function id2byte(int: number): bytes{
    return string.pack('>I4', int)
}

export function int2byte(int: number, size: number = 4): bytes{
    return string.pack('<I' + tostring(size), int)
}

export function str2byte(str: string): bytes{
    return str + '\0'
}

export function float2byte(float: number): bytes{
    let sign = 0
    if (float < 0){
        sign = 1
        float = -float
    }

    let [mant, exp] = math.frexp(float)
    if (float == 0){
        mant = 0
        exp = 0
    } else {
        mant = (2 * mant - 1) * 8388608
        exp += 126
    }

    let res = '';
    let cur = '';
    [float, cur] = grab_byte(mant);
    res += cur;
    [float, cur] = grab_byte(float);
    res += cur;
    [float, cur] = grab_byte(exp * 128 + float);
    res += cur;
    [float, cur] = grab_byte(sign * 128 + float);
    res += cur
    
    return res
}

export function byte2id(data: bytes): number{
    return string.unpack('>I4', data)
}

export function byte2int(data: bytes): number{
    return string.unpack('<I4', data)
}

export function byte2str(data: bytes): string{
    return data.substring(0, data.length - 1)
}

export function byte2float(data: bytes): number{
    let int = byte2int(data)

    let s = 1
    if (int >>> 31 == 1){s = -1}
    let exp = (int >>> 23) & 0xFF
    let mant = (exp == 0) ? (int & 0x7FFFFF ) << 1 : (int & 0x7FFFFF ) | 0x800000

    return s * mant * (2 ^ (-23)) * (2 ^ (exp - 127))
}

function grab_byte(v: number): [number, string]{
    return [Math.floor(v / 256), string.char(Math.floor(v) % 256)]
}

declare namespace string {
    function byte(this: void, str: string, i?: number): number
}

export function nextId(this: void, cur_id: string){
    let p4 = string.byte(cur_id, 1)
    let p3 = string.byte(cur_id, 2)
    let p2 = string.byte(cur_id, 3)
    let p1 = string.byte(cur_id, 4)

    if (p1 < 96){
        p1++
        while (p1 >= 48 && p1 <= 57){p1++}
    } else if (p2 < 96) {
        p1 = string.byte('!')
        p2++
        while (p2 >= 48 && p2 <= 57){p2++}
    } else if (p3 < 96) {
        p1 = string.byte('!')
        p2 = string.byte('!')
        p3++
        while (p3 >= 48 && p3 <= 57){p3++}
    } else {
        return Log.err('no valid ids left.', 
                        __path__, undefined, 2)
    }
    return string.char(p4) + string.char(p3) + string.char(p2) + string.char(p1)
}

type IdType = 'UNIT'|'HERO'|'ABIL'|'BUFF'|'ITEM'|'UPGR'|'DECO'

export function getFirstId(type: IdType){
    if (type == 'UNIT'){return 'x###'}
    if (type == 'HERO'){return 'HM##'}
    if (type == 'ABIL'){return 'AM##'}
    if (type == 'BUFF'){return 'BM##'}
    if (type == 'ITEM'){return 'IM##'}
    if (type == 'UPGR'){return 'RM##'}
    if (type == 'DECO'){return 'D###'}
    return Log.err('unknow id type.', 
                    __path__, undefined, 2)
}