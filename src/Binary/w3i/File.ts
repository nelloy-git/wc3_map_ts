import { Color, FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { float2byte, int2byte } from '../Utils';

import { w3iMapInfo } from './MapInfo'
import { w3iLoadingScreen } from './LoadingScreen'
import { w3iPrologueScreen } from './PrologueScreen'
import { w3iFog } from './Fog'
import { w3iEnviroment } from './Enviroment'
import { w3iPlayerData } from "./Player";
import { w3iForceData } from "./Force";

export class w3iFile extends Obj {

    static fromBinary(file: FileBinary){
        file.startReading()
        let w3i = new w3iFile()

        w3i.file_format = file.readInt(4)

        if (w3i.file_format != 31){
            print('Unknown w3i format.')
        }

        w3i.unknown_byte_1 = file.readInt(4)
        w3i.unknown_byte_2 = file.readInt(4)

        w3i.info = w3iMapInfo.fromBinary(file)
        w3i.loading = w3iLoadingScreen.fromBinary(file)

        w3i.game_data_set = file.readInt(4)
        w3i.prologue = w3iPrologueScreen.fromBinary(file)

        w3i.fog = w3iFog.fromBinary(file)
        w3i.env = w3iEnviroment.fromBinary(file)

        w3i.unknown_byte_3 = file.readInt(4)
        w3i.unknown_byte_4 = file.readInt(4)
        w3i.unknown_byte_5 = file.readInt(4)

        let max_pl = file.readInt(4)
        for (let i = 0; i < max_pl; i++){
            w3i.players.push(w3iPlayerData.fromBinary(file))
        }

        let max_forces = file.readInt(4)
        for (let i = 0; i < max_forces; i++){
            w3i.forces.push(w3iForceData.fromBinary(file))
        }

        // TODO
        // let upd_count = file.readInt(4)
        // let tech_count = file.readInt(4)
        // let utbl_count = file.readInt(4)
        // let itbl_count = file.readInt(4)

        file.finishReading()
        return w3i
    }

    toBinary(){
        let raw = ''

        raw += int2byte(this.file_format)
        raw += int2byte(this.unknown_byte_1)
        raw += int2byte(this.unknown_byte_2)
        raw += this.info.toBinary()
        raw += this.loading.toBinary()
        raw += int2byte(this.game_data_set)
        raw += this.prologue.toBinary()
        raw += this.fog.toBinary()
        raw += this.env.toBinary()
        raw += int2byte(this.unknown_byte_3)
        raw += int2byte(this.unknown_byte_4)
        raw += int2byte(this.unknown_byte_5)
        raw += int2byte(this.players.length)
        for (let i = 0; i < this.players.length; i++){
            raw += this.players[i].toBinary()
        }
        raw += int2byte(this.forces.length)
        for (let i = 0; i < this.forces.length; i++){
            raw += this.forces[i].toBinary()
        }

        // TODO
        raw += int2byte(this.updates.length)
        raw += int2byte(this.techs.length)
        raw += int2byte(this.unit_tbls.length)
        raw += int2byte(this.item_tbls.length)

        return raw
    }
    
    file_format: number = 31
    game_data_set: number = 0   // ? used game data set (index in the preset list, 0 = standard)

    info: w3iMapInfo = new w3iMapInfo()
    loading: w3iLoadingScreen = new w3iLoadingScreen()
    prologue: w3iPrologueScreen = new w3iPrologueScreen()

    fog: w3iFog = new w3iFog()
    env: w3iEnviroment = new w3iEnviroment()

    players: w3iPlayerData[] = []
    forces: w3iForceData[] = []

    // TODO
    updates: void[] = []
    techs: void[] = []
    unit_tbls: void[] = []
    item_tbls: void[] = []

    unknown_byte_1: number = 6
    unknown_byte_2: number = 6112
    unknown_byte_3: number = 1
    unknown_byte_4: number = 3
    unknown_byte_5: number = 2
}