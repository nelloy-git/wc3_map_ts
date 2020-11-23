import { AbilityIface } from '../Ability/Iface'

export abstract class Casting {
    public abstract start(abil: AbilityIface): void;
    public abstract casting(abil: AbilityIface): void;
    public abstract cancel(abil: AbilityIface): void;
    public abstract interrupt(abil: AbilityIface): void;
    public abstract finish(abil: AbilityIface): void;
}