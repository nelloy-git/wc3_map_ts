import { hTimerList, hTimerObj, hUnit } from "../Handle";
import { Type } from "./Type";

export class Buff<USER_DATA> extends hTimerObj {
    constructor(src: hUnit, targ: hUnit, type: Type<USER_DATA>, data: USER_DATA){
        super(Buff._timer_list)

        this._src = src
        this._targ = targ
        this._type = type
        this._data = data

        this.addAction('START', ()=>{this._type.start(this)})
        this.addAction('PERIOD', ()=>{this._type.period(this)})
        this.addAction('CANCEL', ()=>{this._type.cancel(this)})
        this.addAction('FINISH', ()=>{this._type.finish(this)})
    }

    destroy(){
        Buff._timer_list.removeTimerObj(this)
    }

    get source(){return this._src}
    get target(){return this._targ}
    get type(){return this._type}
    get data(){return this._data}

    private _src: hUnit
    private _targ: hUnit
    private _type: Type<USER_DATA>
    private _data: USER_DATA

    private static _timer_list = new hTimerList(0.05)
}