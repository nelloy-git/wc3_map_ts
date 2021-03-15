import * as Abil from "../../AbilityExt";
import * as Buff from "../../Buff";
import * as Param from "../../Parameter";
import * as Utils from '../../Utils'
import { hUnit } from "../../Handle";

import { AbilityJson } from "../JsonUtils/Ability";
import { BreakthroughData } from "./data/Breakthrough";
import { Push } from '../Buffs'

const __dir__ = Macro(Utils.getFileDir())
let json = new AbilityJson(__dir__ + '/json/Breakthrough.json')

const KEY_DMG = 'pushDmg'
const KEY_PUSH = 'pushDur'

let Casting = new Abil.TCasting<[Abil.Point]>()

Casting.start = (abil, target) => {
    let caster = abil.Data.owner
    new BreakthroughData(abil, caster, target[0])

    caster.pause = true
    caster.angle = Utils.getAngle(caster, target[0])
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

    let x = caster.x
    let y = caster.y
    let params = Param.UnitContainer.get(caster)
    let in_range = hUnit.getInRange(x, y, abil.Data.area)
    for (let target of in_range){
        if (caster.isAlly(target)){continue}
        if (data.targets.indexOf(target) >= 0){continue}

        // Push
        let buffs = Buff.Container.get(target)
        let buff_scale = json.scales.get(KEY_PUSH)
        if (params && buffs && buff_scale){
            buffs.add(caster, buff_scale.getResult(params),
                      Push, getPushVelXY(caster, target, data.vel))
        }
        
        // Damage
        let dmg_scale = json.scales.get(KEY_DMG)
        if (params && dmg_scale){
            Param.Damage.deal(caster, target,
                              dmg_scale.getResult(params), 'PSPL', WEAPON_TYPE_WHOKNOWS)
        }

        data.targets.push(target)
    }
}

function getPushVelXY(caster: hUnit, target: hUnit, vel: number): [vel_x: number, vel_y: number]{
    let [dx, dy] = Utils.deltaPos(caster, target)
    let r = SquareRoot(dx * dx + dy * dy)
    let vel_x = 1.5 * vel * dx / r
    let vel_y = 1.5 * vel * dy / r
    return [vel_x, vel_y]
}

function clear(abil: Abil.IFace<[Abil.Point]>){
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
    let mspd = param ? param.get('MSPD', 'RES') : 1

    let targ = undefined
    let range = abil.Data.range
    if (target){
        targ = target[0]
        let [dx, dy] = Utils.deltaPos(caster, targ)
        range = SquareRoot(dx * dx + dy * dy)
    }

    return Utils.getTurnTime(abil.Data.owner, targ) + range / (mspd * ms)
}
Casting.isTargetValid = (abil, target) => {return true}

let Data = new Abil.TData()

Data.name = (abil) => {return json.name}
Data.iconNormal = (abil) => {return json.icon}
Data.iconDisabled = (abil) => {return json.dis_icon}
Data.tooltip = (abil) => {return json.tooltip}
Data.lifeCost = (abil) => {return 0}
Data.manaCost = (abil) => {return 0}
Data.range = (abil) => {return 650}
Data.area = (abil) => {return 100}
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

export let Breakthrough = new Abil.TAbility(Casting, Data, Abil.TTargetingLine)