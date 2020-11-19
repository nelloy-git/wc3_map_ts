export abstract class Handle {
    constructor(handle: jhandle){
        this._id = GetHandleId(handle)
        this._handle = handle
        Handle.id2instance.set(this._id, this)
    }

    public static get(handle: jhandle): Handle | undefined;
    public static get(id: number): Handle | undefined;
    public static get(id: jhandle | number): Handle | undefined{
        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }
        return Handle.id2instance.get(id)
    }

    id(): number | undefined{
        return this._id
    }
    handle(): jhandle | undefined{
        return this._handle
    }
    destroy(): void{
        if(!this._id){return}
        Handle.id2instance.delete(this._id)
    };
    
    private static id2instance = new Map<number, Handle>();

    protected _id: number | undefined;
    protected _handle: jhandle | undefined;

}