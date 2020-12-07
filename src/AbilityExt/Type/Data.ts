import { AbilityBase } from '../Ability/Base'

export abstract class Data<TargType extends AbilityBase.TargType> {
    abstract name(abil: AbilityBase<TargType>): string
    abstract iconNormal(abil: AbilityBase<TargType>): string
    abstract iconDisabled(abil: AbilityBase<TargType>): string
    abstract tooltip(abil: AbilityBase<TargType>): string
    abstract lifeCost(abil: AbilityBase<TargType>): number
    abstract manaCost(abil: AbilityBase<TargType>): number
    abstract chargeUsed(abil: AbilityBase<TargType>): number
    abstract chargeMax(abil: AbilityBase<TargType>): number
    abstract chargeCooldown(abil: AbilityBase<TargType>): number
    abstract castingTime(abil: AbilityBase<TargType>): number
    abstract isAvailable(abil: AbilityBase<TargType>): boolean
    abstract consume(abil: AbilityBase<TargType>): boolean
    abstract areTargetsValid(abil: AbilityBase<TargType>, targets: TargType): boolean
}