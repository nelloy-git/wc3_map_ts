import * as Abil from "../../../AbilityExt";
import * as Buff from "../../../Buff";
import { hTimer, hUnit } from "../../../Handle";
import * as Param from "../../../Parameter";
import { Log } from "../../../Utils";
import { VoodooPoisonData } from "./Data/VoodooPoison";

let NAME = 'Voodoo Poison'
let ICON = 'ReplaceableTextures\\CommandButtons\\BTNShadowPact.blp'
let DIS_ICON = 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNShadowPact.blp'
let TOOLTIP = 'T\no\no\nl\nt\ni\np'
let MODEL = 'Abilities\\Spells\\Items\\OrbVenom\\OrbVenomMissile.mdl'
let ANIM_INDEX = 12
let ANIM_TIME = 0.8
let CAST_TIME = 2
let DUR_TIME = 10
let DMG_MULT = 1

let Casting = new Abil.TCasting<[Abil.Point]>()

Casting.start = (abil, target) => {
    let targ = target[0]
    let caster = abil.Data.owner
    let angle = caster.getAngleTo(targ)

    caster.pause = true
    caster.angle = angle
    caster.animation = ANIM_INDEX
    caster.animation_scale =  ANIM_TIME / abil.Casting.Timer.fullTime

    new VoodooPoisonData(abil, MODEL,
                         targ.x, targ.y, -40,
                         abil.Data.area, math.pi / 2 + angle, 16)
}

Casting.casting = (abil, target) => {
    let data = VoodooPoisonData.get(abil)
    if (!data){
        return Log.err(abil.Data.name + 
                       ': data is undefined.')
    }
    data.progress = 1 - (abil.Casting.Timer.left / abil.Casting.Timer.fullTime)
}

function clear(abil: Abil.IFace<[Abil.Point]>){
    let data = VoodooPoisonData.get(abil)
    if (data){data.unregister(); data.destroy()}

    let caster = abil.Data.owner
    caster.pause = false
    caster.animation = 'stand'
}

Casting.cancel = (abil) => {clear(abil)}
Casting.interrupt = (abil) => {clear(abil)}
Casting.finish = (abil) => {
    let data = VoodooPoisonData.get(abil)
    if (!data){
        return Log.err(abil.Data.name + 
                       ': data is undefined.')
    }
    data.unregister()

    let caster = abil.Data.owner
    caster.animation_scale = 1
    caster.animation = 'stand'
    caster.pause = false

    let dur = DUR_TIME
    let t = new hTimer()
    t.addAction(t => {
        let d = <VoodooPoisonData>data
        d.time += t.timeout
        if (d.time >= dur){
            d.destroy()
            t.destroy()
        }

        let params = Param.UnitContainer.get(caster)
        let matk = params ? params.get('MATK', 'RES') : 0
        let dmg = DMG_MULT * matk
        
        let list = hUnit.getInRange(d.cx, d.cy, d.area)
        list.forEach(targ => {
            if (targ.isAlly(caster)){return}
            Param.Damage.deal(caster, targ, dmg, 'MSPL')
        })
    })
    t.start(0.5, true)
}

Casting.castingTime = (abil, target) => {
    let owner = abil.Data.owner
    let param = Param.UnitContainer.get(owner)
    let mspd = param ? param.get('MSPD', 'RES') : 1

    return CAST_TIME / mspd
}
Casting.isTargetValid = (abil, target) => {return true}

let Data = new Abil.TData()

Data.name = (abil) => {return NAME}
Data.iconNormal = (abil) => {return ICON}
Data.iconDisabled = (abil) => {return DIS_ICON}
Data.tooltip = (abil) => {return TOOLTIP}
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