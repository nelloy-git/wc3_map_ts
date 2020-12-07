import { AbilityBase } from '../Ability/Base'

export abstract class Casting<TargType extends AbilityBase.TargType> {
    abstract start(abil: AbilityBase<TargType>): void;
    abstract casting(abil: AbilityBase<TargType>, dt: number): void;
    abstract cancel(abil: AbilityBase<TargType>): void;
    abstract interrupt(abil: AbilityBase<TargType>): void;
    abstract finish(abil: AbilityBase<TargType>): void;
}