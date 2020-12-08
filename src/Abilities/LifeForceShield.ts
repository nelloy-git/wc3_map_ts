import { Ability, AbilityIFace, AbilityType, AbilityTypeCasting, AbilityTypeData, AbilityTypeTargetingFriend } from "../AbilityExt";
import * as Buff from "../Buff";
import { hUnit } from "../Handle";
import { ParamsUnit, Shield } from "../Parameter";

let DRAIN_LIFE = 0.15
let SHIELD_OF_DRAINED = 1
let SHIELD_MATK = 2
let SHIELD_TIME_BASE = 6
let SHIELD_TIME_MSPD = 1

class AbilBuffData extends Buff.TypeData {
    static readonly instance = new AbilBuffData()

    name(buff: Buff.BuffIFace){return ''}
    icon(buff: Buff.BuffIFace){return ''}
    tooltip(buff: Buff.BuffIFace){return ''}
}

class AbilBuffProcess extends Buff.TypeProcess<Shield> {
    static readonly instance = new AbilBuffProcess()

    start(buff: Buff.Buff<Shield>){}
    period(buff: Buff.Buff<Shield>){}
    cancel(buff: Buff.Buff<Shield>){buff.data.destroy()}
    finish(buff: Buff.Buff<Shield>){buff.data.destroy()}
}

let BuffType = new Buff.Type<Shield>(AbilBuffData.instance,
                                     AbilBuffProcess.instance)


class Casting extends AbilityTypeCasting<[hUnit]> {
    static readonly instance = new Casting()

    start(abil: Ability<[hUnit]>): void {};
    casting(abil: Ability<[hUnit]>, dt: number): void {};
    cancel(abil: Ability<[hUnit]>): void {};
    interrupt(abil: Ability<[hUnit]>): void {};
    finish(abil: Ability<[hUnit]>): void {
        let targ = abil.getTarget()[0]

        let params = ParamsUnit.get(targ)
        let buffs = Buff.Container.get(targ)
        if (!params || !buffs){return}

        let drain = DRAIN_LIFE * targ.lifeMax
        targ.life = targ.life - drain

        let shield = new Shield('PHYS', targ)
        shield.value = SHIELD_OF_DRAINED * drain + SHIELD_MATK * params.get('MATK', 'RES')
        let time = SHIELD_TIME_BASE * SHIELD_TIME_MSPD * params.get('MSPD', 'RES')

        buffs.add<Shield>(abil.owner, time, BuffType, shield)
    };
    isTargetValid(abil: Ability<[hUnit]>, target: [hUnit]): boolean {return true}
}

class Data extends AbilityTypeData {
    static readonly instance = new Data()
    name(abil: AbilityIFace): string {return ''}
    iconNormal(abil: AbilityIFace): string {return ''}
    iconDisabled(abil: AbilityIFace): string {return ''}
    tooltip(abil: AbilityIFace): string {return ''}
    lifeCost(abil: AbilityIFace): number {return 0}
    manaCost(abil: AbilityIFace): number {return 0}
    chargeUsed(abil: AbilityIFace): number {return 1}
    chargeMax(abil: AbilityIFace): number {return 1}
    chargeCooldown(abil: AbilityIFace): number {return 5}
    castingTime(abil: AbilityIFace): number {return 1}
    isAvailable(abil: AbilityIFace): boolean {return abil.charges.count > 0}
    consume(abil: AbilityIFace): boolean {abil.charges.count -= 1; return true}
}

export let LifeForceShield = new AbilityType(Casting.instance,
                                             Data.instance,
                                             AbilityTypeTargetingFriend.instance)