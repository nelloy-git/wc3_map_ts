import { int2id, Log } from "../Wc3Utils/index";
import { Handle } from "./Handle";
import { Unit } from './Unit'

export class Ability extends Handle {
    constructor(abil_id: number, owner: Unit){
        super()
        let owner_handle = owner.handle()
        if (!owner_handle){return}

        let cur_handle = BlzGetUnitAbility(owner_handle, abil_id)
        if (cur_handle){
            Log.err(Ability.toString() +
                    ': Unit already has ability with the same id: ' +
                    int2id(abil_id))
        }

        UnitAddAbility(owner_handle, abil_id)
        let handle = BlzGetUnitAbility(owner_handle, abil_id)

        this._id = GetHandleId(handle)
        this._handle = handle
        this._owner = owner
        this._abil_id = abil_id
        Ability.id2instance.set(this._id, this)
    }

    static get(handle: jability): Ability | undefined;
    static get(id: number): Ability | undefined;
    static get(id: jability | number): Ability | undefined{
        if (typeof id !== 'number'){
            id = GetHandleId(id)
        }
        return Ability.id2instance.get(id)
    }

    public id(){ return this._id }
    public handle(){ return this._handle }
    public owner(){ return this._owner }
    public abil_id(){ return this._abil_id }

    public destroy(){
        if (!this._owner){ return }

        let owner_handle = this._owner.handle()
        if (!owner_handle){ return }
        if (!this._abil_id){ return }

        UnitRemoveAbility(owner_handle, this._abil_id)
        
        this._id = undefined
        this._handle = undefined
        this._owner = undefined
        this._abil_id = undefined
    }

    private static id2instance = new Map<number, Ability>();

    private _id: number | undefined;
    private _handle: jability | undefined;
    private _owner: Unit | undefined;
    private _abil_id: number | undefined;
}