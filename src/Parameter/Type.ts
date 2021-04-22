// import { Color } from "../../src/Utils";

const Enum = {
    PATK: 'PATK', 
    PSPD: 'PSPD', 
    PDEF: 'PDEF',
    PRES: 'PRES', 
    MATK: 'MATK', 
    MSPD: 'MSPD', 
    MDEF: 'MDEF', 
    MRES: 'MRES', 
    CRIT: 'CRIT', 
    LIFE: 'LIFE', 
    REGE: 'REGE', 
    MANA: 'MANA', 
    RECO: 'RECO', 
    MOVE: 'MOVE', 
}

export type Type = keyof typeof Enum

function createList(){
    let l: Type[] = []
    for (const param in Enum){
        l.push(<Type>param)
    }
    return l
}

export const List: ReadonlyArray<Type> = createList()

// export namespace Type {

//     export function defaultUnitBase(param: Type){
//         if      (param == 'PATK'){return 1}
//         else if (param == 'PSPD'){return 1}
//         else if (param == 'MSPD'){return 1}
//         else if (param == 'LIFE'){return 10}
//         else if (param == 'MANA'){return 10}
//         else if (param == 'MOVE'){return 300}
//         return 0
//     }

//     let def_min = Macro(-math.pow(10, 10))
//     export function unitMin(param: Type){
//         if      (param == 'PSPD'){return 0.01}
//         else if (param == 'MSPD'){return 0.01}
//         else if (param == 'PRES'){return -1}
//         else if (param == 'MRES'){return -1}
//         else if (param == 'CRIT'){return  0}
//         else if (param == 'LIFE'){return 10}
//         else if (param == 'MANA'){return 10}
//         else {return def_min}
//     }

//     let def_max = Macro(math.pow(10, 10))
//     export function unitMax(param: Type){
//         if      (param == 'PRES'){return 1}
//         else if (param == 'MRES'){return 1}
//         else if (param == 'CRIT'){return 1}
//         else if (param == 'MOVE'){return 500}
//         else {return def_max}
//     }

//     let def_color = new Color(1, 1, 1, 1)
//     export function color(param: Type){
//         switch (param){
//             // TODO
//             default: {return new Color(def_color)}
//         }
//     }
// }