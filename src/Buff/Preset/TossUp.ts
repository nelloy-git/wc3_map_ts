import { hEffect, hItem } from "../../Handle";
import { Log, id2int } from "../../Utils";
import { TBuff } from "../Buff";
import { Duration } from "../Buff/Duration";
import { TData } from "../Type/Data";
import { TDuration } from "../Type/Duration";
import { TossUpData } from "./Data/TossUp";

let NAME = 'Toos Up'
let ICON = 'ReplaceableTextures\\CommandButtons\\BTNAttackGround.blp'
let TOOLTIP = 'T\no\no\nl\nt\ni\np'

let TDat = new TData<[height: number]>()
TDat.name = ()=>{return NAME}
TDat.icon = ()=>{return ICON}
TDat.tooltip = ()=>{return TOOLTIP}

let TDur = new TDuration<[height: number]>()

TDur.start = buff => {
    let targ = buff.Data.owner
    let height = buff.Data.user_data[0]
    targ.pause = true

    new TossUpData(buff, height, buff.Dur.Timer.fullTime, Duration.period)
}

TDur.period = buff => {
    let data = TossUpData.get(buff)
    if (!data){
        return Log.err(buff.Data.name + 
                       ': data is undefined.')
    }
    data.move()
}

TDur.cancel = buff => {
    let targ = buff.Data.owner
    targ.pause = false
    
    let data = TossUpData.get(buff)
    if (data){data.destroy()}
}

TDur.finish = TDur.cancel

export let TossUp = new TBuff(TDat, TDur)