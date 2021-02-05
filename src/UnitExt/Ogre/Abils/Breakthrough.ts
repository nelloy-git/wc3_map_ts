import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";

import { hUnit } from "../../../Handle";
import { deltaPos, getTurnTime, getFileDir, Log } from "../../../Utils";
import { BreakthroughData } from "./Data/Breakthrough";
import { AbilityJsonData } from "../../AbilUtils/Json/Data";

let json_path = getFileDir() + '/json/Breakthrough.json'
let json = new AbilityJsonData(json_path)

print(json.getValue('dmg'))

let Casting = new Abil.TCasting<[Abil.Point]>()

Casting.start = (abil, target) => {
    let targ = target[0]
    let caster = abil.Data.owner

    let [dx, dy] = deltaPos(targ, caster)
    let angle = Atan2(dy, dx)
    angle = angle >= 0 ? angle : 2 * math.pi + angle
    let range = SquareRoot(dx * dx + dy * dy)

    let cast_time = abil.Casting.castingTime(target)
    let turn_time = getTurnTime(caster, targ)
    let vel = range / (cast_time - turn_time)

    caster.pause = true
    caster.angle = angle
    caster.animation = json.animations['walkOgre']

    new BreakthroughData(abil, angle, range, vel, Abil.Casting.period)
}

Casting.casting = (abil, target) => {
    let data = BreakthroughData.get(abil)
    if (!data){
        return Log.err(abil.Data.name + 
                       ': data is undefined.')
    }

    // Turning caster
    let caster = abil.Data.owner
    if (caster.angle < data.angle - 0.1 || caster.angle > data.angle + 0.1){
        return
    }

    // Moving caster
    let status = data.move()
    // print(status, data.range, data.range_x, data.range_y)
    if (status == 'COLLISION'){
        abil.Casting.cancel()
        return
    } else if (status == 'FINISH'){
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
        if (buffs){
            buffs.add(caster, json.getValue('pushDur'),
                      Buff.Push, getPushVelXY(caster, target, data.vel))
        }
        
        // Damage
        if (params){
            Param.Damage.deal(caster, target,
                              json.getValue('dmg', params), 'PSPL', WEAPON_TYPE_WHOKNOWS)
        }

        data.targets.push(target)
    }
}

function getPushVelXY(caster: hUnit, target: hUnit, vel: number): [vel_x: number, vel_y: number]{
    let dx = target.x - caster.x
    let dy = target.y - caster.y
    let r = SquareRoot(dx * dx + dy * dy)
    let vel_x = 1.5 * vel * dx / r
    let vel_y = 1.5 * vel * dy / r
    return [vel_x, vel_y]
}

function clear(abil: Abil.IFace<[Abil.Point]>){
    let data = BreakthroughData.get(abil)
    if (data){data.destroy()}

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
}

Casting.cancel = (abil) => {clear(abil)}
Casting.interrupt = (abil) => {clear(abil)}
Casting.finish = (abil) => {clear(abil)}
Casting.castingTime = (abil, target) => {
    let owner = abil.Data.owner
    let param = Param.UnitContainer.get(owner)
    let ms = param ? param.get('MOVE', 'RES') : 300
    let mspd = param ? param.get('MSPD', 'RES') : 1

    return target ? getTurnTime(abil.Data.owner, target[0]) : 0.5 + abil.Data.range / (mspd * ms)
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