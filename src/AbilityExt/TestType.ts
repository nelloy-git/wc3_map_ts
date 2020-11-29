import { AbilityIface, AbilityTargets } from './Ability/Iface'
import { Casting } from './Type/Casting';
import { Data } from './Type/Data';
import { TargetingFriend } from './Type/Targeting/Friend'

import { Type } from './Type'

class TestCasting extends Casting {
    public start(abil: AbilityIface): void {print('Casting start')};
    public casting(abil: AbilityIface): void {};
    public cancel(abil: AbilityIface): void {print('Casting cancel')};
    public interrupt(abil: AbilityIface): void {print('Casting interrupt')};
    public finish(abil: AbilityIface): void {print('Casting finish')};
}

class TestData extends Data {
    public name(abil: AbilityIface): string {return 'TestType'}
    public iconNormal(abil: AbilityIface): string {return 'TestIcon'}
    public iconDisabled(abil: AbilityIface): string {return 'TestIcon'}
    public tooltip(abil: AbilityIface): string {return 'TestTooltip'}
    public lifeCost(abil: AbilityIface): number {return 0}
    public manaCost(abil: AbilityIface): number {return 0}
    public chargeUsed(abil: AbilityIface): number {return 1}
    public chargeMax(abil: AbilityIface): number {return 1}
    public chargeCooldown(abil: AbilityIface): number {return 3}
    public castingTime(abil: AbilityIface): number {return 1}
    public isAvailable(abil: AbilityIface): boolean {return true}
    public consume(abil: AbilityIface): void {}
    public areTargetsValid(abil: AbilityIface, targets: AbilityTargets): boolean {return true}
}

let TestType = new Type(new TestCasting(), new TestData(), new TargetingFriend())
export {TestType}