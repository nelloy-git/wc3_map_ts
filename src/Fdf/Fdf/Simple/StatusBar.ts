import { Fdf } from "../../Fdf";

export class SimpleStatusBar extends Fdf {
    constructor(name: string){
        super(name, 'SIMPLESTATUSBAR', true)
    }

    get width(){return this._width}
    set width(w: number){
        this._setParam('Width', w.toString())
        this._width = w
    }

    get height(){return this._height}
    set height(h: number){
        this._setParam('Height', h.toString())
        this._height = h
    }

    get decorateFileNames(){return this._decorate}
    set decorateFileNames(flag: boolean){
        if (flag){
            this._setParam('DecorateFileNames')
        } else {
            this._removeParam('DecorateFileNames')
        }
        this._decorate = flag
    }

    get setAllPoints(){return this._all_points}
    set setAllPoints(flag: boolean){
        if (flag){
            this._setParam('SetAllPoints')
        } else {
            this._removeParam('SetAllPoints')
        }
        this._all_points = flag
    }

    get barTexture(){return this._bar_texture}
    set barTexture(path: string){
        this._bar_texture = path
        this._setParam('BarTexture', '\"' + path + '\"')
    }
    
    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _all_points: boolean = false;
    private _bar_texture: string = '';
}