export type bytes = string;

declare namespace string {
    function char(this:void, int: number): string;

    function pack(this:void, fmt: string, s:number): string;
    function unpack(this:void, fmt: string, s:string): number;
}

declare namespace math {
    function log(v: number): number
    function floor(this:void, v: number): number
    /** @tupleReturn */
    function frexp(this:void, v: number): [number, number]
}

export function int2byte(int: number): bytes{
    return string.pack('>I4', int)
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

export function byte2int(data: bytes): number{
    return string.unpack('>I4', data)
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
    return [math.floor(v / 256), string.char(math.floor(v) % 256)]
}
