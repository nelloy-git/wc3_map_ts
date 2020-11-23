import {Casting} from './Type/Casting'
import {Data} from './Type/Data'
import {Targeting} from './Type/Targeting'

export class Type {
    constructor(casting: Casting, data: Data, targeting: Targeting){
        this.casting = casting
        this.data = data
        this.targeting = targeting
    }

    public readonly casting: Casting;
    public readonly data: Data;
    public readonly targeting: Targeting;
}