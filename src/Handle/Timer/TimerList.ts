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
        let obj = new hTimerObj(this)
        this._objects.push(obj)
        return obj
    }

    addTimerObj(obj: hTimerObj){
        this._objects.push(obj)
    }

    removeTimerObj(obj: hTimerObj){
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
            if (cur.left < 0){continue}
            if (cur.pause){
                cur.left += this._period
                continue
            }

            cur.period(false)
        }
    }

    private _cur_time = 0
    private _period: number;
    private _timer = IsGame() ? CreateTimer() : undefined
    private _objects: hTimerObj[] = []
}