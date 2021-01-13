import { hTimerObj } from "./TimerObj";

export class hTimerList {
    constructor(period: number, offset?: number){
        if (!offset){offset = period * math.random()}
        this._period = period

        if (!IsGame()){return}

        let offset_timer = CreateTimer()
        TimerStart(offset_timer, offset, false, ()=>{
            TimerStart(this._timer as jtimer, period, true, ()=>{this._runTimerObj()})
            DestroyTimer(offset_timer)
        })
    }

    get time(){return this._cur_time}
    get period(){return this._period}

    newTimerObj(){
        return new hTimerObj(this)
    }

    addTimerObj(obj: hTimerObj){
        this._objects.push(obj)
    }

    removeTimerObj(obj: hTimerObj){
        let i = this._objects.indexOf(obj)
        if (i >= 0){this._objects.splice(i, 1)}
        return i >= 0
    }

    private _runTimerObj(){
        this._objects.forEach(cur => {
            if (cur.endTime < this._cur_time){return}
            if (cur.pause){
                cur.left += this._period
                return
            }

            cur.period(false)
        })
        this._cur_time += this._period
    }

    private _cur_time = 0
    private _period: number;
    private _timer = IsGame() ? CreateTimer() : undefined
    private _objects: hTimerObj[] = []
}