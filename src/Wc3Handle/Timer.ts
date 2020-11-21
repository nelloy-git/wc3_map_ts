/** @noSelfInFile */

import { Action, ActionList } from "../Wc3Utils/index";
import { Handle } from "./Handle";

export class Timer extends Handle<jtimer> {
    constructor(){super(CreateTimer())}
    public static getExpired(){return Handle.get(GetExpiredTimer()) as Timer | undefined}

    public start(timeout: number, periodic:boolean){
        TimerStart(this.handle, timeout, periodic, Timer.runActions)
    }
    public pause(){PauseTimer(this.handle)}
    public resume(){ResumeTimer(this.handle)}
    public destroy(){
        PauseTimer(this.handle)
        DestroyTimer(this.handle)
        super.destroy()
    }

    public addAction(callback: (timer: Timer)=>void){
        return this._actions.add(callback)
    }
    public removeAction(action: Action<[Timer], void> | undefined){
        this._actions.remove(action)
    }
    private static runActions(this: void){
        let timer = Timer.getExpired()
        timer?._actions.run(timer)
    }

    private _actions = new ActionList<[Timer]>();
}