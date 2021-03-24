import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { AbilityData, KeysTree } from '../Data'
import { HeavyHammerData } from "../Data/HeavyHammer";
import { TossUp } from '../../Buffs'

const __dir__ = Macro(getFileDir())

const SCALE_CAST_TIME = 'castTime'
const SCALE_DMG = 'dmg'
const SCALE_TOSS_DUR = 'tossDur'
const ANIM_STRIKE_ID: KeysTree = ['animation', 'strikeId']
const ANIM_STRIKE_START: KeysTree = ['animation', 'strikeStart']
const ANIM_STRIKE_END: KeysTree = ['animation', 'strikeEnd']

const TOSS_MAX_HEIGHT = 300

const TData = new AbilityData(__dir__ + '/../json/HeavyHammer.json')
TData.checkScale([SCALE_CAST_TIME, SCALE_DMG, SCALE_TOSS_DUR])
TData.checkTree([ANIM_STRIKE_END, ANIM_STRIKE_ID, ANIM_STRIKE_START])

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    let data = new HeavyHammerData(abil, caster, target[0], abil.Data.area)

    let targ = target[0]

    let dx = targ.x - caster.x
    let dy = targ.y - caster.y
    let angle = Atan2(dy, dx)

    caster.pause = true
    caster.angle = angle

    caster.animation = AbilityData.getJson(abil).getNumber(ANIM_STRIKE_ID, 0)
    data.cur_anim = 'START'
}

Casting.casting = (abil, target) => {
    let caster = abil.Data.owner
    let data = HeavyHammerData.get(abil)
    
    let left = abil.Casting.Timer.left
    let full = abil.Casting.Timer.fullTime
    data.progress = 1 - (left / full)

    // Animation start
    let start = AbilityData.getJson(abil).getNumber(ANIM_STRIKE_START, 0)
    if (left < full - start && data.cur_anim == 'START'){
        caster.animation_scale = 0
        data.cur_anim = 'PAUSE'
    }

    // Animation end
    let end = AbilityData.getJson(abil).getNumber(ANIM_STRIKE_END, 0)
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

    let endTime = AbilityData.getJson(abil).getNumber(ANIM_STRIKE_END, 0)
    t.start(endTime, false)
}

Casting.interrupt = clearCasting

Casting.finish = (abil, target) => {
    dealDamage(abil, target[0])
    clearCasting(abil)
}

Casting.castingTime = (abil, target) => {
    let caster = abil.Data.owner
    
    let angle = target ? target[0].sub(caster.pos).angle : math.pi
    angle = Math.min(angle, 2 * math.pi - angle)
    let turn_time = 0.5 * angle / math.pi

    let start = AbilityData.getJson(abil).getNumber(ANIM_STRIKE_START, 0)
    let end = AbilityData.getJson(abil).getNumber(ANIM_STRIKE_END, 0)

    let params = Param.UnitContainer.get(caster)
    let cast_time = AbilityData.getJson(abil).getScaled(SCALE_CAST_TIME, params)

    return math.max(turn_time, start + end, cast_time)
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
                          TossUp, [progr * TOSS_MAX_HEIGHT])
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