import { TimerObj } from "./TimerObj";

export class TimerList {
    constructor(period: number, offset?: number){
        if (!offset){offset = 0}
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
        let obj = new TimerObj(this)
        this._objects.push(obj)
        return obj
    }

    removeTimerObj(obj: TimerObj){
        let found = false
        for (let i = 0; i < this._objects.length; i++){
            if (obj == this._objects[i]){
                this._objects.splice(i, 1)
                found = true
                break
            }
        }
        return found
    }

    private _runTimerObj(){
        this._cur_time += this._period

        for (let cur of this._objects){
            if (cur.timeLeft < 0){return}
            if (cur.pause){
                cur.timeLeft += this._period
                return
            }

            cur.period(false)
        }
    }

    private _cur_time = 0
    private _period: number;
    private _timer = IsGame() ? CreateTimer() : undefined
    private _objects: TimerObj[] = []
}