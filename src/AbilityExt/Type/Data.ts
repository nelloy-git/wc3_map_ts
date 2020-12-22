import { IFace } from '../IFace'

export abstract class TypeData {
    protected constructor(){}
    abstract name(abil: IFace): string
    abstract iconNormal(abil: IFace): string
    abstract iconDisabled(abil: IFace): string
    abstract tooltip(abil: IFace): string
    abstract lifeCost(abil: IFace): number
    abstract manaCost(abil: IFace): number
    abstract chargeUsed(abil: IFace): number
    abstract chargeMax(abil: IFace): number
    abstract chargeCooldown(abil: IFace): number
    abstract castingTime(abil: IFace): number
    abstract isAvailable(abil: IFace): boolean
    abstract consume(abil: IFace): boolean
}