import {Casting} from './Type/Casting'
import {Data} from './Type/Data'
import {Targeting} from './Type/Targeting'

export class Type {
    constructor(casting: Casting, data: Data, targeting: Targeting){
        this.casting = casting
        this.data = data
        this.targeting = targeting
    }

    readonly casting: Casting;
    readonly data: Data;
    readonly targeting: Targeting;
}