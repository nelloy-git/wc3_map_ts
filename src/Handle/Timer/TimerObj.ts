import { Action, ActionList } from '../../Utils'
import { Timer } from '../Timer'

type TimerObjEvent = 'START'|'PERIOD'|'CANCEL'|'FINISH'

export class TimerObj {
    constructor(){
        this._timer_action = TimerObj._timer?.addAction((t: Timer)=>{this._timerLoop(t)})
    }

    public get timeLeft(){return this._end - TimerObj._timer_time}
    public set timeLeft(left: number){
        this._start = TimerObj._timer_time
        this._end = this._start + left
    }

    public start(timeout: number){
        this._start = TimerObj._timer_time
        this._end = this._start + timeout
        this._actions.get('START')?.run(this)
    }

    public pause(flag: boolean){
        this._pause = flag
    }

    public period(reduce_time_left: boolean){
        if (reduce_time_left){
            let t = TimerObj._timer?.timeout
            this._end -= t ? t : 0
        }
        this._actions.get('PERIOD')?.run(this)
    }

    public cancel(){
        this._start = -1
        this._end = -1
        this._actions.get('CANCEL')?.run(this)
    }

    public finish(){
        this._start = -1
        this._end = -1
        this._actions.get('FINISH')?.run(this)
    }

    public addAction(event: TimerObjEvent,
                     callback: (this: void, obj: TimerObj)=>void){
        return this._actions.get(event)?.add(callback)
    }

    public removeAction(action: Action<[TimerObj], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    public destroy(){
        TimerObj._timer?.removeAction(this._timer_action)
    }

    private _timerLoop(t: Timer){
        if (this._pause){this._end += t.timeout}
        if (this._start < 0){return}

        if (this._end <= TimerObj._timer_time){
            this.finish()
        } else {
            this.period(false)
        }
    }

    private _start = -1;
    private _end = -1;
    private _pause = false;
    private _timer_action;
    private readonly _actions = new Map<TimerObjEvent, ActionList<[TimerObj]>>([
        ['START', new ActionList()],
        ['PERIOD', new ActionList()],
        ['CANCEL', new ActionList()],
        ['FINISH', new ActionList()],
    ]);
    
    private static _timer_time = 0;
    private static _createTimer(){
        if(!IsGame()){return}

        let t = new Timer()
        t.start(0.1, true)
        t.addAction(()=>{TimerObj._timer_time += t.timeout})
        return t
    }
    private static _timer = TimerObj._createTimer()
}