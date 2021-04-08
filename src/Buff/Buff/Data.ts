import { hUnit } from "../../Handle";
import { TData } from "../Type/Data";
import { DataIFace, IFace } from "./IFace";

export class Data<T> implements DataIFace<T> {
    constructor(buff: IFace<T>, id: number, owner: hUnit, source: hUnit, type: TData<T>, user_data: T){
        this.id = id
        this.owner = owner
        this.source = source
        this.buff = buff
        this.user_data = user_data
        this._type = type
    }

    get name(){return this._type.name(this.buff)}
    get icon(){return this._type.icon(this.buff)}
    get tooltip(){return this._type.tooltip(this.buff)}
    get stackable(){return this._type.stackable()}
    get add_duration(){return this._type.add_duration()}

    readonly id: number
    readonly owner: hUnit
    readonly source: hUnit
    readonly buff: IFace<T>
    user_data: T

    private _type: TData<T>
}