import { Handle } from "./Handle";

export class Timer extends Handle {
    constructor(){
        super()

        this._handle = CreateTimer()
        this._id = GetHandleId(this._handle)
        Timer.id2instance.set(this._id, this)
    }
    
    static get(handle: jtimer): Timer | undefined;
    static get(id: number): Timer | undefined;
    static get(id: jtimer | number): Timer | undefined{
        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }
        return Timer.id2instance.get(id)
    }

    public id(){ return this._id }
    public handle(){ return this._handle }
    public destroy(){
        if(!this._handle){ return }
        DestroyTimer(this._handle)

        if (!this._id){ return }
        Timer.id2instance.delete(this._id)

        this._id = undefined
        this._handle = undefined
    }
    private static id2instance = new Map<number, Timer>();

    private _id: number | undefined;
    private _handle: jtimer | undefined;
}