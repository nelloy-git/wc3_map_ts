import { Field, FieldBool, FieldInt, FieldReal, FieldString, FieldUnreal } from './Field'
import { Change } from "./Change";

export abstract class Object {
    constructor(base_id: number, id: number, changes: Change<any>[]){
        this.base_id = base_id
        this.id = id
        this._changes = changes
    }
    
    abstract serialize(): string
    protected abstract _get<T extends Field.ValueType>(field: Field<T>): T|undefined
    protected abstract _set<T extends Field.ValueType>(field: Field<T>, val: T): void
    
    get changes(): ReadonlyArray<Change<any>>{
        return this._changes
    }

    getBool(field: FieldBool): boolean|undefined {
        return this._get(field)
    }

    getInt(field: FieldInt): number|undefined {
        return this._get(field)
    }

    getReal(field: FieldReal): number|undefined {
        return this._get(field)
    }

    getUnreal(field: FieldUnreal): number|undefined {
        return this._get(field)
    }

    getString(field: FieldString): string|undefined {
        return this._get(field)
    }

    setBool(field: FieldBool, val: boolean){
        this._set(field, val)
    }

    setInt(field: FieldInt, val: number){
        this._set(field, val)
    }

    setReal(field: FieldReal, val: number){
        this._set(field, val)
    }

    setUnreal(field: FieldUnreal, val: number){
        this._set(field, val)
    }

    setString(field: FieldString, val: string){
        this._set(field, val)
    }

    readonly base_id: number
    readonly id: number
    protected _changes: Change<any>[]
}