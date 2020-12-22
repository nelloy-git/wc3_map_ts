import { IFace, TargetType } from './IFace'
import { TypeCasting } from './Type/Casting'
import { TypeData } from './Type/Data'
import { TypeTargeting } from './Type/Targeting'

export class Type<T extends TargetType> {
    constructor(casting: TypeCasting<T>, data: TypeData, targeting: TypeTargeting<T>){
        this.casting = casting
        this.data = data
        this.targeting = targeting
    }

    readonly casting: TypeCasting<T>;
    readonly data: TypeData;
    readonly targeting: TypeTargeting<T>;
}