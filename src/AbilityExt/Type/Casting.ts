import { AbilityBase } from '../Ability/Base'

export abstract class Casting {
    public abstract start(abil: AbilityBase): void;
    public abstract casting(abil: AbilityBase, dt: number): void;
    public abstract cancel(abil: AbilityBase): void;
    public abstract interrupt(abil: AbilityBase): void;
    public abstract finish(abil: AbilityBase): void;
}