import { Ability, AbilityType, AbilityTypeCasting, AbilityTypeData, AbilityTypeTargetingFriend } from './index'
import { hUnit } from '../Handle'

class TestCasting extends AbilityTypeCasting<[hUnit]> {
    start(abil: Ability<[hUnit]>): void {print('TestType: casting start')};
    casting(abil: Ability<[hUnit]>, dt: number): void {};
    cancel(abil: Ability<[hUnit]>): void {print('TestType: casting cancel')};
    interrupt(abil: Ability<[hUnit]>): void {print('TestType: casting interrupt')};
    finish(abil: Ability<[hUnit]>): void {print('TestType: casting finish')};
    isTargetValid(abil: Ability<[hUnit]>, target: [hUnit]): boolean {return true}
}

class TestData extends AbilityTypeData {
    name(abil: Ability<[hUnit]>) {return 'TestType'}
    iconNormal(abil: Ability<[hUnit]>) {return 'TestIcon'}
    iconDisabled(abil: Ability<[hUnit]>) {return 'TestIcon'}
    tooltip(abil: Ability<[hUnit]>) {return 'TestTooltip'}
    lifeCost(abil: Ability<[hUnit]>) {return 0}
    manaCost(abil: Ability<[hUnit]>) {return 0}
    chargeUsed(abil: Ability<[hUnit]>) {return 1}
    chargeMax(abil: Ability<[hUnit]>) {return 1}
    chargeCooldown(abil: Ability<[hUnit]>) {return 3}
    castingTime(abil: Ability<[hUnit]>) {return 1}
    isAvailable(abil: Ability<[hUnit]>) {return abil.charges.count > 0}
    consume(abil: Ability<[hUnit]>) {abil.charges.count -= 1; return true}
}

export let TestType = new AbilityType(new TestCasting(),
                                      new TestData(),
                                      new AbilityTypeTargetingFriend())