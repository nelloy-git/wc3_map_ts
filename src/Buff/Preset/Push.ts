import { Log } from "../../Utils";
import { TBuff } from "../Buff";
import { Duration } from "../Buff/Duration";
import { TData } from "../Type/Data";
import { TDuration } from "../Type/Duration";
import { PushData } from "./Data/Push";

let NAME = 'Push'
let ICON = 'ReplaceableTextures\\CommandButtons\\BTNGolemThunderclap.blp'
let TOOLTIP = 'T\no\no\nl\nt\ni\np'

let TDat = new TData<[vel_x: number, vel_y: number]>()
TDat.name = ()=>{return NAME}
TDat.icon = ()=>{return ICON}
TDat.tooltip = ()=>{return TOOLTIP}

let TDur = new TDuration<[vel_x: number, vel_y: number]>()

TDur.start = buff => {
    let targ = buff.Data.owner
    targ.pause = true

    let [vel_x, vel_y] = buff.Data.user_data
    new PushData(buff, vel_x, vel_y, buff.Dur.Timer.fullTime, Duration.period)
}

TDur.period = buff => {
    let data = PushData.get(buff)
    if (!data){
        return Log.err(buff.Data.name + 
                       ': data is undefined.')
    }

    let status = (<PushData>data).move()
    if (status == 'COLLISION' || status == 'FINISH'){
        buff.Dur.cancel()
    }
}

TDur.cancel = buff => {
    let targ = buff.Data.owner
    targ.pause = false
    
    let data = PushData.get(buff)
    if (!data){
        return Log.err(NAME + 
                       ': data is undefined.')
    }
    data.destroy()
}

TDur.finish = TDur.cancel

export let Push = new TBuff(TDat, TDur)