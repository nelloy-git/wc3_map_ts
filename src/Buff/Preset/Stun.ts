import { hEffect } from "../../Handle";
import { Log } from "../../Utils";
import { TBuff } from "../Buff";
import { TData } from "../Type/Data";
import { TDuration } from "../Type/Duration";
import { StunData } from "./Data/Stun";

let NAME = 'Stun'
let ICON = 'ReplaceableTextures\\CommandButtons\\BTNStun.blp'
let TOOLTIP = 'T\no\no\nl\nt\ni\np'
let MODEL = 'Abilities\\Spells\\Human\\Thunderclap\\ThunderclapTarget.mdl'

let TDat = new TData<hEffect | undefined>()
TDat.name = ()=>{return NAME}
TDat.icon = ()=>{return ICON}
TDat.tooltip = ()=>{return TOOLTIP}

let TDur = new TDuration<hEffect | undefined>()

TDur.start = buff => {
    let targ = buff.Data.owner
    targ.pause = true

    new StunData(buff, MODEL)
}

TDur.period = buff => {
    let data = StunData.get(buff)
    if (!data){
        return Log.err(buff.Data.name + 
                       ': data is undefined.')
    }
    data.move()
}

TDur.cancel = buff => {
    let targ = buff.Data.owner
    targ.pause = false

    let data = StunData.get(buff)
    if (data){data.destroy()}
}

TDur.finish = TDur.cancel

export let Stun = new TBuff(TDat, TDur)