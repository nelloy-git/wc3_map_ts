import * as Abil from "../AbilityExt";
import * as Buff from "../Buff";
import * as Param from "../Parameter";

import { hUnit } from "../Handle";
import { Log } from "../Utils";

let NAME = 'Life Force Shield'
let ICON = 'ReplaceableTextures\\CommandButtons\\BTNOrbOfCorruption.blp'
let DIS_ICON = 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNOrbOfCorruption.blp'
let TOOLTIP = 'T\no\no\nl\nt\ni\np'

let DRAIN_LIFE = 0.15
let SHIELD_OF_DRAINED = 1
let SHIELD_MATK = 2
let SHIELD_TIME_BASE = 6
let SHIELD_TIME_MSPD = 1

class AbilBuffData extends Buff.TypeData {
    static readonly instance = new AbilBuffData()

    name(buff: Buff.IFace){return NAME}
    icon(buff: Buff.IFace){return ICON}
    tooltip(buff: Buff.IFace){return TOOLTIP}
}

class AbilBuffProcess extends Buff.TypeProcess<Param.Shield> {
    static readonly instance = new AbilBuffProcess()

    start(buff: Buff.Buff<Param.Shield>){}
    period(buff: Buff.Buff<Param.Shield>){}
    cancel(buff: Buff.Buff<Param.Shield>){buff.data.destroy()}
    finish(buff: Buff.Buff<Param.Shield>){buff.data.destroy()}
}

let AbilBuffType = new Buff.Type<Param.Shield>(AbilBuffData.instance,
                                        AbilBuffProcess.instance)

let TCasting = new Abil.TCasting<hUnit[]>()

// TCasting.start = () => {};
// TCasting.casting = () => {};
// TCasting.cancel = () => {};
// TCasting.interrupt = () => {};
TCasting.finish = (abil, target) => {
        let targ = target[0]

        let params = Param.Unit.get(targ)
        let buffs = Buff.Container.get(targ)
        if (!params || !buffs){
            return Log.err(Abil.TCasting.name + 
                           ': target does not have parameter or buff containers.')
        }

        let drain = DRAIN_LIFE * targ.lifeMax
        targ.life = targ.life - drain

        let shield = new Param.Shield(['PHYS'], targ)
        shield.value = SHIELD_OF_DRAINED * drain + SHIELD_MATK * params.get('MATK', 'RES')
        let time = SHIELD_TIME_BASE * SHIELD_TIME_MSPD * (1 + params.get('MSPD', 'RES'))

        buffs.add<Param.Shield>(abil.Data.owner, time, AbilBuffType, shield)
    };
TCasting.isTargetValid = (abil, target) => {return true}

let TData = new Abil.TData<hUnit[]>()

TData.name = abil => {return NAME}
TData.iconNormal = abil => {return ICON}
TData.iconDisabled = abil => {return DIS_ICON}
TData.tooltip = abil => {return TOOLTIP}
TData.lifeCost = abil => {return 0}
TData.manaCost = abil => {return 0}
TData.range = abil => {return 1000}
TData.area = abil => {return 0}
TData.chargeUsed = abil => {return 1}
TData.chargeMax = abil => {return 1}
TData.chargeCooldown = abil => {return 5}
TData.castingTime = abil => {return 1}
TData.isAvailable = abil => {
    let charges = abil.Data.Charges.count > 0
    let casting = abil.Casting.timer.left <= 0
    return charges && casting
}
TData.consume = abil => {
    abil.Data.Charges.cooldown = TData.chargeCooldown(abil)
    abil.Data.Charges.count -= TData.chargeUsed(abil)
    return true
}

export let LifeForceShield = new Abil.TAbility(TCasting, TData, Abil.TTargetingFriend)