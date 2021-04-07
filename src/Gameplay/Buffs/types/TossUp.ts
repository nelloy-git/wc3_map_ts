import * as Abil from '../../../AbilityExt'
import * as Buff from '../../../Buff'

import { BuffTData } from '../BuffTData'
import { BuffJson } from "../../JsonUtils/Buff";

import { TossUp as DurData } from "../data";
import { TossUp as Cached } from '../json'

//========

// Init
const BUFF_CHACHED = BuffJson.load(Cached)
const TData = new BuffTData(BUFF_CHACHED)
const TDur = new Buff.TDuration<[height: number]>()

//========

TDur.start = (buff) => {
    let owner = buff.Data.owner
    let height = buff.Data.user_data[0]
    let data = new DurData(buff, height)

    owner.pause = true
    let casting = Abil.Casting.getActive(owner)
    if (casting){
        casting.Casting.interrupt()
    }
}

//========

TDur.period = (buff) => {
    DurData.get(buff).period()
}

//========

TDur.cancel = clear

//========

TDur.finish = clear

//========

function clear(buff: Buff.IFace<[number]>){
    buff.Data.owner.pause = false
    DurData.get(buff).detach()
}

export let TossUp = new Buff.TBuff(TData, TDur)