import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Effect extends Handle<jeffect> {
    constructor(model: string, x: number, y:number, z: number){
        super(AddSpecialEffect(model, x, y))
        BlzSetSpecialEffectHeight(this.handle, z)
    }
    public static get(id: jeffect | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'effect'){
            Log.err('Effect: got wrong type of handle.', 2)
        }
        return instance as Effect
    }

    public get x(){return BlzGetLocalSpecialEffectX(this.handle)}
    public set x(x: number){BlzSetSpecialEffectPosition(this.handle, x, this.y, this.z)}
    
    public get y(){return BlzGetLocalSpecialEffectY(this.handle)}
    public set y(y: number){BlzSetSpecialEffectPosition(this.handle, this.x, y, this.z)}
    
    public get z(){return BlzGetLocalSpecialEffectZ(this.handle)}
    public set z(z: number){BlzSetSpecialEffectPosition(this.handle, this.x, this.y, z)}

    public get yaw(){return this._yaw}
    public set yaw(yaw: number){
        this._yaw = yaw
        BlzSetSpecialEffectOrientation(this.handle, this._yaw, this._pitch, this._roll)
    }

    public get pitch(){return this._pitch}
    public set pitch(pitch: number){
        this._pitch = pitch
        BlzSetSpecialEffectOrientation(this.handle, this._yaw, this._pitch, this._roll)
    }

    public get roll(){return this._roll}
    public set roll(roll: number){
        this._roll = roll
        BlzSetSpecialEffectOrientation(this.handle, this._yaw, this._pitch, this._roll)
    }

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        BlzSetSpecialEffectColor(this.handle, 255 * color.r, 255 *  color.g, 255 * color.b)
        BlzSetSpecialEffectAlpha(this.handle, 255 * color.a)
    }

    protected _destroy(){
        BlzSetSpecialEffectScale(this.handle, 0.001)
        DestroyEffect(this.handle)
    }

    private _yaw: number = 0;
    private _pitch: number = 0;
    private _roll: number = 0;
    private _color: Color = new Color(1, 1, 1, 1);
}