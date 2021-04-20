import { FileIFace } from "./IFace";

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

export class FileBinary extends FileIFace {

    read(path: string){
        let [f] = io.open(path, 'rb')
        if (!f){
            error(FileBinary.name + ' can not open ' + path, 2)
        }
        let [data] = f.read('*a')

        if (!data){
            error(FileBinary.name + ' can not read file ' + path, 2)
        }
        f.close()

        this.data = data
    }

    write(path: string){
        let [f] = io.open(path, "wb")
        if (!f){
            return error(FileBinary.name + ' can not open ' + path, 2)
        }

        if (!this.data){
            error(FileBinary.name + ' file data is empty ' + path, 2)
            return
        }

        f.write(this.data)
    }

    startReading(){ 
        if (!this.data){
            return error(FileBinary.name + ' file data is empty.', 2)
        }

        if (this.__file_pos >= 0){
            return error(FileBinary.name + ' finish previous reading first.', 2)
        }
        
        this.__file_pos = 0 
    }

    finishReading(){
        this.__file_pos = -1
    }

    readBool(size: number){return this.__parseNext('int', size) == 1}
    readInt(size: number){return this.__parseNext('int', size)}
    readChar(size: number){return this.__parseNext('char', size)}
    readFloat(){return this.__parseNext('float', 4)}
    readString(){
        let val = ''
        let c: string
        while (true){
            c = this.__parseNext('char', 1)
            if (c == '\0'){break}
            val += c
        }
        return val
    }

    private __parseNext(type: 'char', size: number): string
    private __parseNext(type: 'int', size: number): number
    private __parseNext(type: 'float', size: number): number
    private __parseNext(type: 'char'|'int'|'float', size: number){
        if (this.__file_pos < 0){
            return error(FileBinary.name + ' start reading first.', 3)
        }

        let val = this.__parseData(type, this.__file_pos, size)
        this.__file_pos += size

        if (type == 'char'){
            return <string>val
        } else { // if (type == 'int' || type == 'float'){
            return <number>val
        }
    }

    private __parseData(type: 'char'|'int'|'float', pos: number, size: number){
        let fmt
        if (type == 'char'){
            fmt = 'c' + size.toString()
        } else if (type == 'int'){
            fmt = 'I' + size.toString()
        } else { // if (type == 'float'){
            if (size != 4){
                return error(FileBinary.name + ' float type can be only 4 bytes size', 4)
            }
            fmt = 'f'
        }

        let [data] = readRawData<string|number>(fmt, (<string>this.data).slice(pos))
        return data
    }
    
    private __file_pos: number = -1
}