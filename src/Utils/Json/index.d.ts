export type JsonData = {
    [key: string]: undefined | number | string | JsonData 
}

export function decode(this: void, str: string) : JsonData 
export function encode(this: void, json: JsonData) : string