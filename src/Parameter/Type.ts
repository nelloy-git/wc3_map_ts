import { Color } from "../Utils";

export class ParamType {
    private constructor(name: string, color: Color, min: number, max: number){
        this.name = name
        this._color = color
        this.min = min
        this.max = max
    }

    get color(){return new Color(this._color)}

    readonly name;
    readonly min;
    readonly max
    private _color;

    static PATK = new ParamType('PATK', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static PSPD = new ParamType('PSPD', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static PDEF = new ParamType('PDEF', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static PRES = new ParamType('PRES', new Color(1, 1, 1, 1), -(10^10),     1)
    static MATK = new ParamType('MATK', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static MSPD = new ParamType('MSPD', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static MDEF = new ParamType('MDEF', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static MRES = new ParamType('MRES', new Color(1, 1, 1, 1), -(10^10),     1)
    static CRIT = new ParamType('CRIT', new Color(1, 1, 1, 1), -(10^10),     1)
    static LIFE = new ParamType('LIFE', new Color(1, 1, 1, 1),       10, 10^10)
    static REGE = new ParamType('REGE', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static MANA = new ParamType('MANA', new Color(1, 1, 1, 1),       10, 10^10)
    static RECO = new ParamType('RECO', new Color(1, 1, 1, 1), -(10^10), 10^10)
    static MOVE = new ParamType('MOVE', new Color(1, 1, 1, 1), -(10^10),   500)
}