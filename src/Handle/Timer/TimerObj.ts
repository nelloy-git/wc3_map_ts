import { Action, ActionList } from '../../Utils'
import { TimerList } from './TimerList'

export class TimerObj {
    constructor(timer_list: TimerList){
        this._timer_list = timer_list
    }
    
    pause: boolean = false

    get timeLeft(){return this._end - this._timer_list.time}
    set timeLeft(left: number){
        if (this.timeLeft < 0){
            this.start(left)
        } else {
            this._end = this._timer_list.time + left
        }
    }

    get fullTime(){return this._end - this._start}

    start(timeout: number){
        this._start = this._timer_list.time
        this._end = this._start + timeout
        this._actions.get('START')?.run(this)
    }

    period(reduce_time_left: boolean){
        if (reduce_time_left){
            this._end -= this._timer_list.period
        }
        this._actions.get('PERIOD')?.run(this)

        if (this.timeLeft < this._timer_list.period){
            this.finish()
        }
    }

    cancel(){
        this._start = -1
        this._end = -1
        this._actions.get('CANCEL')?.run(this)
    }

    finish(){
        this._start = -1
        this._end = -1
        this._actions.get('FINISH')?.run(this)
    }

    addAction(event: TimerObj.Event,
              callback: (this: void, obj: TimerObj)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[TimerObj], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    private _timer_list: TimerList;
    private _start = -1;
    private _end = -1;
    private readonly _actions = new Map<TimerObj.Event, ActionList<[TimerObj]>>([
        ['START', new ActionList()],
        ['PERIOD', new ActionList()],
        ['CANCEL', new ActionList()],
        ['FINISH', new ActionList()],
    ]);
}

export namespace TimerObj {
    export type Event = 'START'|'PERIOD'|'CANCEL'|'FINISH'
}