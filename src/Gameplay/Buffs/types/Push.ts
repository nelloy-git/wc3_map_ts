import * as Buff from '../../../Buff'

import { getFileDir, Vec2 } from "../../../Utils";
import { BuffJson } from "../../JsonUtils/Buff";
import { PushData } from "../data/Push";

let __dir__ = Macro(getFileDir())
let json = new BuffJson(__dir__ + '/../json/Push.json')

let Data = new Buff.TData<[vel: Vec2]>()
Data.name = (buff) => {return json.name}
Data.icon = (buff) => {return json.icon}
Data.tooltip = (buff) => {return json.tooltip}

let Duration = new Buff.TDuration<[vel: Vec2]>()

Duration.start = (buff) => {
    let owner = buff.Data.owner
    let vel = buff.Data.user_data[0]
    owner.pause = true
    new PushData(buff, owner, vel)
}

Duration.period = (buff) => {
    let data = PushData.get(buff)
    if (data.move() != PushData.Status.OK){
        buff.Dur.cancel()
    }
}

Duration.cancel = (buff) => {
    buff.Data.owner.pause = false
    PushData.get(buff).destroy()
}

Duration.finish = Duration.cancel

export let Push = new Buff.TBuff(Data, Duration)