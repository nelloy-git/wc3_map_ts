import { IFace, TargetType } from '../IFace'

export abstract class TypeCasting<T extends TargetType> {
    protected constructor(){}
    abstract start(abil: IFace): void;
    abstract casting(abil: IFace, dt: number): void;
    abstract cancel(abil: IFace): void;
    abstract interrupt(abil: IFace): void;
    abstract finish(abil: IFace): void;
    abstract isTargetValid(abil: IFace, target: T): boolean
}