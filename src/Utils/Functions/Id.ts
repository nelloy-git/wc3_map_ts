declare namespace string {
    function pack(fmt: string, s:number): string;
    function unpack(fmt: string, s:string): number;
}

export function id2int(this:void, id: string){
    return string.unpack('>I4', id)
}

export function int2id(this:void, id: number){
    return string.pack('>I4', id)
}