import { Ability, AbilityTargets, AbilityTypeCasting, AbilityTypeData } from "../AbilityExt";
import { Buff, BuffContainer, BuffType } from "../Buff";
import { hUnit } from "../Handle";
import { ParamsUnit, Shield } from "../Parameter";

let DRAIN_LIFE = 0.15
let SHIELD_OF_DRAINED = 1
let SHIELD_MATK = 2
let SHIELD_TIME_BASE = 6
let SHIELD_TIME_MSPD = 1

class AbilBuff extends BuffType<Shield> {
    static readonly instance = new AbilBuff()

    start(buff: Buff<Shield>){}
    period(buff: Buff<Shield>){}
    cancel(buff: Buff<Shield>){buff.data.destroy()}
    finish(buff: Buff<Shield>){buff.data.destroy()}
    name(buff: Buff<Shield>){return ''}
    icon(buff: Buff<Shield>){return ''}
    tooltip(buff: Buff<Shield>){return ''}
}

class Casting extends AbilityTypeCasting<hUnit> {
    start(abil: Ability<hUnit>): void {};
    casting(abil: Ability<hUnit>, dt: number): void {};
    cancel(abil: Ability<hUnit>): void {};
    interrupt(abil: Ability<hUnit>): void {};
    finish(abil: Ability<hUnit>): void {
        let targ_list = abil.getTargets()
        if (!targ_list ||
            targ_list.length != 1 ||
            !(targ_list[0] instanceof hUnit)){return}

        let targ = targ_list[0]
        let params = ParamsUnit.get(targ)
        let buffs = BuffContainer.get(targ)
        if (!params || !buffs){return}

        let drain = DRAIN_LIFE * targ.lifeMax
        targ.life = targ.life - drain

        let shield = new Shield('PHYS', targ)
        shield.value = SHIELD_OF_DRAINED * drain + SHIELD_MATK * params.get('MATK', 'RES')
        let time = SHIELD_TIME_BASE * SHIELD_TIME_MSPD * params.get('MSPD', 'RES')

        buffs.add<Shield>(abil.owner, time, AbilBuff.instance, shield)
    };
}

class Data extends AbilityTypeData {
    name(abil: Ability): string {return ''}
    iconNormal(abil: Ability): string {return ''}
    iconDisabled(abil: Ability): string {return ''}
    tooltip(abil: Ability): string {return ''}
    lifeCost(abil: Ability): number {return 0}
    manaCost(abil: Ability): number {return 0}
    chargeUsed(abil: Ability): number {return 0}
    chargeMax(abil: Ability): number {return 0}
    chargeCooldown(abil: Ability): number {return 0}
    castingTime(abil: Ability): number {return 0}
    isAvailable(abil: Ability): boolean {return true}
    consume(abil: Ability): boolean {return true}
    areTargetsValid(abil: Ability, targets: AbilityTargets): boolean {return true}
}