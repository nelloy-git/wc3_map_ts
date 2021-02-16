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

export abstract class File<T> {
    get data(){return <ReadonlyArray<T>>this._data}
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
        this._file_pos = 0
        this._data = this._parse()
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

    protected abstract _parse(): T[]

    protected _parseNext(type: 'char', size: number): string
    protected _parseNext(type: 'int', size: number): number
    protected _parseNext(type: 'float', size: number): number
    protected _parseNext(type: 'char'|'int'|'float', size: number){
        let val = this._parseData(type, this._file_pos, size)
        this._file_pos += size
        if (type == 'char'){
            return <string>val
        } else if (type == 'int' || type == 'float'){
            return <number>val
        }
    }

    private _parseData(type: 'char', pos: number, size: number): string
    private _parseData(type: 'int', pos: number, size: number): number
    private _parseData(type: 'float', pos: number, size: number): number
    private _parseData(type: 'char'|'int'|'float', pos: number, size: number): string | number
    private _parseData(type: 'char'|'int'|'float', pos: number, size: number){
        if (!this._raw_data){
            return Log.err(File.name + 
                           ': not data to parse.')
        }

        let fmt
        if (type == 'char'){
            fmt = 'c' + size.toString()
        } else if (type == 'int'){
            fmt = 'I' + size.toString()
        } else { // if (type == 'float'){
            if (size != 4){
                return Log.err(File.name +
                               ': float type can be only of size 4.')
            }
            fmt = 'f'
        }

        let [val]: [string|number] = <[string|number]><unknown>readFileData(fmt, this._raw_data.slice(pos))

        if (type == 'char'){
            return <string>val
        } else if (type == 'int'){
            return <number>val
        } else { // if (type == 'float'){
            return <number>val
        }
    }

    private _data: T[] = []
    private _path: string | undefined
    private _raw_data: string | undefined
    private _file_pos: number = 0
}