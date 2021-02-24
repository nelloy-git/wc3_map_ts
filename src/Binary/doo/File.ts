import { File } from "../File";
import { Doodad } from "./Doodad";

export class dooFile extends File<Doodad> {

    get head(){return this._head}
    get version(){return this._version}
    get subversion(){return this._subversion}

    protected _parse(){
        let list: Doodad[] = []

        this._head = this._readChar(4)
        this._version = this._readInt(4)
        this._subversion = this._readInt(4)

        let count = this._readInt(4)
        for (let i = 0; i < count; i++){
            let id = this._readChar(4)
            let variation = this._readInt(4)
            let x = this._readFloat()
            let y = this._readFloat()
            let z = this._readFloat()
            let a = this._readFloat()
            let scale_x = this._readFloat()
            let scale_y = this._readFloat()
            let scale_z = this._readFloat()
            let flags = this._readChar(1)
            let life = this._readChar(1)
            let unknown = this._readInt(4) // Pass 4 unknown bytes
            let drop_table_size = this._readInt(4) // Pass drop tables
            unknown = this._readInt(8) // Pass 8 unknown bytes

            // print(scale_x, scale_y, scale_z)
            let data = Doodad.create(id, x, y, z, a, variation, scale_x, scale_y, scale_z)
            list.push(data)
        }

        // print(this._file_pos, this._raw_data.length)
        return list
    }
    
    private _head: string = ''
    private _version: number = 0
    private _subversion: number = 0
}