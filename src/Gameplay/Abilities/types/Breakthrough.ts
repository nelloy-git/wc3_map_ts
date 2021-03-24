import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { AbilityJson } from "../../JsonUtils/Ability";
import { BreakthroughData } from "../data/Breakthrough";
import { Push } from '../../Buffs'

const __dir__ = Macro(getFileDir())

const json = new AbilityJson(__dir__ + '/../json/Breakthrough.json')
const KEY_DMG = 'pushDmg'
const KEY_PUSH_DUR = 'pushDur'

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    new BreakthroughData(abil, caster, target[0])

    caster.pause = true
    caster.angle = target[0].sub(caster.pos).angle

    let anim = json.getNumber(['animation', 'walk'])
    caster.animation = anim ? anim : 0
}

Casting.casting = (abil, target) => {
    let caster = abil.Data.owner
    let data = BreakthroughData.get(abil)

    // Wait caster turning
    if (caster.angle < data.angle - 0.1 || caster.angle > data.angle + 0.1){
        return
    }

    // Moving caster
    data.period()
    if (data.status == 'COLLISION'){
        abil.Casting.cancel()
        return
    } else if (data.status == 'FINISH'){
        abil.Casting.finish()
        return
    }

    let params = Param.UnitContainer.get(caster)
    let in_range = hUnit.getInRange(caster.pos, abil.Data.area)
    for (let target of in_range){
        if (caster.isAlly(target)){continue}
        if (data.pushed.indexOf(target) >= 0){continue}

        // Push
        let buffs = Buff.Container.get(target)
        let buff_scale = json.scales.get(KEY_PUSH_DUR)

        if (params && buffs && buff_scale){
            let time = buff_scale.getResult(params)
            let vel = getPushVel(caster, target, data.vel.length)
            print(time, vel.toString())
            buffs.add(caster, time, Push, [vel])
        }
        
        // Damage
        let dmg_scale = json.scales.get(KEY_DMG)
        if (params && dmg_scale){
            Param.Damage.deal(caster, target,
                              dmg_scale.getResult(params), 'PSPL', WEAPON_TYPE_WHOKNOWS)
        }

        data.pushed.push(target)
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
    let param = Param.UnitContainer.get(caster)
    let ms = param ? param.get('MOVE', 'RES') : 300

    let range = target ? target[0].sub(caster.pos).length : abil.Data.range
    let angle = target ? target[0].sub(caster.pos).angle : math.pi
    angle = Math.min(angle, 2 * math.pi - angle)
    let turn_time = 0.5 * angle / math.pi

    return turn_time + range / ms
}
Casting.isTargetValid = (abil, target) => {return true}

let Data = new Abil.TData()

Data.name = (abil) => {return json.name}
Data.icon = (abil) => {return json.icon}
Data.dis_icon = (abil) => {return json.dis_icon}
Data.tooltip = (abil) => {return json.tooltip}
Data.life_cost = (abil) => {return 0}
Data.mana_cost = (abil) => {return 0}
Data.range = (abil) => {return 650}
Data.area = (abil) => {return 100}
Data.charges_use = (abil) => {return 1}
Data.charges_max = (abil) => {return 1}
Data.charge_cd = (abil) => {return 5}
Data.is_available = (abil) => {
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

export let Breakthrough = new Abil.TAbility(Casting, Data, Abil.TTargetingLine)