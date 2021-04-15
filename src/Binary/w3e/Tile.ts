import { FileBinary } from "../../Utils";
import { Obj } from "../Obj"
import { int2byte } from '../Utils';

export class Tile extends Obj {

    static fromBinary(file: FileBinary){
        let tile = new Tile()

        let h = file.readInt(2)
        let water_and_boundary = file.readInt(2)
        let flags_and_id = file.readChar(1).charCodeAt(0)
        let texture_detail = file.readChar(1).charCodeAt(0)
        let cliff_and_layer = file.readChar(1).charCodeAt(0)

        tile.id_pos = flags_and_id & 0x0F
        tile.z = (h - 8192 + ((cliff_and_layer & 0x0F) - 2) * 256) / 4
        tile.water = ((water_and_boundary & 0x3FFF) - 8192) / 4 - 90

        return  tile
    }

    toBinary(){
        let raw = ''

        raw += int2byte(this.z, 2)
        raw += int2byte(this.water, 2) // TODO boundary flag
        raw += this.id_pos & 0x0F // flags == 0
        raw += '\0'
        raw += '\0'

        return raw
    }

    id_pos: number = 0
    z: number = 0
    water: number = 0
}