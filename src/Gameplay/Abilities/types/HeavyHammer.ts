import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { AbilityData, getJson } from '../Data'
import { HeavyHammerData } from "../data/HeavyHammer";
import { TossUp } from '../../Buffs'

const __dir__ = Macro(getFileDir())

const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'dmg'
const SCALE_TOSS_DUR = 'tossDur'
const ANIM_STRIKE_ID = ['animation', 'strikeId']
const ANIM_STRIKE_START = ['animation', 'strikeStart']
const ANIM_STRIKE_END = ['animation', 'strikeEnd']
const ANIM_TOSS_HEIGHT = ['animation', 'tossHeight']

const TData = new AbilityData(__dir__ + '/../json/HeavyHammer.json',
                              [SCALE_CAST_TIME, SCALE_DMG, SCALE_TOSS_DUR],
                              [ANIM_STRIKE_END, ANIM_STRIKE_ID, ANIM_STRIKE_START, ANIM_TOSS_HEIGHT])

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    let targ = target[0]
    let data = new HeavyHammerData(abil, caster, targ, abil.Data.area)

    let delta = targ.sub(caster.pos)
    let angle = delta.angle

    caster.pause = true
    caster.angle = angle

    caster.animation = getJson(abil).data.getNumber(ANIM_STRIKE_ID, 0)
    data.cur_anim = 'START'
}

Casting.casting = (abil, target) => {
    let caster = abil.Data.owner
    let data = HeavyHammerData.get(abil)
    
    let left = abil.Casting.Timer.left
    let full = abil.Casting.Timer.fullTime
    data.progress = 1 - (left / full)

    // Animation start
    let start = getJson(abil).data.getNumber(ANIM_STRIKE_START, 0)
    if (left < full - start && data.cur_anim == 'START'){
        caster.animation_scale = 0
        data.cur_anim = 'PAUSE'
    }

    // Animation end
    let end = getJson(abil).data.getNumber(ANIM_STRIKE_END, 0)
    if (left < end && data.cur_anim == 'PAUSE'){
        caster.animation_scale = 1
        data.cur_anim = 'END'
    }
}

Casting.cancel = (abil, target) => {
    let data = HeavyHammerData.get(abil)
    
    let caster = abil.Data.owner
    caster.animation_scale = 1
    data.cur_anim = 'END'
    
    let t = new hTimer()
    t.addAction(t => {
        Casting.finish(abil, target)
        t.destroy()
    })

    let endTime = getJson(abil).data.getNumber(ANIM_STRIKE_END, 0)
    t.start(endTime, false)
}

Casting.interrupt = clearCasting

Casting.finish = (abil, target) => {
    dealDamage(abil, target[0])
    clearCasting(abil)
}

Casting.castingTime = (abil, target) => {
    let caster = abil.Data.owner
    let params = Param.UnitContainer.get(caster)

    let start = getJson(abil).data.getNumber(ANIM_STRIKE_START, 0)
    let end = getJson(abil).data.getNumber(ANIM_STRIKE_END, 0)

    let cast_time = AbilityData.getJson(abil).getScaled(SCALE_CAST_TIME, params)

    return math.max(start + end, cast_time)
}

Casting.isTargetValid = (abil, target) => {return true}

function dealDamage(abil: Abil.IFace<[Vec2]>, target: Vec2){
    let data = HeavyHammerData.get(abil)

    let caster = abil.Data.owner
    let x = caster.x
    let y = caster.y
    let a = caster.angle
    let w_a = abil.Data.area / 2
    let progr = data.progress
    let params = Param.UnitContainer.get(caster)
    let json = AbilityData.getJson(abil)

    let toss_max_dur = json.getScaled(SCALE_TOSS_DUR, params)
    let max_dmg = json.getScaled(SCALE_DMG, params)

    let in_range = hUnit.getInRange(caster.pos, abil.Data.range)
    for (let targ of in_range){
        if (caster.isAlly(targ)){continue}

        // Select cone
        let angle = Atan2(targ.y - y, targ.x - x)
        angle = angle >= 0 ? angle : 2 * math.pi + angle

        if (angle > a - w_a && angle < a + w_a){
            // Toss Up
            let buffs = Buff.Container.get(targ)
            if (buffs){
                buffs.add(caster, progr * toss_max_dur,
                          TossUp, [progr * getJson(abil).data.getNumber(ANIM_TOSS_HEIGHT)])
            }
            
            // Damage
            if (params){
                Param.Damage.deal(caster, targ, progr * max_dmg,
                                  'PSPL', WEAPON_TYPE_METAL_HEAVY_BASH)
            }
        }
    }
}

function clearCasting(abil: Abil.IFace<[Vec2]>){
    HeavyHammerData.get(abil).destroy()

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
    caster.animation_scale = 1
}

export let HeavyHammer = new Abil.TAbility(Casting, TData, Abil.TTargetingCone )