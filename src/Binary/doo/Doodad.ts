import * as Json from '../../Json'

import { FileBinary } from "../../Utils"
import { Obj } from "../Obj"
import { float2byte, int2byte } from "../Utils"

export class Doodad extends Obj {

    toBinary(){
        let raw = ''

        raw += this.id
        raw += int2byte(this.var)
        raw += float2byte(this.pos[0]) + float2byte(this.pos[1]) + float2byte(this.pos[2])
        raw += float2byte(this.yaw)
        raw += float2byte(this.scale[0]) + float2byte(this.scale[1]) + float2byte(this.scale[2])
        raw += this.flags
        raw += String.fromCharCode(math.ceil(256 * this.life))

        raw += '\0\0\0\0' // unknown
        raw += '\0\0\0\0' // drop table size
        raw += '\0\0\0\0' // unknown
        raw += '\0\0\0\0' // unknown

        return raw
    }

    fromBinary(file: FileBinary){
        this.id = file.readChar(4)
        this.var = file.readInt(4)
        this.pos = [file.readFloat(), file.readFloat(), file.readFloat()]
        this.yaw = file.readFloat()
        this.scale = [file.readFloat(), file.readFloat(), file.readFloat()]
        this.flags = file.readChar(1)
        this.life = file.readChar(1).charCodeAt(0) / 256
        
        file.readInt(4) // Pass 4 unknown bytes
        file.readInt(4) // Pass drop tables
        file.readInt(4) // Pass 4 unknown bytes
        file.readInt(4) // Pass 4 unknown bytes
    }

    toJson(){
        let json = {
            id: this.id,
            v: this.var,
            p: this.pos,
            a: this.yaw,
            s: this.scale,
            f: this.flags,
            l: this.life
        }

        return json
    }

    fromJson(json: LuaTable){
        this.id = Json.Read.String(json, 'id')
        this.var = Json.Read.Number(json, 'v')
        this.pos = <[number, number, number]>Json.Read.NumberArray(json, 'p')
        this.yaw = Json.Read.Number(json, 'a')
        this.scale = <[number, number, number]>Json.Read.NumberArray(json, 's')
        this.flags = Json.Read.String(json, 'f')
        this.life = Json.Read.Number(json, 'l')
    }

    get id(){ return this._id }
    set id(id: string){
        this._id = id.slice(0, 4)
    }

    get flags(){ return this._flags }
    set flags(flags: string){
        this._flags = flags.slice(0, 1)
    }

    var: number = 0
    pos: [number, number, number] = [0, 0, 0]
    yaw: number = 0
    scale: [number, number, number] = [0, 0, 0]
    life: number = 0

    private _id: string = ''
    private _flags: string = ''
}