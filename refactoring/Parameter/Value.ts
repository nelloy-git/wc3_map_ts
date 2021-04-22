const Enum = {
    BAS: 'BAS',
    MUL: 'MUL',
    ADD: 'ADD',
    // RES: 'RES',
}

// export type Type = keyof typeof Enum

// function createList(){
//     let l: Type[] = []
//     for (const param in Enum){
//         l.push(<Type>param)
//     }
//     return l
// }
// export const List: ReadonlyArray<Type> = createList()

interface ValList {
    readonly RES: number
}

export class Value implements ValList {

    constructor(){
        // this.__val = newValList()
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

    get RES(){return this.__res}
    set RES(v: number){

    }

    // public get(t: Type){
    //     return this.__val[t]
    // }

    // public set(type: ValueType, val: number){
    //     this.__val.set(type, val)
    //     return this._updateResult()
    // }

    // public add(type: ValueType, val: number){
    //     this.set(type, this.get(type) + val)
    //     return this._updateResult()
    // }

    // private _updateResult(){
    //     let base = this.get('BASE')
    //     let mult = this.get('MULT')
    //     let add = this.get('ADD')

    //     let res = base * mult + add
    //     this.__val.set('RES', res)
    //     return res
    // }

    private __actual: boolean
    private __bas: number
    private __mul: number
    private __add: number
    private __res: number
}