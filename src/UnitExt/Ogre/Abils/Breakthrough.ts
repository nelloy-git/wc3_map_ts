import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";

import { hItem, hUnit } from "../../../Handle";
import { id2int, Log } from "../../../Utils";
import { BreakthroughData } from "./Data/Breakthrough";

let NAME = 'Breakthrough'
let ICON = 'ReplaceableTextures\\CommandButtons\\BTNStampede.blp'
let DIS_ICON = 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNStampede.blp'
let TOOLTIP = 'T\no\no\nl\nt\ni\np'
let ANIM_INDEX = 11
let TURN_TIME = 0.5
let PUSH_DUR = 1
let DMG_MULT = 2

let Casting = new Abil.TCasting<[Abil.Point]>()

let pathChecker: hItem
if (IsGame()){
    pathChecker = new hItem(id2int('rat9'), 0, 0)
    pathChecker.visible = false
}

Casting.start = (abil, target) => {
    let targ = target[0]
    let caster = abil.Data.owner

    let dx = targ.x - caster.x
    let dy = targ.y - caster.y
    let angle = Atan2(dy, dx)
    angle = angle >= 0 ? angle : 2 * math.pi + angle
    let range = SquareRoot(dx * dx + dy * dy)

    let cast_time = abil.Casting.castingTime(target)
    let turn_time = getTurnTime(abil, target)
    let vel = range / (cast_time - turn_time)

    caster.pause = true
    caster.angle = angle
    caster.animation = ANIM_INDEX

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
    let params = Param.Unit.get(caster)
    let in_range = hUnit.getInRange(x, y, abil.Data.area)
    for (let target of in_range){
        if (caster.isAlly(target)){continue}
        if (data.targets.indexOf(target) >= 0){continue}

        // Push
        let buffs = Buff.Container.get(target)
        if (buffs){
            buffs.add(caster, PUSH_DUR, Buff.Push, getPushVelXY(caster, target, data.vel))
        }
        
        // Damage
        if (params){
            let patk = params.get('PATK', 'RES')
            Param.Damage.deal(caster, target, DMG_MULT * patk, 'PSPL', WEAPON_TYPE_WHOKNOWS)
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

function getTurnTime(abil: Abil.IFace<[Abil.Point]>, target: [Abil.Point] | undefined){
    let angle: number = math.pi
    if (target){
        let targ = target[0]
        let caster = abil.Data.owner
    
        let dx = targ.x - caster.x
        let dy = targ.y - caster.y
        angle = Atan2(dy, dx)
        angle = angle >= 0 ? angle : 2 * math.pi + angle
    }

    let caster = abil.Data.owner
    return TURN_TIME * math.abs(angle - caster.angle) / math.pi
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
    let param = Param.Unit.get(owner)
    let ms = param ? param.get('MOVE', 'RES') : 300
    let mspd = param ? param.get('MSPD', 'RES') : 1

    return getTurnTime(abil, target) + abil.Data.range / (mspd * ms)
}
Casting.isTargetValid = (abil, target) => {return true}

let Data = new Abil.TData()

Data.name = (abil) => {return NAME}
Data.iconNormal = (abil) => {return ICON}
Data.iconDisabled = (abil) => {return DIS_ICON}
Data.tooltip = (abil) => {return TOOLTIP}
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