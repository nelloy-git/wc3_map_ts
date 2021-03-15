import * as Buff from '../../Buff'

import { getFileDir } from "../../Utils";
import { BuffJson } from "../JsonUtils/Buff";
import { PushData } from "./data/Push";

let __dir__ = Macro(getFileDir())
let json = new BuffJson(__dir__ + '/json/Push.json')

let Data = new Buff.TData<[vel_x: number, vel_y: number]>()
Data.name = (buff) => {return json.name}
Data.icon = (buff) => {return json.icon}
Data.tooltip = (buff) => {return json.tooltip}

let Duration = new Buff.TDuration<[vel_x: number, vel_y: number]>()

Duration.start = (buff) => {
    buff.Data.owner.pause = true
    new PushData(buff, buff.Data.user_data)
}

Duration.period = (buff) => {
    let data = PushData.get(buff)
    data.period()

    if (data.status != 'OK'){
        buff.Dur.cancel()
    }
}

Duration.cancel = (buff) => {
    buff.Data.owner.pause = false
    PushData.get(buff).destroy()
}

Duration.finish = Duration.cancel

export let Push = new Buff.TBuff(Data, Duration)