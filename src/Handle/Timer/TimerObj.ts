import { Action, ActionList } from '../../Utils'
import { hTimerList } from './TimerList'

export class hTimerObj {
    constructor(timer_list: hTimerList){
        this._timer_list = timer_list
        timer_list.addTimerObj(this)
    }
    
    pause: boolean = false

    get left(){return this._end - this._timer_list.time}
    set left(left: number){
        if (this.left < 0){
            this.start(left)
        } else {
            this._end = this._timer_list.time + left
        }
    }

    get fullTime(){return this._end - this._start}

    start(timeout: number){
        this._start = this._timer_list.time
        this._end = this._start + timeout
        print('Timer start')
        this._actions.get('START')?.run(this)
    }

    period(reduce_time_left: boolean){
        if (reduce_time_left){
            this._end -= this._timer_list.period
        }
        this._actions.get('PERIOD')?.run(this)

        if (this.left < this._timer_list.period){
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
              callback: (this: void, obj: hTimerObj)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[hTimerObj], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    private _timer_list: hTimerList;
    private _start = -1;
    private _end = -1;
    private readonly _actions = new Map<TimerObj.Event, ActionList<[hTimerObj]>>([
        ['START', new ActionList()],
        ['PERIOD', new ActionList()],
        ['CANCEL', new ActionList()],
        ['FINISH', new ActionList()],
    ]);
}

export namespace TimerObj {
    export type Event = 'START'|'PERIOD'|'CANCEL'|'FINISH'
}