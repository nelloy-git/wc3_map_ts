import { FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { float2byte, int2byte, str2byte } from "../Utils";

export class w3iPlayerData extends Obj {

    static fromBinary(file: FileBinary){
        let pl = new w3iPlayerData()

        pl.id = file.readInt(4)
        pl.type = file.readInt(4)
        pl.race = file.readInt(4)
        pl.fixed_start_pos = file.readInt(4)
        pl.name = file.readString()
        pl.start_x = file.readFloat()
        pl.start_y = file.readFloat()
        pl.ally_low_flags = file.readInt(4)
        pl.ally_high_flags = file.readInt(4)
        pl.unknown_byte_1 = file.readInt(4)
        pl.unknown_byte_2 = file.readInt(4)

        return pl
    }

    toBinary(){
        return int2byte(this.id)
               + int2byte(this.type)
               + int2byte(this.race)
               + int2byte(this.fixed_start_pos)
               + str2byte(this.name)
               + float2byte(this.start_x)
               + float2byte(this.start_y)
               + int2byte(this.ally_low_flags)
               + int2byte(this.ally_high_flags)
               + int2byte(this.unknown_byte_1)
               + int2byte(this.unknown_byte_2)
    }

    id: number = -1
    type: number = -1
    race: number = -1
    fixed_start_pos: number = 1
    name: string = ''
    start_x: number = 0
    start_y: number = 0
    ally_low_flags: number = -1
    ally_high_flags: number = -1

    unknown_byte_1: number = 0
    unknown_byte_2: number = 0
}