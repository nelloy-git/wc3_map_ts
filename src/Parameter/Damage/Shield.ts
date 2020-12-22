import { hUnit } from "../../Handle"
import { Log } from "../../Utils"

import { DamageType } from "./Type"

export class Shield {
    constructor(type: Shield.Type, owner: hUnit){
        this._val = 0
        this._type = type
        this._owner = owner
    }

    static consume(type: DamageType, owner: hUnit, dmg: number){
        let shield_type = Shield.damage2shield(type)
        let cur = Shield.getCur(shield_type, owner)
        cur = cur - dmg

        if (cur <= 0){
            Shield._setCur(shield_type, owner, 0)
            return -cur
        }
        Shield._setCur(shield_type, owner, cur)
        return 0
    }

    static getCur(type: Shield.Type, owner: hUnit){
        let map = Shield._cur.get(type)
        if (!map){
            return Log.err(Shield.name + 
                           ': unknown damage type.')
        }
        let cur = map.get(owner)
        return cur ? cur : 0
    }

    static getMax(type: Shield.Type, owner: hUnit){
        let map = Shield._max.get(type)
        if (!map){
            return Log.err(Shield.name + 
                           ': unknown damage type.')
        }
        let max = map.get(owner)
        return max ? max : 0
    }

    get owner(){return this._owner}

    get type(){return this._type}

    get value(){return this._val}
    set value(val: number){
        if (val < 0){val = 0}

        let max = Shield.getMax(this._type, this._owner)
        max = max - this._val + val
        Shield._setMax(this._type, this._owner, max)

        let cur = Shield.getCur(this._type, this._owner)
        cur = cur - this._val + val
        Shield._setCur(this._type, this._owner, cur)

        this._val = val
    }

    destroy(){
        let max = Shield.getMax(this._type, this._owner)
        if (this._val > max){
            return Log.err(Shield.name + 
                           ': shield can not be removed. Current unit max shield < removing shield value.')
        }
        max = max - this._val

        let cur = Shield.getCur(this._type, this._owner)
        cur = Math.min(cur, max)

        Shield._setCur(this._type, this._owner, cur)
        Shield._setMax(this._type, this._owner, max)
    }

    private _val: number
    private _type: Shield.Type
    private _owner: hUnit

    private static _cur = new Map<Shield.Type, Map<hUnit, number>>([
        ['PHYS', new Map<hUnit, number>()],
        ['MAGIC', new Map<hUnit, number>()],
        ['CHAOS', new Map<hUnit, number>()],
    ])
    private static _max = new Map<Shield.Type, Map<hUnit, number>>([
        ['PHYS', new Map<hUnit, number>()],
        ['MAGIC', new Map<hUnit, number>()],
        ['CHAOS', new Map<hUnit, number>()],
    ])

    private static _setCur(type: Shield.Type, owner: hUnit, val: number){
        let map = Shield._cur.get(type)
        if (!map){
            return Log.err(Shield.name + 
                           ': unknown damage type.')
        }
        let cur = map.get(owner)
        cur = cur ? cur + val : val

        if (cur > 0){
            map.set(owner, cur)
        } else {
            map.delete(owner)
        }
    }

    private static _setMax(type: Shield.Type, owner: hUnit, val: number){
        let map = Shield._max.get(type)
        if (!map){
            return Log.err(Shield.name + 
                           ': unknown damage type.')
        }
        let max = map.get(owner)
        max = max ? max + val : val
        
        if (max > 0){
            map.set(owner, max)
        } else {
            map.delete(owner)
        }
    }
}

export namespace Shield {
    export type Type = 'PHYS'|'MAGIC'|'CHAOS'

    export function damage2shield(type: DamageType): Shield.Type{
        switch(type){
            case 'PATK':{return 'PHYS'}
            case 'PSPL':{return 'PHYS'}
            case 'MATK':{return 'MAGIC'}
            case 'PATK':{return 'MAGIC'}
            case 'CATK':{return 'CHAOS'}
            case 'CSPL':{return 'CHAOS'}
            default: {return 'CHAOS'}
        }
    }
}