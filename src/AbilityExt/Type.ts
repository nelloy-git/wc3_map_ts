import { AbilityIFace, TargetType } from './Ability/IFace'
import { Casting } from './Type/Casting'
import { Data } from './Type/Data'
import { Targeting } from './Type/Targeting'

export class Type<T extends TargetType> {
    constructor(casting: Casting<T>, data: Data, targeting: Targeting<T>){
        this.casting = casting
        this.data = data
        this.targeting = targeting
    }

    readonly casting: Casting<T>;
    readonly data: Data;
    readonly targeting: Targeting<T>;
}