import * as Buff from '../../Buff'

import { getFileDir } from "../../Utils";
import { BuffJsonData } from "../JsonUtils";
import { TossUpData } from "./data/TossUp";

let __dir__ = Macro(getFileDir())
let json = new BuffJsonData(__dir__ + '/json/TossUp.json')

let Data = new Buff.TData<[height: number]>()
Data.name = (buff) => {return json.name}
Data.icon = (buff) => {return json.icon}
Data.tooltip = (buff) => {return json.tooltip}

let Duration = new Buff.TDuration<[height: number]>()

Duration.start = (buff) => {
    buff.Data.owner.pause = true
    new TossUpData(buff, buff.Data.user_data[0])
}

Duration.period = (buff) => {
    TossUpData.get(buff).period()
}

Duration.cancel = (buff) => {
    buff.Data.owner.pause = false
    TossUpData.get(buff).destroy()
}

Duration.finish = Duration.cancel

export let TossUp = new Buff.TBuff(Data, Duration)