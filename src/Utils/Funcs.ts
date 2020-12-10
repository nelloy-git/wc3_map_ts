/** @noSelfInFile */

import { Logger } from "./Logger"
let Log = Logger.Default

declare namespace string {
    function pack(fmt: string, s:number): string;
    function unpack(fmt: string, s:string): number;
    function match(s: string, regexp: string): number;
}

export function id2int(id: string){
    return string.unpack('>I4', id)
}

export function int2id(id: number){
    return string.pack('>I4', id)
}

export function wcType(handle: any){
    let s_handle = tostring(handle)
    let [name, id] = s_handle.split(':')
    return name
}

export function float2str(val: number, after_decimal: number){
    if (after_decimal < 0){
        Log.err('after_decimal must be more than 0.')
    } else if (after_decimal == 0){
        return Math.floor(val).toString()
    }

    after_decimal = Math.floor(after_decimal)
    let pow = 1
    for (let i = 0; i < after_decimal; i++){
        pow *= 10
    }
    let int = Math.floor(val * pow)
    let s_int = int.toString()

    while (s_int.length <= after_decimal){
        s_int = '0' + s_int
    }

    return s_int.slice(0, s_int.length - after_decimal) + '.' +
           s_int.slice(s_int.length - after_decimal)
}