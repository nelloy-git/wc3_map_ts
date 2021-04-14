import * as Abil from '../../../AbilityExt'
import * as Buff from '../../../Buff'
import { Vec2 } from "../../../../src/Utils";

import { BuffTData } from '../BuffTData'
import { BuffJson } from "../../JsonUtils/Buff";

import { Push as DurData } from "../data";
import { Push as Cached } from '../json'

//========

// Init
const BUFF_CHACHED = BuffJson.load(Cached)
const TData = new BuffTData(BUFF_CHACHED)
const TDur = new Buff.TDuration<[vel: Vec2]>()

//========

TDur.start = (buff) => {
    let owner = buff.Data.owner
    let vel = buff.Data.user_data[0]
    let data = new DurData(buff, owner, vel)

    owner.pause = true
    let casting = Abil.Casting.getActive(owner)
    if (casting){
        casting.Casting.interrupt()
    }
}

//========

TDur.period = (buff) => {
    let data = DurData.get(buff)
    if (data.move() != DurData.Status.OK){
        buff.Dur.cancel()
    }
}

//========

TDur.cancel = clear

//========

TDur.finish = clear

//========

function clear(buff: Buff.IFace<[Vec2]>){
    buff.Data.owner.pause = false
    DurData.get(buff).detach()
}

export let Push = new Buff.TBuff(TData, TDur)