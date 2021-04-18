let __loc = IsGame() ? Location(0, 0) : <jlocation><unknown>undefined
export function getTerrainZ(this:void, x: number, y: number){
    MoveLocation(__loc, x, y)
    return GetLocationZ(__loc)
}