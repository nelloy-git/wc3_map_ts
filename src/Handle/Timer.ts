import { Action, ActionList } from "../Utils";
import { Handle } from "./Handle";

export class hTimer extends Handle<jtimer> {
    constructor(){
        super(CreateTimer())

        this.__timeout = -1
        this.__periodic = false
    }

    static get(id: jtimer | number){
        return Handle.get(id, 'timer') as hTimer | undefined
    }

    get timeout(){return this.__timeout}
    get periodic(){return this.__periodic}

    start(timeout: number, periodic:boolean){
        this.__timeout = timeout
        this.__periodic = periodic
        TimerStart(this.handle, timeout, periodic, () => {
            this.__actions.run(this)
        })
    }

    pause(){
        PauseTimer(this.handle)
    }
    
    resume(){
        ResumeTimer(this.handle)
    }

    addAction(callback: hTimer.Callback){
        return this.__actions.add(callback)
    }

    removeAction(action: hTimer.hAction){
        this.__actions.remove(action)
    }

    destroy(){
        PauseTimer(this.handle)
        DestroyTimer(this.handle)
        super.destroy()
    }

    private __timeout: number
    private __periodic: boolean
    private __actions = new ActionList<[hTimer]>();
}

export namespace hTimer{
    export type Callback = (this: void, timer: hTimer) => void
    export type hAction = Action<[hTimer], void>
}