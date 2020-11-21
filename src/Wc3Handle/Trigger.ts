import { Action, ActionList, Log } from "../Wc3Utils/index";
import { Handle } from "./Handle";

export class Trigger extends Handle<jtrigger> {
    constructor(){
        super(CreateTrigger())
        TriggerAddAction(this.handle, Trigger.runActions)
    }
    
    public static getTriggering(){return Handle.get(GetTriggeringTrigger()) as Trigger | undefined}

    public get handle(){return this._handle as jtrigger}

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

    public destroy(){
        DestroyTrigger(this.handle)
        super.destroy()
    }

    private _actions = new ActionList<[Trigger]>()
}