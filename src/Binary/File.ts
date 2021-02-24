import { getFilePath, Log } from "../Utils";

let __path__ = Macro(getFilePath)

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

export abstract class File<T extends LuaTable> {
    constructor(path?: string){
        this.__file_pos = 0
        this._data = []
        
        if (!path){
            this.path = ''
            return
        }

        this.path = path

        let [f] = io.open(GetSrc() + '/' + path, 'rb')
        if (!f){
            Log.err('can not open file ' + GetSrc() + '/' + path,
                    __path__, File, 2)
            return
        };

        [this._raw_data] = f.read('*a')
        if (!this._raw_data){
            Log.err('can not read file ' + path,
                    __path__, File, 2)
            return
        }
        f.close()

        this._data = this._parse()
    }

    get data(){return <ReadonlyArray<T>>this._data}

    save(path?: string){
        path = path ? path : this.path

        let [f] = io.open(path, 'wb')
        if (!f){
            return Log.err('can not save file ' + path,
                            __path__, File, 2)
        }
        f.write(this._raw_data ? this._raw_data : '')
        f.close()
    }

    protected abstract _parse(): T[]

    protected _readBool(size: number){return this._parseNext('int', size) == 1}
    protected _readInt(size: number){return this._parseNext('int', size)}
    protected _readChar(size: number){return this._parseNext('char', size)}
    protected _readFloat(){return this._parseNext('float', 4)}
    protected _readString(){
        let val = ''
        let c: string
        while (true){
            c = this._parseNext('char', 1)
            if (c == '\0'){break}
            val += c
        }
        return val
    }

    private _parseNext(type: 'char', size: number): string
    private _parseNext(type: 'int', size: number): number
    private _parseNext(type: 'float', size: number): number
    private _parseNext(type: 'char'|'int'|'float', size: number){
        let val = this._parseData(type, this._file_pos, size)
        this.__file_pos += size
        // print(this.__file_pos)
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
            return Log.err('no data to parse. Open file first.',
                            __path__, File, 2)
        }

        let fmt
        if (type == 'char'){
            fmt = 'c' + size.toString()
        } else if (type == 'int'){
            fmt = 'I' + size.toString()
        } else { // if (type == 'float'){
            if (size != 4){
                return Log.err('float type can be only of size 4 bytes',
                                __path__, File, 2)
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

    readonly path: string

    protected _data: T[] = []
    protected _raw_data: string | undefined
    protected get _file_pos(){return this.__file_pos}

    private __file_pos: number
}