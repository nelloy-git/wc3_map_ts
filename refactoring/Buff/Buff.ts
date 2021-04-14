import { hUnit } from "../../src/Handle";
import { Data } from "./Buff/Data";
import { Duration } from "./Buff/Duration";
import { IFace } from "./Buff/IFace";
import { TData } from "./Type/Data";
import { TDuration } from "./Type/Duration";

export class TBuff<T> {
    constructor(
        public TData: TData<T>,
        public TDuration: TDuration<T>
    ){}
}

export class Buff<T> implements IFace<T> {
    constructor(source: hUnit, owner: hUnit, type: TBuff<T>, user_data: T){
        let id = IFace.register(this)

        this.type = type
        this.Data = new Data(this, id, owner, source, type.TData, user_data)
        this.Dur = new Duration(this, type.TDuration)
    }

    readonly type: TBuff<T>
    readonly Data: Data<T>
    readonly Dur: Duration<T>
}