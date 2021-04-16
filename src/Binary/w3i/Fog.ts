import { Color, FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { float2byte, int2byte } from "../Utils";

export class w3iFog extends Obj{
    static fromBinary(file: FileBinary){
        let fog = new w3iFog()

        fog.terrain_type = file.readInt(4)
        fog.start_z = file.readFloat()
        fog.end_z = file.readFloat()
        fog.density = file.readFloat()
        fog.color = new Color(file.readChar(1).charCodeAt(0),
                              file.readChar(1).charCodeAt(0),
                              file.readChar(1).charCodeAt(0),
                              file.readChar(1).charCodeAt(0))


        return fog
    }

    toBinary(){
        return int2byte(this.terrain_type)
               + float2byte(this.start_z)
               + float2byte(this.end_z)
               + float2byte(this.density)
               + this.color.toBinary()
    }

    terrain_type: number = 0 // 0 -> not used, greater 0 -> index of terrain fog style
    start_z: number = 0
    end_z: number = 0
    density: number = 0
    color: Color = new Color(0, 0, 0, 255)
}