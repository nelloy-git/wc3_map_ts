import { Action, ActionList } from '../Utils'
import { hTimerList } from '../Handle'

export class Charges {
    constructor(){
        this._timer.addAction('PERIOD', ()=>{
            this._actions.get('COOLDOWN_LOOP')?.run(this, 'COOLDOWN_LOOP')
        })
        this._timer.addAction('FINISH', ()=>{
            this.count += 1
        })
    }
    
    get count(){return this._count} 
    set count(count: number){
        count = count < 0 ? 0 : count > this._count_max ? this._count_max : count
        let prev = this._count
        this._count = count
        
        if (count < this._count_max){
            if (this._timer.timeLeft < 0){
                this._timer.start(this._cooldown)
            }
        } else {
            this._timer.cancel()
        }

        if (prev != count){
            this._actions.get('COUNT_CHANGED')?.run(this, 'COUNT_CHANGED')
        }
    }

    get countMax(){return this._count_max}
    set countMax(max: number){
        this._count_max = max
        this.count = this._count
    }

    get pause(){return this._pause}
    set pause(flag: boolean){this._timer.pause = flag}

    get timeLeft(){return this._timer.timeLeft}
    set timeLeft(left: number){this._timer.timeLeft = left}

    get cooldown(){return this._cooldown}
    set cooldown(cd: number){this._cooldown = cd}

    addAction(event: Charges.Event,
                     callback: (this: void, charges: Charges, event: Charges.Event)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[Charges, Charges.Event], void> | undefined){
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
    private readonly _actions = new Map<Charges.Event, ActionList<[Charges, Charges.Event]>>([
        ['COOLDOWN_LOOP', new ActionList()],
        ['COUNT_CHANGED', new ActionList()],
    ])

    private static _timer_list = new hTimerList(0.05)
}

export namespace Charges {
    export type Event = 'COOLDOWN_LOOP' | 'COUNT_CHANGED'
}