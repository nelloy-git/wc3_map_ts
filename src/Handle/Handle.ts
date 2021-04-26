export abstract class Handle<T extends jhandle> {
    constructor(handle: T){
        this.valid = true
        this.__id = GetHandleId(handle)
        this.__handle = handle
        Handle.__id2instance.set(this.__id, this)
    }

    static get(id: jhandle | number | undefined, wc3_type: string){
        if (typeof id == 'undefined'){
            return undefined
        }

        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }

        let h = Handle.__id2instance.get(id)
        if (!h){
            return undefined
        }

        if (Handle.wcType(h.handle) != wc3_type){
            return undefined
        }

        return h
    }

    toString(){
        return this.constructor.name + '<' + this.id + '>'
    }

    get id(){
        if (!this.valid || this.__id == undefined){
            throw('can not get id from destroyed instance.')
        }
        return this.__id
    }
    
    get handle(){
        if (!this.valid || this.__handle == undefined){
            throw('can not get handle from destroyed instance.')
        }
        return this.__handle
    }

    destroy(){
        if (!this.valid){
            throw('can not destroy instance. Already destroyed.')
        }
        
        Handle.__id2instance.delete(<number>this.__id);
        (<boolean>this.valid) = false
        this.__id = undefined
        this.__handle = undefined
    }

    readonly valid: boolean
    private __id: number | undefined;
    private __handle: T | undefined;
    
    private static __id2instance = new Map<number, Handle<any>>();

}

declare namespace string {
    function unpack(fmt: string, s:string): number;
}

export namespace Handle{
    export function wcType(handle: jhandle){
        let s_handle = tostring(handle)
        let [name, _] = s_handle.split(':')
        return name
    }
    
    export function id2int(id: string){
        return string.unpack('>I4', id)
    }
}
