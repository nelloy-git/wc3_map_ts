import { Action, ActionList, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Trigger extends Handle<jtrigger> {
    constructor(){
        super(CreateTrigger())
        TriggerAddAction(this.handle, Trigger.runActions)
    }
    public static get(id: jtrigger | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'trigger'){
            Log.err('Trigger: got wrong type of handle.', 2)
        }
        return instance as Trigger
    }
    public static getTriggering(){return Trigger.get(GetTriggeringTrigger())}

    public addAction(callback: (this: void, trig: Trigger)=>void){
        return this._actions.add(callback)
    }

    public removeAction(action: Action<[Trigger], void>){
        return this._actions.remove(action)
    }

    private static runActions(this: void){
        let trig = Trigger.getTriggering()
        trig?._actions.run(trig)
    }

    protected _destroy(){
        DestroyTrigger(this.handle)
    }

    private _actions = new ActionList<[Trigger]>()
}