export type ParamValueType = 'BASE'|'MULT'|'ADD'|'RES'

export class ParamValue {

    public get(type: ParamValueType){
        return this._values.get(type) as number
    }

    public set(type: ParamValueType, val: number){
        this._values.set(type, val)
        return this._updateResult()
    }

    public add(type: ParamValueType, val: number){
        this.set(type, this.get(type) + val)
        return this._updateResult()
    }

    private _updateResult(){
        let base = this.get('BASE')
        let mult = this.get('MULT')
        let add = this.get('ADD')
        this._values.set('RES', base * mult + add)
        return this.get('RES')
    }

    private readonly _values = new Map<ParamValueType, number>([
        ['BASE', 0],
        ['MULT', 1],
        ['ADD', 0],
        ['RES', 0],
    ])
}