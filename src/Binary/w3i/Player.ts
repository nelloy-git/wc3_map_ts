import { FileBinary } from "../../Utils";
import { Obj } from "../Obj";

export class w3iPlayerData extends Obj {

    static fromBinary(file: FileBinary){
        let pl_data = new w3iPlayerData()

        pl_data.id = file.readInt(4)
        pl_data.type = file.readInt(4)
        pl_data.race = file.readInt(4)
        pl_data.fixed_start_pos = file.readInt(4)
        pl_data.name = file.readString()
        pl_data.start_x = file.readFloat()
        pl_data.start_y = file.readFloat()
        pl_data.ally_low_flags = file.readInt(4)
        pl_data.ally_high_flags = file.readInt(4)

        return pl_data
    }

    toBinary(){
        let raw = ''

        return raw
    }

    id: number = -1
    type: number = -1
    race: number = -1
    fixed_start_pos: number = 1
    name: string = ''
    start_x: number = 0
    start_y: number = 0
    ally_low_flags: number = 0
    ally_high_flags: number = 0
}