import { Color, FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { int2byte, str2byte } from "../Utils";
import { w3iFog } from './Fog'

export class w3iEnviroment extends Obj{
    static fromBinary(file: FileBinary){
        let env = new w3iEnviroment()

        env.weather = file.readInt(4)
        env.custom_sound = file.readString()
        env.tileset_of_light = file.readChar(1)

        env.water_color = new Color(file.readChar(1).charCodeAt(0),
                                    file.readChar(1).charCodeAt(0),
                                    file.readChar(1).charCodeAt(0),
                                    file.readChar(1).charCodeAt(0))

        return env
    }

    toBinary(){
        return int2byte(this.weather)
               + str2byte(this.custom_sound)
               + this.tileset_of_light.charAt(0)
               + this.water_color.toBinary()
    }

    weather: number = 0 // TerrainArt/Weather.slk
    custom_sound: string = ''
    tileset_of_light: string = ''
    water_color: Color = new Color()
}