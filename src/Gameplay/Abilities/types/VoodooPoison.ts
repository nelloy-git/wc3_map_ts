import * as Abil from "../../../AbilityExt";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { Vec2 } from "../../../Utils";

import { AbilityData, getJson } from "../AbilityData";
import { AbilityJson } from "../../JsonUtils";

import { VoodooPoison as Cached } from '../json'
import { VoodooPoison as CastData } from '../data'

//========

// Scales 
const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'dmg'
const SCALE_DUR = 'dur'
const SCALE_TICKS_PER_SEC = 'ticksPerSec'

// Extra
const ANIM_CAST = ['animation', 'cast']
const ANIM_CAST_DEFAULT_DUR = ['animation', 'castDefaultDur']

// Init
const ABIL_CACHED = AbilityJson.load(Cached,
    [SCALE_CAST_TIME, SCALE_DMG, SCALE_DUR, SCALE_TICKS_PER_SEC],
    [ANIM_CAST, ANIM_CAST_DEFAULT_DUR])
const TData = new AbilityData(ABIL_CACHED)
const Casting = new Abil.TCasting<[Vec2]>()

//========

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    let json = getJson(abil)
    let data = new CastData(abil, caster, target[0], abil.Data.area)
    
    caster.pause = true
    caster.angle = data.angle

    caster.animation = json.extra.get(ANIM_CAST)
    caster.animation_scale =  json.extra.get(ANIM_CAST_DEFAULT_DUR) / abil.Casting.Timer.fullTime
}

//========

Casting.casting = (abil, target) => {
    let data = CastData.get(abil)
    data.progress = 1 - (abil.Casting.Timer.left / abil.Casting.Timer.fullTime)
}

//========

Casting.cancel = clear

//========

Casting.interrupt = clear

//========

Casting.finish = (abil) => {
    let caster = abil.Data.owner
    let data = CastData.get(abil)
    let json = getJson(abil)

    let params = Param.UnitContainer.get(caster)
    let dur = json.getScaled(SCALE_DUR, params)
    let ticks_per_sec = json.getScaled(SCALE_TICKS_PER_SEC, params)
    let dmg = json.getScaled(SCALE_DMG, params)

    stopAnim(caster)
    data.detach()

    let t = new hTimer()
    t.addAction(t => {
        data.time += t.timeout
        if (data.time >= dur){
            data.destroy()
            t.destroy()
        }
        
        let in_range = hUnit.getInRange(data.target, data.area)
        for (const targ of in_range){
            if (targ.isAlly(caster)){continue} 
            Param.Damage.deal(caster, targ, dmg, 'MSPL')
        }
    })
    t.start(1 / ticks_per_sec, true)
}

//========

Casting.castingTime = (abil, target) => {
    let params = Param.UnitContainer.get(abil.Data.owner)
    let json = getJson(abil)

    return json.getScaled(SCALE_CAST_TIME, params)
}

//========

Casting.isTargetValid = (abil, target) => {return true}

//========

function stopAnim(u: hUnit){
    u.pause = false
    u.animation = 'stand'
    u.animation_scale = 1
}

function clear(abil: Abil.IFace<[Vec2]>){
    let data = CastData.get(abil)
    if (data){
        data.detach()
        data.destroy()
    }
    stopAnim(abil.Data.owner)
}

export let VoodooPoison = new Abil.TAbility(Casting, TData, Abil.TTargetingArea)