import { FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { int2byte, str2byte } from "../Utils";

export class w3iForceData extends Obj {

    static fromBinary(file: FileBinary){
        let force = new w3iForceData()

        let flags = file.readInt(4)
        force.allied = (flags & 0x0001) != 0
        force.allied_victory = (flags & 0x0002) != 0
        force.share_vision = (flags & 0x0004) != 0
        force.share_unit_control = (flags & 0x0008) != 0
        force.share_advanced_control = (flags & 0x0010) != 0

        let players = file.readInt(4)
        let val = 0x0001
        for (let i = 0; i < 32; i++){
            if ((players & val) != 0){
                force.players.push(i)
            }
            val *= 2
        }

        force.name = file.readString()

        return force
    }

    toBinary(){
        let flags = 0
        if (this.allied){flags = flags | 0x0001}
        if (this.allied_victory){flags = flags | 0x0002}
        if (this.share_vision){flags = flags | 0x0004}
        if (this.share_unit_control){flags = flags | 0x0008}
        if (this.share_advanced_control){flags = flags | 0x0010}

        let players = 0
        for (let pl of this.players){
            players += Math.pow(2, pl)
        }

        return int2byte(flags)
               + int2byte(players)
               + str2byte(this.name)
    }

    name: string = ''

    allied: boolean = false
    allied_victory: boolean = false
    share_vision: boolean = false
    share_unit_control: boolean = false
    share_advanced_control: boolean = false

    players: number[] = []
}