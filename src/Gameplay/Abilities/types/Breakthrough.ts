import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { BreakthroughData } from "../data/Breakthrough";
import { Push } from '../../Buffs'
import { AbilityData, KeysTree } from "../Data";

const __dir__ = Macro(getFileDir())

const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'pushDmg'
const SCALE_PUSH_DUR = 'pushDur'
const ANIM_WALK_ID: KeysTree = ['animation', 'walk']

const TData = new AbilityData(__dir__ + '/../json/Breakthrough.json')
TData.checkScale([SCALE_CAST_TIME, SCALE_DMG, SCALE_PUSH_DUR])
TData.checkTree([ANIM_WALK_ID])

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    let data = new BreakthroughData(abil, caster, target[0])

    caster.pause = true
    caster.angle = data.angle
    caster.animation = AbilityData.getJson(abil).getNumber(ANIM_WALK_ID, 0)
}

Casting.casting = (abil, target) => {
    let caster = abil.Data.owner
    let data = BreakthroughData.get(abil)

    // Wait caster turning
    if (caster.angle < data.angle - 0.1 || caster.angle > data.angle + 0.1){
        return
    }

    // Moving caster
    const status = data.move()
    if (status == BreakthroughData.Status.COLLISION){
        return abil.Casting.cancel()
    } else if (status == BreakthroughData.Status.FINISHED){
        return abil.Casting.finish()
    }

    // Push nearly enemies
    let params = Param.UnitContainer.get(caster)
    let json = AbilityData.getJson(abil)

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

function getPushVel(caster: hUnit, target: hUnit, vel: number){
    return target.pos.sub(caster.pos).norm.mult(1.5 * vel / Abil.Casting.period)
}

function clear(abil: Abil.IFace<[Vec2]>){
    BreakthroughData.get(abil).destroy()

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
}

Casting.cancel = (abil) => {clear(abil)}
Casting.interrupt = (abil) => {clear(abil)}
Casting.finish = (abil) => {clear(abil)}
Casting.castingTime = (abil, target) => {
    let caster = abil.Data.owner
    let params = Param.UnitContainer.get(caster)

    let delta = target ? target[0].sub(caster.pos) : new Vec2(-math.pi, 0)
    let angle = delta.angle
    angle = Math.min(angle, 2 * math.pi - angle)
    let turn_time = 0.5 * angle / math.pi

    let cast_time = AbilityData.getJson(abil).getScaled(SCALE_CAST_TIME, params)

    return turn_time + cast_time
}
Casting.isTargetValid = (abil, target) => {return true}

export let Breakthrough = new Abil.TAbility(Casting, TData, Abil.TTargetingLine)