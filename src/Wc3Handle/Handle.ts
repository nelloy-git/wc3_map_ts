import {Log} from '../Wc3Utils/index'

export abstract class Handle<T extends jhandle> {
    constructor(handle: T){
        this._id = GetHandleId(handle)
        this._handle = handle
        Handle.id2instance.set(this._id, this)
    }

    public static get(id: jhandle | number): Handle<jhandle> | undefined{
        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }
        return Handle.id2instance.get(id)
    }

    public static getWc3Type(handle: jhandle){
        let s_handle = tostring(handle)
        let [name, id] = s_handle.split(':')
        return name
    }

    isValid(): boolean{return typeof this._handle !== undefined}

    public get id(){
        if (!this._id){
            return Log.err(Handle.toString() +
                           ': can not get id from destroyed instance.', 2)
        }
        return this._id
    }
    
    public get handle(){
        if (!this._handle){
            return Log.err(Handle.toString() +
                           ': can not get handle from destroyed instance.', 2)
        }
        return this._handle
    }

    destroy(): void{
        if (!this._handle || !this._id){
            return Log.err(Handle.toString() +
                           ': can not destroy instance. Already destroyed.', 2)
        }
        
        Handle.id2instance.delete(this._id)
        this._id = undefined
        this._handle = undefined
    }
    
    private static id2instance = new Map<number, Handle<any>>();

    protected _id: number | undefined;
    protected _handle: T | undefined;

}
//throw new Error('azaz')