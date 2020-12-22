import * as Abil from "../AbilityExt";
import * as Buff from "../Buff";
import * as Param from "../Parameter";

import { hUnit } from "../Handle";
import { Log } from "../Utils";

let DRAIN_LIFE = 0.15
let SHIELD_OF_DRAINED = 1
let SHIELD_MATK = 2
let SHIELD_TIME_BASE = 6
let SHIELD_TIME_MSPD = 1

class AbilBuffData extends Buff.TypeData {
    static readonly instance = new AbilBuffData()

    name(buff: Buff.IFace){return ''}
    icon(buff: Buff.IFace){return ''}
    tooltip(buff: Buff.IFace){return ''}
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


class Casting extends Abil.TypeCasting<[hUnit]> {
    static readonly instance = new Casting()

    start(abil: Abil.Ability<[hUnit]>): void {};
    casting(abil: Abil.Ability<[hUnit]>, dt: number): void {};
    cancel(abil: Abil.Ability<[hUnit]>): void {};
    interrupt(abil: Abil.Ability<[hUnit]>): void {};
    finish(abil: Abil.Ability<[hUnit]>): void {
        let targ = abil.getTarget()[0]

        let params = Param.Unit.get(targ)
        let buffs = Buff.Container.get(targ)
        if (!params || !buffs){
            return Log.err(Casting.name + 
                           ': target does not have parameter or buff containers.')
        }

        let drain = DRAIN_LIFE * targ.lifeMax
        targ.life = targ.life - drain

        let shield = new Param.Shield('PHYS', targ)
        shield.value = SHIELD_OF_DRAINED * drain + SHIELD_MATK * params.get('MATK', 'RES')
        let time = SHIELD_TIME_BASE * SHIELD_TIME_MSPD * params.get('MSPD', 'RES')

        print(shield.value, time)
        buffs.add<Param.Shield>(abil.owner, time, AbilBuffType, shield)
    };
    isTargetValid(abil: Abil.Ability<[hUnit]>, target: [hUnit]): boolean {return true}
}

class Data extends Abil.TypeData {
    static readonly instance = new Data()
    name(abil: Abil.IFace): string {return ''}
    iconNormal(abil: Abil.IFace): string {return 'ReplaceableTextures\\CommandButtons\\BTNOrbOfCorruption.blp'}
    iconDisabled(abil: Abil.IFace): string {return 'ReplaceableTextures\\CommandButtonsDisabled\\DISBTNOrbOfCorruption.blp'}
    tooltip(abil: Abil.IFace): string {return ''}
    lifeCost(abil: Abil.IFace): number {return 0}
    manaCost(abil: Abil.IFace): number {return 0}
    chargeUsed(abil: Abil.IFace): number {return 1}
    chargeMax(abil: Abil.IFace): number {return 1}
    chargeCooldown(abil: Abil.IFace): number {return 5}
    castingTime(abil: Abil.IFace): number {return 1}
    isAvailable(abil: Abil.IFace): boolean {return abil.charges.count > 0}
    consume(abil: Abil.IFace): boolean {abil.charges.count -= 1; return true}
}

export let LifeForceShield = new Abil.Type(Casting.instance,
                                           Data.instance,
                                           Abil.TypeTargetingFriend.instance)