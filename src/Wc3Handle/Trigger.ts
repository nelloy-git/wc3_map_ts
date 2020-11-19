import { Handle } from "./Handle";

export class Trigger extends Handle {
    constructor(){
        super()
        let handle = CreateTrigger()

        this._id = GetHandleId(handle)
        this._handle = handle
        Trigger.id2instance.set(this._id, this)
    }
    
    static get(handle: jtrigger): Trigger | undefined;
    static get(id: number): Trigger | undefined;
    static get(id: jtrigger | number): Trigger | undefined{
        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }
        return Trigger.id2instance.get(id)
    }

    public id(){ return this._id }
    public handle(){ return this._handle }
    public destroy(){
        if(!this._handle){ return }
        DestroyTrigger(this._handle)

        if (!this._id){ return }
        Trigger.id2instance.delete(this._id)
        
        this._id = undefined
        this._handle = undefined
    }

    private static id2instance = new Map<number, Trigger>();

    private _id: number | undefined;
    private _handle: jtrigger | undefined;
}