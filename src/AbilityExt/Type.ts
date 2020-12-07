import { AbilityBase } from './Ability/Base'
import { Casting } from './Type/Casting'
import { Data } from './Type/Data'
import { Targeting } from './Type/Targeting'

export class Type<TargType extends AbilityBase.TargType> {
    constructor(casting: Casting<TargType>, data: Data<TargType>, targeting: Targeting<TargType>){
        this.casting = casting
        this.data = data
        this.targeting = targeting
    }

    readonly casting: Casting<TargType>;
    readonly data: Data<TargType>;
    readonly targeting: Targeting<TargType>;
}