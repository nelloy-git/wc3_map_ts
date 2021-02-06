import { Action, ActionList, getFilePath, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hTrigger extends Handle<jtrigger> {
    constructor(){
        super(CreateTrigger())
        TriggerAddAction(this.handle, hTrigger.runActions)
    }
    public static get(id: jtrigger | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'trigger'){
            Log.err('got wrong type of handle.',
                    __path__, hTrigger, 2)
        }
        return instance as hTrigger
    }
    public static getTriggering(){return hTrigger.get(GetTriggeringTrigger())}

    public addAction(callback: (this: void, trig: hTrigger)=>void){
        return this._actions.add(callback)
    }

    public removeAction(action: Action<[hTrigger], void>){
        return this._actions.remove(action)
    }

    private static runActions(this: void){
        let trig = hTrigger.getTriggering()
        trig?._actions.run(trig)
    }

    destroy(){
        DestroyTrigger(this.handle)
        super.destroy()
    }

    private _actions = new ActionList<[hTrigger]>()
}