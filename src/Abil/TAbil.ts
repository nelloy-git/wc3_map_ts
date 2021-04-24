import type { TargetType } from './Abil'
import type { TCasting } from './Casting/Type'
import type { TCharges } from './Charges/Type'
import type { TData } from './Data/Type'
import type { TTargeting } from './Targeting/Type'

export class TAbil<T extends TargetType[]>{
    constructor(TCasting: TCasting<T>, TCharges: TCharges<T>,
                TData: TData<T>, TTargeting: TTargeting<T>){
        this.TCasting = TCasting
        this.TCharges = TCharges
        this.TData = TData
        this.TTargeting = TTargeting
    }

    readonly TCasting: TCasting<T>
    readonly TCharges: TCharges<T>
    readonly TData: TData<T>
    readonly TTargeting: TTargeting<T>
}