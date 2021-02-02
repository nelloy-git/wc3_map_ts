/** @noSelfInFile */

// export declare namespace Json {
    type JsonHash = {
        [key: string]: any
    }

    export function decode(this: void, str: string) : JsonHash 
    export function encode(this: void, json: JsonHash) : string 
// }