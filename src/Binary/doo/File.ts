import { int2id, Log } from "../../Utils";
import { File } from "../File";
import { byte2id } from "../Utils";
import { Doodad } from "./Doodad";

export class dooFile extends File {

    get head(){return this._head}
    get version(){return this._version}
    get subversion(){return this._subversion}
    get data(): ReadonlyArray<Doodad>{
        return this._data
    }

    open(path: string){
        super.open(path)
        this._parse()
    }

    private _parse(){
        if (!this._raw_data){
            return Log.err(dooFile.name + 
                           ': no raw data.')
        }

        if (this._data.length > 0){
            return Log.err(dooFile.name + 
                           ': parsed already.')
        }

        this._data = []
        this._file_pos = 0

        this._head = this._parseNext('char', 4)
        this._version = this._parseNext('int', 4)
        this._subversion = this._parseNext('int', 4)

        let count = this._parseNext('int', 4)
        for (let i = 0; i < count; i++){
            let id = byte2id(this._parseNext('char', 4))
            let variation = this._parseNext('int', 4)
            let x = this._parseNext('float', 4)
            let y = this._parseNext('float', 4)
            let z = this._parseNext('float', 4)
            let a = this._parseNext('float', 4)
            let scale_x = this._parseNext('float', 4)
            let scale_y = this._parseNext('float', 4)
            let scale_z = this._parseNext('float', 4)
            let flags = this._parseNext('char', 1)
            let life = this._parseNext('char', 1)

            // Pass 4 unknown bytes
            this._file_pos += 4

            let drop_table_size = this._parseNext('int', 4)
            // TODO pass drop tables

            // Pass 4 bytes
            this._file_pos += 8

            // print(scale_x, scale_y, scale_z)
            let data = new Doodad(id, x, y, z, a, scale_x, scale_y, scale_z)
            this._data.push(data)
        }

        print(this._file_pos, this._raw_data.length)
    }

    private _parseNext(type: 'char', size: number): string
    private _parseNext(type: 'int', size: number): number
    private _parseNext(type: 'float', size: number): number
    private _parseNext(type: 'char'|'int'|'float', size: number){
        if (type == 'char'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        } else if (type == 'int'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        } else if (type == 'float'){
            let val = this._parseData(type, this._file_pos, size)
            this._file_pos += size
            return val
        }
    }

    private _file_pos: number = 0
    
    private _head: string = ''
    private _version: number = 0
    private _subversion: number = 0
    private _data: Doodad[] = []
}