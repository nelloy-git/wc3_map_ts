import { Log } from "../Utils"

export type ValueType = 'BASE'|'MULT'|'ADD'|'RES'

export class Value {

    public get(type: ValueType){
        let val = this._values.get(type)
        if (!val){
            return Log.err(Value.name + 
                           ': can not get \"' + type + '\" value.')
        }
        return val
    }

    public set(type: ValueType, val: number){
        this._values.set(type, val)
        return this._updateResult()
    }

    public add(type: ValueType, val: number){
        this.set(type, this.get(type) + val)
        return this._updateResult()
    }

    private _updateResult(){
        let base = this.get('BASE')
        let mult = this.get('MULT')
        let add = this.get('ADD')

        let res = base * mult + add
        this._values.set('RES', res)
        return res
    }

    private readonly _values = new Map<ValueType, number>([
        ['BASE', 0],
        ['MULT', 1],
        ['ADD', 0],
        ['RES', 0],
    ])
}