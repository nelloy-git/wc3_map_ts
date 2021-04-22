import * as JsonLua from './JsonLua'
import { log } from "../Utils";

let __path__ = Macro(getFilePath())

type sType = 'any' | 'boolean' | 'number' | 'string'  | 'object'

export enum ReadType {
    Pass,
    Wrn,
    Err
}

export class Data {
    constructor(
        public src: string,
        public data: JsonLua.Data
    ){
        this.silent = false
    }

    silent: boolean

    clone(){
        return new Data(this.src, this.__deepcopy(this.data))
    }

    isExist(tree: JsonLua.Tree){
        let [found, val] = this.__read(tree, 'any')
        return found
    }

    getAny(tree: JsonLua.Tree){
        let [found, val] = this.__read(tree, 'any')
        return found ? val : undefined
    }

    getSub(tree: JsonLua.Tree): Data
    getSub(tree: JsonLua.Tree, def: Data): Data
    getSub(tree: JsonLua.Tree, def?: Data){
        let data: JsonLua.Data | undefined

        if (def != undefined){
            if (this.silent){
                data = this.__readCarefully<JsonLua.Data>(tree, 'object', ReadType.Pass)
            } else {
                data = this.__readCarefully<JsonLua.Data>(tree, 'object', ReadType.Wrn)
            }

            if (!data){
                let res = def.clone()
                res.src = this.tree2string(tree)
                return res
            }
        } else {
            data = this.__readCarefully<JsonLua.Data>(tree, 'object', ReadType.Err)
        }


        return new Data(this.tree2string(tree), data)
    }

    getBool(tree: JsonLua.Tree): boolean
    getBool(tree: JsonLua.Tree, def: boolean): boolean
    getBool(tree: JsonLua.Tree, def?: boolean){
        if (def != undefined){
            if (this.silent){
                return this.__readCarefully<boolean>(tree, 'boolean', ReadType.Pass, def)
            } else {
                return this.__readCarefully<boolean>(tree, 'boolean', ReadType.Wrn, def)
            }
        } else {
            return this.__readCarefully<boolean>(tree, 'boolean', ReadType.Err)
        }
    }

    getNumber(tree: JsonLua.Tree): number
    getNumber(tree: JsonLua.Tree, def: number): number
    getNumber(tree: JsonLua.Tree, def?: number){
        if (def != undefined){
            if (this.silent){
                return this.__readCarefully<number>(tree, 'number', ReadType.Pass, def)
            } else {
                return this.__readCarefully<number>(tree, 'number', ReadType.Wrn, def)
            }
        } else {
            return this.__readCarefully<number>(tree, 'number', ReadType.Err)
        }
    }

    getString(tree: JsonLua.Tree): string
    getString(tree: JsonLua.Tree, def: string): string
    getString(tree: JsonLua.Tree, def?: string){
        if (def != undefined){
            if (this.silent){
                return this.__readCarefully<string>(tree, 'string', ReadType.Pass, def)
            } else {
                return this.__readCarefully<string>(tree, 'string', ReadType.Wrn, def)
            }
        } else {
            return this.__readCarefully<string>(tree, 'string', ReadType.Err)
        }
    }

    tree2string(tree: JsonLua.Tree, depth?: number){
        depth = depth ? depth : tree.length
        let res: string = this.src
        for (let i = 0; i < depth; i++){
            res += ' -> ' + tree[i].toString()
        }
        return res
    }

    private __deepcopy<T extends JsonLua.Val>(orig: T): T{
        let orig_type = type(orig)
        let copy
        if (orig_type == 'table'){
            copy = new LuaTable<JsonLua.Key, JsonLua.Val>()
            for (let orig_key in <JsonLua.Data>orig){
                let orig_val = (<JsonLua.Data>orig).get(orig_key)
                copy.set(orig_key, this.__deepcopy(orig_val))
            }
        }
        else {
            copy = orig   
        }
        return <T>copy
    }

    /** @tupleReturn */
    private __read<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType): [true, T] | [false, string]{
        let cur = this.data
        for (let i = 0; i < tree.length - 1; i++){
            let next = cur.get(tree[i])
            if (typeof next != 'object'){
                return [false, this.tree2string(tree, i + 1)]
            }
            cur = next
        }
        let val = cur.get(tree[tree.length - 1])

        if (t == 'any' && val != undefined){
            return [true, <T>val]
        }
    
        if (typeof val != t){
            return [false, this.tree2string(tree, tree.length)]
        }
    
        return [true, <T>val]
    }


    private __readCarefully<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType, rt: ReadType.Err): T | never
    private __readCarefully<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType, rt: ReadType.Wrn): T | undefined
    private __readCarefully<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType, rt: ReadType.Wrn, def: T): T
    private __readCarefully<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType, rt: ReadType.Pass): T | undefined
    private __readCarefully<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType, rt: ReadType.Pass, def: T): T
    private __readCarefully<T extends JsonLua.Val>(tree: JsonLua.Tree, t: sType, rt: ReadType, def?: T): T | undefined{
        let res = this.__read<T>(tree, t)
        if (!res[0]){
            if (rt == ReadType.Err){
                error('Can not find "' + t + '" value\n' + res[1], 4)
            } else if (rt == ReadType.Wrn) {
                log('Can not find "' + t + '" value\n' + res[1], 'Wrn')
            }
            return def
        }
        return res[1]
    }
}