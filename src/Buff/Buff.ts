import { hTimerList, hTimerObj, hUnit } from "../Handle";
import { BuffIFace } from "./IFace";
import { Type } from "./Type";

export class Buff<T> extends hTimerObj implements BuffIFace {
    constructor(src: hUnit, targ: hUnit, type: Type<T>, data: T){
        super(Buff._timer_list)

        this.src = src
        this.dst = targ
        this.type = type
        this.data = data

        this.addAction('START', ()=>{this.type.process.start(this)})
        this.addAction('PERIOD', ()=>{this.type.process.period(this)})
        this.addAction('CANCEL', ()=>{this.type.process.cancel(this); this.destroy()})
        this.addAction('FINISH', ()=>{this.type.process.finish(this); this.destroy()})
    }

    destroy(){
        Buff._timer_list.removeTimerObj(this)
    }

    readonly src: hUnit
    readonly dst: hUnit
    readonly type: Type<T>
    readonly data: T

    private static _timer_list = new hTimerList(0.05)
}