import { Log } from "../Utils";
import { byte2id } from "./Utils";

declare namespace string {
    function pack(this: void, fmt: string, ...data: any[]): string;
    /** @tupleReturn */
    function unpack<T1, T2 = undefined, T3 = undefined, T4 = undefined>(this: void, fmt: string, s:string): [T1, T2, T3, T4, number | undefined];
    function format(this: void, fmt: string, ...args: any[]): string;
    function byte(this: void, char: string): number;
}

/** @tupleReturn */
function readFileData<T1, T2 = undefined, T3 = undefined, T4 = undefined>(fmt:string, data: string): [T1, T2, T3, T4]{
    let res = string.unpack<T1, T2, T3, T4>(fmt, data)
    res[res.length - 1] = undefined
    return <[T1, T2, T3, T4]><unknown>res
}

export class File {
    get path(){return this._path}

    open(path: string){
        let [f] = io.open(GetSrc() + '/' + path, 'rb')
        if (!f){
            Log.err(File.name +
                    ': can not open file ' + path)
            return
        };
        [this._raw_data] = f.read('*a')
        if (!this._raw_data){
            Log.err(File.name +
                    ': can not open file ' + path)
        }
        f.close()

        this._path = path
    }

    save(path: string){
        let [f] = io.open(path, 'wb')
        if (!f){
            return Log.err(File.name +
                           ': can not open file ' + path)
        }
        f.write(this._raw_data ? this._raw_data : '')
        f.close()
    }

    protected _parseData(type: 'char', pos: number, size: number): string
    protected _parseData(type: 'int', pos: number, size: number): number
    protected _parseData(type: 'float', pos: number, size: number): number
    protected _parseData(type: 'char'|'int'|'float', pos: number, size: number){
        if (!this._raw_data){
            return Log.err(File.name + 
                           ': not data to parse.')
        }

        if (type == 'float' && size != 4){
            return Log.err(File.name +
                           ': float type can be only of size 4.')
        }

        let fmt
        switch (type) {
            case 'char': {fmt = 'c' + size.toString(); break}
            case 'int': {fmt = 'I' + size.toString(); break}
            case 'float': {fmt = 'f'; break}
        }

        let [val]: [string|number] = <[string|number]><unknown>readFileData(fmt, this._raw_data.slice(pos))

        switch (type) {
            case 'char': {return <string>val}
            case 'int': {return <number>val}
            case 'float': {return <number>val}
        }
    }

    protected _raw_data: string | undefined
    
    private _path: string | undefined
}