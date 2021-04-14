import * as Abil from '../../../AbilityExt'
import * as Buff from '../../../Buff'
import * as Params from '../../../Parameter'

import { BuffTData } from '../BuffTData'
import { BuffJson } from "../../JsonUtils/Buff";

import { Acid as Cached } from '../json'

//========

// Init
const BUFF_CACHED = BuffJson.load(Cached)
const TData = new BuffTData(BUFF_CACHED)
const TDur = new Buff.TDuration<[reduce_PDEF: number]>()

//========

TDur.start = (buff) => {
    let owner = buff.Data.owner
    let val = buff.Data.user_data[0]
    let params = Params.UnitContainer.get(owner)

    if (params){
        params.add('PDEF', 'ADD', -val)
    }
}

//========

TDur.addStack = (buff, other) => {
    let owner = buff.Data.owner
    let extra_val = other.Data.user_data[0]
    buff.Data.user_data[0] += extra_val
    let params = Params.UnitContainer.get(owner)

    if (params){
        params.add('PDEF', 'ADD', -extra_val)
    }
}

//========

TDur.period = () => {}

//========

TDur.cancel = () => {}

//========

TDur.finish = (buff) => {
    let owner = buff.Data.owner
    let val = buff.Data.user_data[0]
    let params = Params.UnitContainer.get(owner)

    if (params){
        params.add('PDEF', 'ADD', val)
    }
}

//========

export let Acid = new Buff.TBuff(TData, TDur)