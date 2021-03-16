import * as Handle from '../../Handle'
import * as Utils from '../../Utils'

export class Charges {
    constructor(){
        this._timer.addAction('PERIOD', ()=>{
            this._actions.get('CHARGE_CD')?.run(this, 'CHARGE_CD')
        })
        this._timer.addAction('FINISH', ()=>{
            this.count += 1
        })
    }

    static readonly period = 0.05
    readonly period = Charges.period
    
    get count(){return this._count} 
    set count(count: number){
        count = count < 0 ? 0 : count > this._count_max ? this._count_max : count
        let prev = this._count
        this._count = count
        
        if (count < this._count_max){
            if (this._timer.left < 0){
                this._timer.start(this._cooldown)
            }
        } else {
            this._timer.cancel()
        }

        if (prev != count){
            this._actions.get('CHARGE_CHANGED')?.run(this, 'CHARGE_CHANGED')
        }
    }

    get countMax(){return this._count_max}
    set countMax(max: number){
        this._count_max = max
        this.count = this._count
    }

    get pause(){return this._pause}
    set pause(flag: boolean){this._timer.pause = flag}

    get left(){return this._timer.left}
    set left(left: number){this._timer.left = left}

    get cooldown(){return this._cooldown}
    set cooldown(cd: number){this._cooldown = cd}

    addAction(event: Charges.Event,
              callback: (this: void, charges: Charges, event: Charges.Event)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Utils.Action<[Charges, Charges.Event], void> | undefined){
        if (!action){return false}

        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    destroy(){
        Charges._timer_list.removeTimerObj(this._timer)
    }

    private _count = 1;
    private _count_max = 1;
    private _cooldown = 1;
    private _pause = false;
    private _timer = Charges._timer_list.newTimerObj();
    private readonly _actions = new Map<Charges.Event, Utils.ActionList<[Charges, Charges.Event]>>([
        ['CHARGE_CD', new Utils.ActionList()],
        ['CHARGE_CHANGED', new Utils.ActionList()],
    ])

    private static _timer_list = new Handle.hTimerList(Charges.period)
}

export namespace Charges {
    export type Event = 'CHARGE_CD'|'CHARGE_CHANGED'
}