import { AbilityIFace, TargetType } from '../Ability/IFace'

export abstract class Data {
    protected constructor(){}
    abstract name(abil: AbilityIFace): string
    abstract iconNormal(abil: AbilityIFace): string
    abstract iconDisabled(abil: AbilityIFace): string
    abstract tooltip(abil: AbilityIFace): string
    abstract lifeCost(abil: AbilityIFace): number
    abstract manaCost(abil: AbilityIFace): number
    abstract chargeUsed(abil: AbilityIFace): number
    abstract chargeMax(abil: AbilityIFace): number
    abstract chargeCooldown(abil: AbilityIFace): number
    abstract castingTime(abil: AbilityIFace): number
    abstract isAvailable(abil: AbilityIFace): boolean
    abstract consume(abil: AbilityIFace): boolean
}