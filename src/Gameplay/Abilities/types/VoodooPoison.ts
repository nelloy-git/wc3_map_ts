import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import * as Param from "../../../Parameter";
import { hTimer, hUnit } from "../../../Handle";
import { getFileDir, Vec2 } from "../../../Utils";

import { AbilityJson } from "../../JsonUtils/Ability";
import { VoodooPoisonData } from "../Data/VoodooPoison";

const __dir__ = Macro(getFileDir())

const json = new AbilityJson(__dir__ + '/../json/VoodooPoison.json')
const KEY_CAST_TIME = 'castTime'
const KEY_DMG = 'dmg'
const KEY_DUR = 'dur'
const KEY_TICKS_PER_SEC = 'ticksPerSec'

// let NAME = 'Voodoo Poison'
// let ICON = 'ReplaceableTextures\\CommandButtons\\BTNShadowPact.blp'
// let DIS_ICON = 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNShadowPact.blp'
// let TOOLTIP = 'T\no\no\nl\nt\ni\np'
// let MODEL = 'Abilities\\Spells\\Items\\OrbVenom\\OrbVenomMissile.mdl'
// let ANIM_INDEX = 12
// let ANIM_TIME = 0.8
// let CAST_TIME = 2
// let DUR_TIME = 10
// let DMG_MULT = 1

let Casting = new Abil.TCasting<[Vec2]>()

Casting.start = (abil, target) => {
    let targ = target[0]
    let caster = abil.Data.owner
    let angle = caster.getAngleTo(targ)

    caster.pause = true
    caster.angle = angle

    let anim = json.getNumber(['animation', 'cast'])
    caster.animation = anim ? anim : 0
    let anim_time = json.getNumber(['animation', 'castDur'])
    caster.animation_scale =  (anim_time ? anim_time : 0) / abil.Casting.Timer.fullTime

    new VoodooPoisonData(abil, caster, target[0], abil.Data.area)
}

Casting.casting = (abil, target) => {
    let data = VoodooPoisonData.get(abil)
    data.progress = 1 - (abil.Casting.Timer.left / abil.Casting.Timer.fullTime)
}

function clear(abil: Abil.IFace<[Vec2]>){
    let data = VoodooPoisonData.get(abil)
    if (data){data.detach(); data.destroy()}

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
    caster.animation_scale = 1
}

Casting.cancel = (abil) => {clear(abil)}
Casting.interrupt = (abil) => {clear(abil)}
Casting.finish = (abil) => {
    let data = VoodooPoisonData.get(abil)
    data.detach()

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
    caster.animation_scale = 1

    let params = Param.UnitContainer.get(caster)
    let dur_scale = json.scales.get(KEY_DUR)
    let dur = dur_scale && params ? dur_scale.getResult(params) : 0

    let ticks_scale = json.scales.get(KEY_TICKS_PER_SEC)
    let ticks_per_sec = ticks_scale && params ? ticks_scale.getResult(params) : 0.00001

    let t = new hTimer()
    t.addAction(t => {
        data.time += t.timeout
        if (data.time >= dur){
            data.destroy()
            t.destroy()
        }

        let dmg_scale = json.scales.get(KEY_DMG)
        let dmg = dmg_scale && params ? dmg_scale.getResult(params) : 0
        
        let in_range = hUnit.getInRange(data.target, data.area)
        for (const targ of in_range){
            if (targ.isAlly(caster)){continue} 
            Param.Damage.deal(caster, targ, dmg, 'MSPL')
        }
    })
    t.start(1 / ticks_per_sec, true)
}

Casting.castingTime = (abil, target) => {
    let caster = abil.Data.owner
    let params = Param.UnitContainer.get(caster)
    let cast_time_scale = json.scales.get(KEY_CAST_TIME)

    return cast_time_scale && params ? cast_time_scale.getResult(params) : 0
}
Casting.isTargetValid = (abil, target) => {return true}

let Data = new Abil.TData()

Data.name = (abil) => {return json.name}
Data.iconNormal = (abil) => {return json.icon}
Data.iconDisabled = (abil) => {return json.dis_icon}
Data.tooltip = (abil) => {return json.tooltip}
Data.lifeCost = (abil) => {return 0}
Data.manaCost = (abil) => {return 0}
Data.range = (abil) => {return 800}
Data.area = (abil) => {return 150}
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

export let VoodooPoison = new Abil.TAbility(Casting, Data, Abil.TTargetingArea)