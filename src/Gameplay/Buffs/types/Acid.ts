import * as Abil from '../../../AbilityExt'
import * as Buff from '../../../Buff'
import * as Params from '../../../Parameter'

import { BuffData } from '../BuffData'
import { BuffJson } from "../../JsonUtils/Buff";

import { Acid as Cached } from '../json'

//========

const IS_STACKABLE = ['stackable']
const APPEND_DUR = ['appendDur']

// Init
const BUFF_CACHED = BuffJson.load(Cached,
    [IS_STACKABLE, APPEND_DUR])
const TData = new BuffData(BUFF_CACHED)
const TDur = new Buff.TDuration<[reduce_PDEF: number]>()

//========

TDur.start = (buff) => {
    let owner = buff.Data.owner
    let val = buff.Data.user_data[0]

    if (BUFF_CACHED.extra.get(IS_STACKABLE)){
        let buffs = <Buff.Container>Buff.Container.get(owner)
        let main_buff = buffs.find(Acid)

        // No stacks found
        if (!main_buff){
            let params = Params.UnitContainer.get(owner)
            if (params){
                params.add('PDEF', 'ADD', -val)
            } else {
                buff.Dur.cancel()
            }
            return
        }

        // Apply debuff
        let params = Params.UnitContainer.get(owner)
        if (params){
            main_buff.Data.user_data[0] += val
            params.add('PDEF', 'ADD', -val)
        } else {
            buff.Dur.cancel()
        }

        if (BUFF_CACHED.extra.get(APPEND_DUR)){
            main_buff.Dur.Timer.left += buff.Dur.Timer.left
        } else {
            main_buff.Dur.Timer.left = math.max(main_buff.Dur.Timer.left, buff.Dur.Timer.left)
        }
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