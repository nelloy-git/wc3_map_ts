import { hUnit } from "../../Handle"
import { Log } from "../../Utils"

import { DamageType } from "./Type"

export class Shield {
    constructor(type: Shield.Type[], owner: hUnit){
        this._val = 0
        this._types = []
        type.forEach(element => {
            if (this._types.indexOf(element) >= 0){
                Log.err(Shield.name + 
                        ': same shield type can not be used more than one time.')
            }
            this._types.push(element)
        });
        this._owner = owner
    }

    static consume(type: DamageType, owner: hUnit, dmg: number){
        let shield_type = Shield.damage2shield(type)
        let cur = Shield.getCur(shield_type, owner)
        cur = cur - dmg

        let left = cur >= 0 ? 0 : -cur
        Shield._setCur(shield_type, owner, math.max(0, -left))
        return left
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

    get type(){return this._types}

    get value(){return this._val}
    set value(val: number){
        if (val < 0){val = 0}

        this._types.forEach(type => {
            let max = Shield.getMax(type, this._owner)
            max = max - this._val + val
            Shield._setMax(type, this._owner, max)

            let cur = Shield.getCur(type, this._owner)
            cur = cur - this._val + val
            Shield._setCur(type, this._owner, cur)
        })

        this._val = val
    }

    destroy(){
        this._types.forEach(type => {
            let max = Shield.getMax(type, this._owner)
            if (this._val > max){
                return Log.err(Shield.name + 
                               ': shield can not be removed. Current unit max shield < removing shield value.')
            }
            max = max - this._val

            let cur = Shield.getCur(type, this._owner)
            cur = Math.min(cur, max)

            Shield._setCur(type, this._owner, cur)
            Shield._setMax(type, this._owner, max)
        })
    }

    private _val: number
    private _types: Shield.Type[]
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

        val > 0 ? map.set(owner, val) : map.delete(owner)
    }

    private static _setMax(type: Shield.Type, owner: hUnit, val: number){
        let map = Shield._max.get(type)
        if (!map){
            return Log.err(Shield.name + 
                           ': unknown damage type.')
        }
        
        val > 0 ? map.set(owner, val) : map.delete(owner)
    }
}

export namespace Shield {
    export type Type = 'PHYS'|'MAGIC'|'CHAOS'

    export function damage2shield(type: DamageType): Shield.Type{
        switch(type){
            case 'PATK': {return 'PHYS'}
            case 'PSPL': {return 'PHYS'}
            case 'MATK': {return 'MAGIC'}
            case 'PATK': {return 'MAGIC'}
            case 'CATK': {return 'CHAOS'}
            case 'CSPL': {return 'CHAOS'}
            default: {return 'CHAOS'}
        }
    }
}