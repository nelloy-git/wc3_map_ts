import { AbilityBase, Targets } from '../Ability/Base'

export abstract class Data {
    public abstract name(abil: AbilityBase): string
    public abstract iconNormal(abil: AbilityBase): string
    public abstract iconDisabled(abil: AbilityBase): string
    public abstract tooltip(abil: AbilityBase): string;
    public abstract lifeCost(abil: AbilityBase): number;
    public abstract manaCost(abil: AbilityBase): number;
    public abstract chargeUsed(abil: AbilityBase): number;
    public abstract chargeMax(abil: AbilityBase): number;
    public abstract chargeCooldown(abil: AbilityBase): number;
    public abstract castingTime(abil: AbilityBase): number;
    public abstract isAvailable(abil: AbilityBase): boolean;
    public abstract consume(abil: AbilityBase): boolean;
    public abstract areTargetsValid(abil: AbilityBase, targets: Targets): boolean;
}