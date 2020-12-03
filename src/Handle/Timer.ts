/** @noSelfInFile */

import { Action, ActionList, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Timer extends Handle<jtimer> {
    constructor(){super(CreateTimer())}

    public static get(id: jtimer | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'timer'){
            Log.err('Timer: got wrong type of handle.', 2)
        }
        return instance as Timer
    }
    public static getExpired(){return Timer.get(GetExpiredTimer())}

    public get timeout(){return this._timeout}
    public get periodic(){return this._periodic}

    public start(timeout: number, periodic:boolean){
        this._timeout = timeout
        this._periodic = periodic
        TimerStart(this.handle, timeout, periodic, Timer.runActions)
    }
    public pause(){PauseTimer(this.handle)}
    public resume(){ResumeTimer(this.handle)}

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

    destroy(){
        PauseTimer(this.handle)
        DestroyTimer(this.handle)
        super.destroy()
    }

    private _timeout = -1;
    private _periodic = false;
    private _actions = new ActionList<[Timer]>();
}