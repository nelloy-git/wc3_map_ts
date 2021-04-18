import { id2int } from './Id'

type Vec2 = {
    x: number
    y: number
}

let _item = IsGame() ? (()=>{
    let it = CreateItem(id2int('rat9'), 0, 0)
    SetItemVisible(it, false)
    return it
})() : <jitem><unknown>undefined

export function isPathable(this:void, v: Vec2) : boolean
export function isPathable(this:void, x: number, y: number) : boolean
export function isPathable(this:void, x_or_v: number | Vec2, y?: number){
    let x
    if (typeof x_or_v === 'number'){
        x = x_or_v
        y = <number>y
    } else {
        x = x_or_v.x
        y = x_or_v.y
    }

    SetItemPosition(_item, x, y)
    SetItemVisible(_item, false)

    let it_x = GetItemX(_item)
    let it_y = GetItemY(_item)
    if (it_x > x + 1 || it_x < x - 1 ||
        it_y > y + 1 || it_y < y - 1){
        return false
    }
    return true
}