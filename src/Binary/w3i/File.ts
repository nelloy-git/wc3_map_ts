import { FileBinary } from "../../Utils";
import { File } from "../File";
import { float2byte, int2byte } from '../Utils';

import { w3iPlayerData } from "./Player";
import { w3iForceData } from "./Force";

export class w3iFile extends File<w3iPlayerData> {

    static fromBinary(file: FileBinary){
        file.startReading()
        let w3i = new w3iFile()

        w3i.file_format = file.readInt(4)
        file.readInt(4) // unknown
        file.readInt(4) // unknown
        w3i.version = tostring(file.readInt(4)) + '.' + tostring(file.readInt(4)) + '.' + 
                      tostring(file.readInt(4)) + '.' + tostring(file.readInt(4))

        w3i.name = file.readString()
        w3i.author = file.readString()
        w3i.description = file.readString()
        w3i.players_commended = file.readString()

        for (let i = 0; i < 8; i++){
            w3i.camera_bounds[i] = file.readFloat()
        }
        for (let i = 0; i < 4; i++){
            w3i.camera_bounds_complements[i] = file.readInt(4)
        }
        w3i.playable_width = file.readInt(4)
        w3i.playable_height = file.readInt(4)
        w3i.flags = file.readInt(4)
        w3i.main_ground = file.readChar(1)

        w3i.loading_screen_backgound = file.readInt(4)
        w3i.loading_screen_model = file.readString()
        w3i.loading_screen_text = file.readString()
        w3i.loading_screen_title = file.readString()
        w3i.loading_screen_subtitle = file.readString()

        w3i.game_data_set = file.readInt(4)
        w3i.prologue_screen_path = file.readString()
        w3i.prologue_screen_text = file.readString()
        w3i.prologue_screen_title = file.readString()
        w3i.prologue_screen_subtitle = file.readString()

        w3i.uses_terrain_fog = file.readInt(4)
        w3i.fog_start_height = file.readFloat()
        w3i.fog_end_height = file.readFloat()
        w3i.fog_density = file.readFloat()
        w3i.fog_red = file.readInt(1)
        w3i.fog_green = file.readInt(1)
        w3i.fog_blue = file.readInt(1)
        w3i.fog_alpha = file.readInt(1)

        w3i.weather = file.readInt(4)
        w3i.custom_sound = file.readString()
        w3i.tileset_of_light = file.readChar(1)
        w3i.water_red = file.readInt(1)
        w3i.water_green = file.readInt(1)
        w3i.water_blue = file.readInt(1)
        w3i.water_alpha = file.readInt(1)

        let max_pl = file.readInt(4)
        for (let i = 0; i < max_pl; i++){
            w3i.objects.push(w3iPlayerData.fromBinary(file))
        }

        // let max_forces = file.readInt(4)
        // for (let i = 0; i < max_forces; i++){
        //     w3i.forces.push(w3iForceData.fromBinary(file))
        // }

        // let udp_count = file.readInt(4)
        // let tech_count = file.readInt(4)
        // let utbl_count = file.readInt(4)
        // let itbl_count = file.readInt(4)

        file.finishReading()
        return w3i
    }

    toBinary(){
        let raw = ''

        return raw
    }
    
    file_format: number = 0
    saves: number = 0
    version: string = ''

    name: string = ''
    author: string = ''
    description: string = ''
    players_commended: string = ''

    camera_bounds: number[] = []
    camera_bounds_complements: number[] = []
    playable_width: number = 0
    playable_height: number = 0
    flags: number = 0
    main_ground: string = ''
    loading_screen_backgound: number = 0
    loading_screen_model: string = ''
    loading_screen_text: string = ''
    loading_screen_title: string = ''
    loading_screen_subtitle: string = ''
    game_data_set: number = 0
    prologue_screen_path: string = ''
    prologue_screen_text: string = ''
    prologue_screen_title: string = ''
    prologue_screen_subtitle: string = ''
    uses_terrain_fog: number = 0
    fog_start_height: number = 0
    fog_end_height: number = 0
    fog_density: number = 0
    fog_red: number = 0
    fog_green: number = 0
    fog_blue: number = 0
    fog_alpha: number = 0
    weather: number = 0
    custom_sound: string = ''
    tileset_of_light: string = ''
    water_red: number = 0
    water_green: number = 0
    water_blue: number = 0
    water_alpha: number = 0

    forces: w3iForceData[] = []
}