import { AbilityIFace, TargetType } from '../Ability/IFace'

export abstract class Casting<T extends TargetType> {
    abstract start(abil: AbilityIFace): void;
    abstract casting(abil: AbilityIFace, dt: number): void;
    abstract cancel(abil: AbilityIFace): void;
    abstract interrupt(abil: AbilityIFace): void;
    abstract finish(abil: AbilityIFace): void;
    abstract isTargetValid(abil: AbilityIFace, target: T): boolean
}