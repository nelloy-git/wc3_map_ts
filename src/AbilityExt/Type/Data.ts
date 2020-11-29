import { AbilityIface, AbilityTargets } from '../Ability/Iface'

export abstract class Data {
    public abstract name(abil: AbilityIface): string
    public abstract iconNormal(abil: AbilityIface): string
    public abstract iconDisabled(abil: AbilityIface): string
    public abstract tooltip(abil: AbilityIface): string;
    public abstract lifeCost(abil: AbilityIface): number;
    public abstract manaCost(abil: AbilityIface): number;
    public abstract chargeUsed(abil: AbilityIface): number;
    public abstract chargeMax(abil: AbilityIface): number;
    public abstract chargeCooldown(abil: AbilityIface): number;
    public abstract castingTime(abil: AbilityIface): number;
    public abstract isAvailable(abil: AbilityIface): boolean;
    public abstract consume(abil: AbilityIface): void;
    public abstract areTargetsValid(abil: AbilityIface, targets: AbilityTargets): boolean;
}