import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { AbilityJson } from "../../JsonUtils/Ability";
import { HeavyHammerData } from "../Data/HeavyHammer";
import { TossUp } from '../../Buffs'

const __dir__ = Macro(getFileDir())

const json = new AbilityJson(__dir__ + '/../json/HeavyHammer.json')
const KEY_CAST_TIME = 'castTime'
const KEY_DMG = 'dmg'
const KEY_TOSS_DUR = 'tossDur'

const TOSS_MAX_HEIGHT = 300

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

    let anim = json.getNumber(['animation', 'strikeId'])
    caster.animation = anim ? anim : 0
    data.cur_anim = 'START'
}

Casting.casting = (abil, target) => {
    let caster = abil.Data.owner
    let data = HeavyHammerData.get(abil)
    
    let left = abil.Casting.Timer.left
    let full = abil.Casting.Timer.fullTime
    data.progress = 1 - (left / full)

    // Animation start
    let start = json.getNumber(['animation', 'strikeStart'])
    start = start ? start : 0
    if (left < full - start && data.cur_anim == 'START'){
        caster.animation_scale = 0
        data.cur_anim = 'PAUSE'
    }

    // Animation end
    let end = json.getNumber(['animation', 'strikeEnd'])
    end = end ? end : 0
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

    let endTime = json.getNumber(['animation', 'strikeEnd'])
    endTime = endTime ? endTime : 0
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

    let start = json.getNumber(['animation', 'strikeStart'])
    start = start ? start : 0
    let end = json.getNumber(['animation', 'strikeEnd'])
    end = end ? end : 0

    let param = Param.UnitContainer.get(caster)
    let cast_scale = json.scales.get(KEY_CAST_TIME)
    let cast_time = cast_scale && param ? cast_scale.getResult(param) : 0

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

    let toss_scale = json.scales.get(KEY_TOSS_DUR)
    let toss_max_dur = toss_scale && params ? toss_scale.getResult(params) : 0

    let dmg_scale = json.scales.get(KEY_DMG)
    let max_dmg = dmg_scale && params ? dmg_scale.getResult(params) : 0

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

let Data = new Abil.TData()

Data.name = (abil) => {return json.name}
Data.iconNormal = (abil) => {return json.icon}
Data.iconDisabled = (abil) => {return json.dis_icon}
Data.tooltip = (abil) => {return json.tooltip}
Data.lifeCost = (abil) => {return 0}
Data.manaCost = (abil) => {return 0}
Data.range = (abil) => {return 250}
Data.area = (abil) => {return math.pi / 2}
Data.chargeUsed = (abil) => {return 1}
Data.chargeMax = (abil) => {return 1}
Data.chargeCooldown = (abil) => {return 5}
Data.isAvailable = (abil) => {
    let controllable = !abil.Data.owner.pause
    let enough_mana = abil.Data.owner.mana >= abil.Data.mana_cost
    let charges = abil.Data.Charges.count > 0
    let casting = abil.Casting.Timer.left <= 0
    return charges && casting && enough_mana && controllable
}
Data.consume = (abil) => {
    abil.Data.Charges.count -= abil.Data.charges_use
    abil.Data.owner.mana -= abil.Data.mana_cost
    return true
}

export let HeavyHammer = new Abil.TAbility(Casting, Data, Abil.TTargetingCone )