
import { FileBinary } from "../../Utils"
import { Obj } from "../Obj"
import { float2byte, int2byte } from "../Utils"

export class Doodad extends Obj {

    static fromBinary(file: FileBinary){
        let dood = new Doodad()
        dood.id = file.readChar(4)
        dood.var = file.readInt(4)
        dood.pos = [file.readFloat(), file.readFloat(), file.readFloat()]
        dood.yaw = file.readFloat()
        dood.scale = [file.readFloat(), file.readFloat(), file.readFloat()]
        dood.flags = file.readChar(1)
        dood.life = file.readChar(1).charCodeAt(0) / 256
        
        file.readInt(4) // Pass 4 unknown bytes
        file.readInt(4) // Pass drop tables
        file.readInt(4) // Pass 4 unknown bytes
        file.readInt(4) // Pass 4 unknown bytes

        return dood
    }

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

    get id(){ return this.__id }
    set id(id: string){
        this.__id = id.slice(0, 4)
    }

    get flags(){ return this.__flags }
    set flags(flags: string){
        this.__flags = flags.slice(0, 1)
    }

    var: number = 0
    pos: [number, number, number] = [0, 0, 0]
    yaw: number = 0
    scale: [number, number, number] = [0, 0, 0]
    life: number = 0

    private __id: string = ''
    private __flags: string = ''
}