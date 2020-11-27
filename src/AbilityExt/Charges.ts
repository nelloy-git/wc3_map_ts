import { Action, ActionList } from '../Utils'
import { TimerObj } from '../Handle'

export enum Event {
    COOLDOWN_LOOP = 'COOLDOWN_LOOP',
    COUNT_CHANGED = 'COUNT_CHANGED'
}

export class Charges {
    constructor(){
        this._timer.addAction('PERIOD', ()=>{this._actions.get(Event.COOLDOWN_LOOP)?.run(this, Event.COOLDOWN_LOOP)})
        this._timer.addAction('FINISH', ()=>{this.count += 1})
    }
    
    public get count(){return this._count}
    public set count(count: number){
        count = count < 0 ? 0 : count > this._count_max ? this._count_max : count
        if (this._count != count){this._actions.get(Event.COUNT_CHANGED)?.run(this, Event.COUNT_CHANGED)}

        this._count = count
        if (count < this._count_max){
            if (this._timer.timeLeft < 0){
                this._timer.start(this._cooldown)
            }
        } else {
            this._timer.cancel()
        }

    }

    public get countMax(){return this._count_max}
    public set countMax(max: number){
        this._count_max = max
        this.count = this._count
    }

    public get pause(){return this._pause}
    public set pause(flag: boolean){this._timer.pause(flag)}

    public get timeLeft(){return this._timer.timeLeft}
    public set timeLeft(left: number){this._timer.timeLeft = left}

    public get cooldown(){return this._cooldown}
    public set cooldown(cd: number){this._cooldown = cd}

    public addAction(event: Event,
                     callback: (this: void, charges: Charges, event: Event)=>void){
        return this._actions.get(event)?.add(callback)
    }

    public removeAction(action: Action<[Charges, Event], void> | undefined){
        if (!action){return false}

        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    public destroy(){
        this._timer.destroy()
    }

    private _count = 1;
    private _count_max = 1;
    private _cooldown = 1;
    private _pause = false;
    private _timer = new TimerObj();
    private readonly _actions = new Map<Event, ActionList<[Charges, Event]>>([
        [Event.COOLDOWN_LOOP, new ActionList],
        [Event.COUNT_CHANGED, new ActionList],
    ])
}