import { getFilePath, Log } from '../Utils'

let __path__ = Macro(getFilePath())

export abstract class Handle<T extends jhandle> {
    constructor(handle: T){
        this._id = GetHandleId(handle)
        this._handle = handle
        Handle.id2instance.set(this._id, this)
    }

    static get(id: jhandle | number): Handle<jhandle> | undefined{
        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }
        return Handle.id2instance.get(id)
    }

    isValid(): boolean{return typeof this._handle !== undefined}

    get id(){
        if (!this._id){
            return Log.err('can not get id from destroyed instance.',
                            __path__, Handle, 2)
        }
        return this._id
    }
    
    get handle(){
        if (!this._handle){
            return Log.err('can not get handle from destroyed instance.',
                            __path__, Handle, 2)
        }
        return this._handle
    }

    destroy(){
        if (!this._handle || !this._id){
            Log.err('can not destroy instance. Already destroyed.',
                    __path__, Handle, 2)
            return
        }
        
        Handle.id2instance.delete(this._id)
        this._id = undefined
        this._handle = undefined
    }
    
    private static id2instance = new Map<number, Handle<any>>();

    private _id: number | undefined;
    private _handle: T | undefined;

}
//throw new Error('azaz')