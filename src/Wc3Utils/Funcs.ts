/** @noSelfInFile */

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

export function getCurFileDir(){
    let sep = _G.package.config.charAt(0)
    let this_file = debug.getinfo(2, 'S')?.source
    if (!this_file){return ''}
    let last = string.match(this_file, '^.*()' + sep)
    return this_file.substring(1, last)
}