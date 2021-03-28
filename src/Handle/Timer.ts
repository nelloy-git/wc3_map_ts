import { Action, ActionList, getFilePath, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hTimer extends Handle<jtimer> {
    constructor(){super(CreateTimer())}

    public static get(id: jtimer | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'timer'){
            Log.err('got wrong type of handle.',
                    __path__, hTimer, 2)
        }
        return instance as hTimer
    }
    public static getExpired(){return hTimer.get(GetExpiredTimer())}

    public get timeout(){return this._timeout}
    public get periodic(){return this._periodic}

    public start(timeout: number, periodic:boolean){
        this._timeout = timeout
        this._periodic = periodic
        TimerStart(this.handle, timeout, periodic, hTimer.runActions)
    }
    public pause(){PauseTimer(this.handle)}
    public resume(){ResumeTimer(this.handle)}

    public addAction(callback: (this: void, timer: hTimer)=>void){
        return this._actions.add(callback)
    }
    public removeAction(action: Action<[hTimer], void> | undefined){
        this._actions.remove(action)
    }
    private static runActions(this: void){
        let timer = hTimer.getExpired()
        if (timer){
            timer._actions.run(timer)
        }
    }

    destroy(){
        PauseTimer(this.handle)
        DestroyTimer(this.handle)
        super.destroy()
    }

    private _timeout = -1;
    private _periodic = false;
    private _actions = new ActionList<[hTimer]>();
}