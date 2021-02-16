import * as Buff from '../../Buff'

import { getFileDir } from "../../Utils";
import { BuffJsonData } from "../JsonUtils";
import { StunData } from './data/Stun'

let __dir__ = Macro(getFileDir())
let json = new BuffJsonData(__dir__ + '/json/Stun.json')

let Data = new Buff.TData<undefined>()
Data.name = (buff) => {return json.name}
Data.icon = (buff) => {return json.icon}
Data.tooltip = (buff) => {return json.tooltip}

let Duration = new Buff.TDuration<undefined>()

Duration.start = (buff) => {
    buff.Data.owner.pause = true
    new StunData(buff, json.get('model'))
}

Duration.period = (buff) => {
    StunData.get(buff).period()
}

Duration.cancel = (buff) => {
    buff.Data.owner.pause = false
    StunData.get(buff).destroy()
}

Duration.finish = Duration.cancel

export let Stun = new Buff.TBuff(Data, Duration)
