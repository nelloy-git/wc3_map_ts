import * as Abil from './index'
import { hUnit } from '../Handle'

class TestCasting extends Abil.TypeCasting<[hUnit]> {
    static readonly instance = new TestCasting()
    start(abil: Abil.Ability<[hUnit]>): void {print('TestType: casting start')};
    casting(abil: Abil.Ability<[hUnit]>, dt: number): void {};
    cancel(abil: Abil.Ability<[hUnit]>): void {print('TestType: casting cancel')};
    interrupt(abil: Abil.Ability<[hUnit]>): void {print('TestType: casting interrupt')};
    finish(abil: Abil.Ability<[hUnit]>): void {print('TestType: casting finish')};
    isTargetValid(abil: Abil.Ability<[hUnit]>, target: [hUnit]): boolean {return true}
}

class TestData extends Abil.TypeData {
    static readonly instance = new TestData()
    name(abil: Abil.Ability<[hUnit]>) {return 'TestType'}
    iconNormal(abil: Abil.Ability<[hUnit]>) {return 'TestIcon'}
    iconDisabled(abil: Abil.Ability<[hUnit]>) {return 'TestIcon'}
    tooltip(abil: Abil.Ability<[hUnit]>) {return 'TestTooltip'}
    lifeCost(abil: Abil.Ability<[hUnit]>) {return 0}
    manaCost(abil: Abil.Ability<[hUnit]>) {return 0}
    chargeUsed(abil: Abil.Ability<[hUnit]>) {return 1}
    chargeMax(abil: Abil.Ability<[hUnit]>) {return 1}
    chargeCooldown(abil: Abil.Ability<[hUnit]>) {return 3}
    castingTime(abil: Abil.Ability<[hUnit]>) {return 1}
    isAvailable(abil: Abil.Ability<[hUnit]>) {return abil.charges.count > 0}
    consume(abil: Abil.Ability<[hUnit]>) {abil.charges.count -= 1; return true}
}

export let TestType = new Abil.Type(TestCasting.instance,
                                    TestData.instance,
                                    Abil.TypeTargetingFriend.instance)