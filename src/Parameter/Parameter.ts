import { Color } from "../Utils";

export namespace Parameter {
    export type Type = 'PATK'|'PSPD'|'PDEF'|'PRES'|'MATK'|'MSPD'|'MDEF'|
                       'MRES'|'CRIT'|'LIFE'|'REGE'|'MANA'|'RECO'|'MOVE'

    let def_min = -10^10
    export function min(param: Parameter.Type){
        switch (param){
            case 'PRES': {return -1}
            case 'MRES': {return -1}
            case 'CRIT': {return  0}
            case 'LIFE': {return 10}
            case 'MANA': {return 10}
            default: {return def_min}
        }
    }

    let def_max = 10^10
    export function max(param: Parameter.Type){
        switch (param){
            case 'PRES': {return 1}
            case 'MRES': {return 1}
            case 'CRIT': {return 1}
            case 'MOVE': {return 500}
            default: {return def_max}
        }
    }

    let def_color = new Color(1, 1, 1, 1)
    export function color(param: Parameter.Type){
        switch (param){
            // TODO
            default: {return new Color(def_color)}
        }
    }
}