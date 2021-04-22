type Enum = {
    BAS: number
    MUL: number
    ADD: number
    RES: number
}

export type ValueType = keyof Enum
interface ValueIFace extends Record<ValueType, number>{}

export class Value implements ValueIFace {

    constructor(bas: number, mul: number, add: number){
        this.__actual = false
        this.__bas = bas
        this.__mul = mul
        this.__add = add
        this.__res = 0
    }

    get BAS(){return this.__bas}
    set BAS(v: number){
        this.__actual = false
        this.__bas = v
    }

    get MUL(){return this.__mul}
    set MUL(v: number){
        this.__actual = false
        this.__mul = v
    }

    get ADD(){return this.__add}
    set ADD(v: number){
        this.__actual = false
        this.__add = v
    }

    get RES(){
        if (!this.__actual){
            this.__res = this.__bas * this.__mul + this.__add
        }
        return this.__res
    }

    private __actual: boolean
    private __bas: number
    private __mul: number
    private __add: number
    private __res: number
}