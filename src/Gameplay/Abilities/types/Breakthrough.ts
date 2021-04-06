import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hUnit } from "../../../Handle";
import { Vec2 } from "../../../Utils";

import { AbilityData, getJson } from "../AbilityData";
import { AbilityJson } from "../../JsonUtils";

import { Breakthrough as Cached } from '../json'
import { Breakthrough as CastData } from '../data'
import { Push } from '../../Buffs'

//========

// Scales 
const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'pushDmg'
const SCALE_PUSH_DUR = 'pushDur'

// Extra
const ANIM_WALK_ID = ['animation', 'walk']

// Init
const ABIL_CACHED = AbilityJson.load(Cached,
    [SCALE_CAST_TIME, SCALE_DMG, SCALE_PUSH_DUR],
    [ANIM_WALK_ID])
const TData = new AbilityData(ABIL_CACHED)
const Casting = new Abil.TCasting<[Vec2]>()

//========

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    let json = getJson(abil)
    let data = new CastData(abil, caster, target[0])
    
    caster.pause = true
    caster.angle = data.angle
    caster.animation = json.extra.get(ANIM_WALK_ID)
}

//========

Casting.casting = (abil, target) => {
    let caster = abil.Data.owner
    let data = CastData.get(abil)

    // Wait caster turning
    if (caster.angle < data.angle - 0.1 || caster.angle > data.angle + 0.1){
        return
    }

    // Moving caster
    const status = data.move()
    if (status == CastData.Status.COLLISION){
        return abil.Casting.cancel()
    } else if (status == CastData.Status.FINISHED){
        return abil.Casting.finish()
    }

    // Push nearly enemies
    let params = Param.UnitContainer.get(caster)
    let json = getJson(abil)

    let in_range = hUnit.getInRange(caster.pos, abil.Data.area)
    for (const unit of in_range){
        if (caster.isAlly(unit) || data.pushed.includes(unit)){continue}

        // Push
        let buffs = Buff.Container.get(unit)
        let push_dur = json.getScaled(SCALE_PUSH_DUR, params)

        if (buffs){
            let vel = getPushVel(caster, unit, data.vel.length)
            buffs.add(caster, push_dur, Push, [vel])
        }
        
        // Damage
        let dmg = json.getScaled(SCALE_DMG, params)
        Param.Damage.deal(caster, unit, dmg, 'PSPL', WEAPON_TYPE_WHOKNOWS)

        data.pushed.push(unit)
    }
}

//========

Casting.cancel = clear

//========

Casting.interrupt = clear

//========

Casting.finish = clear

//========

Casting.castingTime = (abil, target) => {
    let caster = abil.Data.owner
    let params = Param.UnitContainer.get(caster)

    let delta = target ? target[0].sub(caster.pos) : new Vec2(-math.pi, 0)
    let angle = math.abs(delta.angle - caster.angle)
    angle = Math.min(angle, 2 * math.pi - angle)
    let turn_time = 0.5 * angle / math.pi

    let cast_time = getJson(abil).getScaled(SCALE_CAST_TIME, params)

    return turn_time + cast_time
}

//========

Casting.isTargetValid = (abil, target) => {return true}

//========

function getPushVel(caster: hUnit, target: hUnit, vel: number){
    return target.pos.sub(caster.pos).norm.mult(1.5 * vel / Abil.Casting.period)
}

function clear(abil: Abil.IFace<[Vec2]>){
    CastData.get(abil).detach()

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
}

export let Breakthrough = new Abil.TAbility(Casting, TData, Abil.TTargetingLine)