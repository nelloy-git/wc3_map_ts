import { ActionList } from "../Utils";
import { Handle } from "./Handle";

export class hTimer extends Handle<jtimer> {
    constructor(){
        super(CreateTimer())

        this.timeout = -1
        this.periodic = false
        this.actions = new ActionList(this.toString())
    }

    static get(id: jtimer | number){
        return Handle.get(id, 'timer') as hTimer | undefined
    }

    start(timeout: number, periodic:boolean){
        (<number>this.timeout) = timeout;
        (<boolean>this.periodic) = periodic

        TimerStart(this.handle, timeout, periodic, () => {
            this.actions.run(this)
        })
    }

    pause(){
        PauseTimer(this.handle)
    }
    
    resume(){
        ResumeTimer(this.handle)
    }

    destroy(){
        // this.actions.destroy()
        PauseTimer(this.handle)
        DestroyTimer(this.handle)
        super.destroy()
    }
    
    readonly timeout: number
    readonly periodic: boolean
    readonly actions: ActionList<[hTimer]>
}