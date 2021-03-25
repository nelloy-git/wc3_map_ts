/** @noSelfInFile */

import { Vec2 } from './Vec2'
import { Import } from "./Import"
import { Logger } from "./Logger"
let Log = Logger.Default

declare namespace string {
    function pack(fmt: string, s:number): string;
    function unpack(fmt: string, s:string): number;
    function match(s: string, regexp: string): number;
}

export function id2int(id: string){
    return string.unpack('>I4', id)
}

export function int2id(id: number){
    return string.pack('>I4', id)
}

export function wcType(handle: any){
    let s_handle = tostring(handle)
    let [name, id] = s_handle.split(':')
    return name
}

let _loc = IsGame() ? Location(0, 0) : <jlocation><unknown>undefined
export function getTerrainZ(x: number, y: number){
    MoveLocation(_loc, x, y)
    return GetLocationZ(_loc)
}

let _item = IsGame() ? (()=>{
    let it = CreateItem(id2int('rat9'), 0, 0)
    SetItemVisible(it, false)
    return it
})() : <jitem><unknown>undefined

export function isWalkable(v: Vec2) : boolean
export function isWalkable(x: number, y: number) : boolean
export function isWalkable(x_or_v: number | Vec2, y?: number){
    let p = y ? new Vec2(<number>x_or_v, y) : <Vec2>x_or_v

    SetItemPosition(_item, p.x, p.y)
    SetItemVisible(_item, false)

    let it_x = GetItemX(_item)
    let it_y = GetItemY(_item)
    if (it_x > p.x + 1 || it_x < p.x - 1 ||
        it_y > p.y + 1 || it_y < p.y - 1){
        return false
    }
    return true
}

new Import(GetSrc() + '/Utils/IsReforged/Check.toc', 'war3mapImported/IsReforged/Check.toc')
new Import(GetSrc() + '/Utils/IsReforged/CheckSD.fdf', 'war3mapImported/IsReforged/Check.fdf')
new Import(GetSrc() + '/Utils/IsReforged/CheckHD.fdf', '_HD.w3mod/war3mapImported/IsReforged/Check.fdf')
let is_reforged: boolean

if (IsGame()){
    if (!BlzLoadTOCFile('war3mapImported/IsReforged/Check.toc')){
        Log.err('IsReforged: can not load checker .toc file')
    }
    is_reforged = GetLocalizedString("ASSET_MODE") == 'HD'
}

export function isReforged(pl: jplayer){
    if (pl != GetLocalPlayer()){
        return Log.err('IsReforged: can be used for local player only.')
    }

    return is_reforged
}

export function getFilePath(){
    if (IsGame()){
        Log.err('function \'getFilePath\' is available in buildtime only.',
                undefined, undefined, 2)
    }
    let cur = getLoadingPackage()

    if (!cur){return error('')}

    while (cur.indexOf('.') > -1){
        cur = cur.replace('.', '/')
    }
    let path = GetSrc() + '/' + cur + '.ts'
    
    return path
}

export function getFileDir(){
    if (IsGame()){
        Log.err('function \'getFileDir\' is available in buildtime only.',
                undefined, undefined, 2)
    }

    let path = getFilePath()

    let last = -1
    let pos = path.indexOf('/')
    while (pos > -1){
        last = pos
        pos = path.indexOf('/', last + 1) 
    }

    return path.substring(0, last)
}