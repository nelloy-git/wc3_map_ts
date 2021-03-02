// export type Path = {
//     readonly x: number,
//     readonly y: number,
//     readonly f: number
// }

// export namespace Path {
//     export function create(x: number, y: number, flags: number): Path{
//         return {x: x, y: y, f: flags}
//     }

//     export function isWalkable(p: Path){
//         return (p.f & 0x02) == 0
//     }

//     export function isFlyable(p: Path){
//         return (p.f & 0x04) == 0
//     }

//     export function isBuildable(p: Path){
//         return (p.f & 0x08) == 0
//     }

//     export function isVisible(p: Path){
//         return (p.f & 0x20) == 0
//     }

//     export function isWater(p: Path){
//         return (p.f & 0x40) == 0
//     }
// }