import { Ability, AbilityTargets, AbilityType, AbilityTypeCasting, AbilityTypeData, AbilityTypeTargetingFriend } from './index'

class TestCasting extends AbilityTypeCasting {
    start(abil: Ability): void {print('TestType: casting start')};
    casting(abil: Ability, dt: number): void {};
    cancel(abil: Ability): void {print('TestType: casting cancel')};
    interrupt(abil: Ability): void {print('TestType: casting interrupt')};
    finish(abil: Ability): void {print('TestType: casting finish')};
}

class TestData extends AbilityTypeData {
    name(abil: Ability) {return 'TestType'}
    iconNormal(abil: Ability) {return 'TestIcon'}
    iconDisabled(abil: Ability) {return 'TestIcon'}
    tooltip(abil: Ability) {return 'TestTooltip'}
    lifeCost(abil: Ability) {return 0}
    manaCost(abil: Ability) {return 0}
    chargeUsed(abil: Ability) {return 1}
    chargeMax(abil: Ability) {return 1}
    chargeCooldown(abil: Ability) {return 3}
    castingTime(abil: Ability) {return 1}
    isAvailable(abil: Ability) {return abil.charges.count > 0}
    consume(abil: Ability) {abil.charges.count -= 1; return true}
    areTargetsValid(abil: Ability, targets: AbilityTargets): boolean {return true}
}

export let TestType = new AbilityType(new TestCasting(),
                                      new TestData(),
                                      new AbilityTypeTargetingFriend())