import { int2id, Log } from "../../Utils";
import { File } from "../File";
import { byte2id } from "../Utils";
import { newDoodad, Doodad } from "./Doodad";

export class dooFile extends File<Doodad> {

    get head(){return this._head}
    get version(){return this._version}
    get subversion(){return this._subversion}
    
    open(path: string){
        super.open(path)
        this._parse()
    }

    protected _parse(){
        let list: Doodad[] = []

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
            let unknown = this._parseNext('int', 4) // Pass 4 unknown bytes
            let drop_table_size = this._parseNext('int', 4) // TODO pass drop tables
            unknown = this._parseNext('int', 8) // Pass 8 unknown bytes

            // print(scale_x, scale_y, scale_z)
            let data = newDoodad(id, x, y, z, a, variation, scale_x, scale_y, scale_z)
            list.push(data)
        }

        // print(this._file_pos, this._raw_data.length)
        return list
    }
    
    private _head: string = ''
    private _version: number = 0
    private _subversion: number = 0
}