/** @noSelfInFile */

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
export function isWalkable(x: number, y: number){
    SetItemPosition(_item, x, y)
    SetItemVisible(_item, false)

    let it_x = GetItemX(_item)
    let it_y = GetItemY(_item)
    if (it_x > x + 1 || it_x < x - 1 ||
        it_y > y + 1 || it_y < y - 1){
        return true
    }
    return false
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
    let cur = getLoadingPackage()

    if (!cur){return error('')}

    while (cur.indexOf('.') > -1){
        cur = cur.replace('.', '/')
    }
    let path = GetSrc() + '/' + cur + '.ts'
    
    return path
}

export function getFileDir(){
    let path = getFilePath()

    let last = -1
    let pos = path.indexOf('/')
    while (pos > -1){
        last = pos
        pos = path.indexOf('/', last + 1) 
    }

    return path.substring(0, last)
}

interface ObjectWithPosition {
    x: number
    y: number
}

export function deltaPos(obj1: ObjectWithPosition, obj2: ObjectWithPosition){
    return <[dx: number, dy: number]>[obj2.x - obj1.x, obj2.y - obj1.y]
}

interface ObjectWithAngle extends ObjectWithPosition {
    angle: number
}

const FULL_TURN_TIME = 0.5
export function getTurnTime(obj1: ObjectWithAngle, obj2: ObjectWithPosition){
    let [dx, dy] = deltaPos(obj1, obj2)
    let ta = Atan2(dy, dx)
    ta = ta >= 0 ? ta : 2 * math.pi + ta

    return FULL_TURN_TIME * math.abs(ta - obj1.angle) / math.pi
}