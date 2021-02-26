import { Logger } from '../Logger'
import { getFilePath} from "../Funcs";
import { FileIFace } from "./IFace";
let Log = Logger.Default

let __path__ = Macro(getFilePath)

declare namespace string {
    function pack(this: void, fmt: string, ...data: any[]): string;
    /** @tupleReturn */
    function unpack<T1, T2 = undefined, T3 = undefined, T4 = undefined>(this: void, fmt: string, s:string): [T1, T2, T3, T4, number | undefined];
    function format(this: void, fmt: string, ...args: any[]): string;
    function byte(this: void, char: string): number;
}

/** @tupleReturn */
function readRawData<T1, T2 = undefined, T3 = undefined, T4 = undefined>(fmt:string, data: string): [T1, T2, T3, T4]{
    let res = string.unpack<T1, T2, T3, T4>(fmt, data)
    res[res.length - 1] = undefined
    return <[T1, T2, T3, T4]><unknown>res
}

export class FileBinary extends FileIFace<string> {

    read(path: string){
        let [f] = io.open(path, 'rb')
        if (!f){
            return Log.err('can not open ' + path,
                            __path__, FileBinary, 2)
        }
        let [data] = f.read('*a')

        if (!data){
            return Log.err('can not read file ' + path,
                            __path__, FileBinary, 2)
        }
        f.close()

        this.data = data
    }

    write(path: string){
        let [f] = io.open(path, "wb")
        if (!f){
            return Log.err('can not open ' + path,
                            __path__, FileBinary, 2)
        }

        if (!this.data){
            Log.err('file data is empty ' + path,
                    __path__, FileBinary, 2)
            return
        }

        f.write(this.data)
    }

    startReading(){ 
        if (!this.data){
            return Log.err('file data is empty.',
                            __path__, FileBinary, 2)
        }

        if (this.__file_pos >= 0){
            return Log.err('finish previous reading first.',
                            __path__, FileBinary, 2)
        }
        
        this.__file_pos = 0 
    }

    finishReading(){
        this.__file_pos = -1
    }

    readBool(size: number){return this._parseNext('int', size) == 1}
    readInt(size: number){return this._parseNext('int', size)}
    readChar(size: number){return this._parseNext('char', size)}
    readFloat(){return this._parseNext('float', 4)}
    readString(){
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
        if (this.__file_pos < 0){
            return Log.err('start reading first.',
                            __path__, FileBinary, 3)
        }

        let val = this._parseData(type, this.__file_pos, size)
        this.__file_pos += size

        if (type == 'char'){
            return <string>val
        } else { // if (type == 'int' || type == 'float'){
            return <number>val
        }
    }

    private _parseData(type: 'char'|'int'|'float', pos: number, size: number){
        let fmt
        if (type == 'char'){
            fmt = 'c' + size.toString()
        } else if (type == 'int'){
            fmt = 'I' + size.toString()
        } else { // if (type == 'float'){
            if (size != 4){
                return Log.err('float type can be only of size 4 bytes',
                                __path__, FileBinary, 2)
            }
            fmt = 'f'
        }

        let [data] = readRawData<string|number>(fmt, (<string>this.data).slice(pos))
        return data
    }

    data: string | undefined
    private __file_pos: number = -1
}