import { Action, ActionList } from "../Utils";
import { Handle } from "./Handle";

export class hTrigger extends Handle<jtrigger> {
    constructor(){
        super(CreateTrigger())
        TriggerAddAction(this.handle, () => {
            this.__actions.run(this)
        })
    }

    public static get(id: jtrigger | number){
        return Handle.get(id, 'destructable') as hTrigger | undefined
    }

    public addAction(callback: (this: void, trig: hTrigger)=>void){
        return this.__actions.add(callback)
    }

    public removeAction(action: Action<[hTrigger], void>){
        return this.__actions.remove(action)
    }

    destroy(){
        DestroyTrigger(this.handle)
        super.destroy()
    }

    private __actions = new ActionList<[hTrigger]>()
}