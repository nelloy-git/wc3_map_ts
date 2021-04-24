import { Fdf } from "../Fdf";

export class Backdrop extends Fdf {
    constructor(name: string){
        super(name, 'BACKDROP', false)
    }

    get width(){return this.__width}
    set width(w: number){
        this._setParam('Width', w.toString())
        this.__width = w
    }

    get height(){return this.__height}
    set height(h: number){
        this._setParam('Height', h.toString())
        this.__height = h
    }

    get decorateFileNames(){return this.__decorate}
    set decorateFileNames(flag: boolean){
        if (flag){
            this._setParam('DecorateFileNames')
        } else {
            this._removeParam('DecorateFileNames')
        }
        this.__decorate = flag
    }

    get setAllPoints(){return this.__all_points}
    set setAllPoints(flag: boolean){
        if (flag){
            this._setParam('SetAllPoints')
        } else {
            this._removeParam('SetAllPoints')
        }
        this.__all_points = flag
    }

    get backgroundTileMode(){return this.__tile_mode}
    set backgroundTileMode(flag: boolean){
        if (flag){
            this._setParam('BackdropTileBackground')
        } else {
            this._removeParam('BackdropTileBackground')
        }
        this.__tile_mode = flag
    }

    get backgroudTileSize(){return this.__tile_size}
    set backgroudTileSize(size: number){
        this._setParam('BackdropBackgroundSize', size.toString())
        this.__tile_size = size
    }

    get background(){return this.__background}
    set background(path: string){
        this._setParam('BackdropBackground', '\"' + path + '\"')
        this.__background = path
    }

    get insets(){return this.__insets}
    set insets(insets: [right: number, top: number, bottom: number, left: number]){
        let [right, top, bottom, left] = insets
        this._setParam('BackdropBackgroundInsets',
                        string.format('%f %f %f %f', right, top, bottom, left))
        this.__insets = insets
    }

    get cornerFlags(){return this.__cornerFlags}
    set cornarFlags(flags: Backdrop.CornerFlags[]){
        let s_flags = flags.length > 0 ? flags[0] : ''
        for (let i = 1; i < flags.length; i++){
            s_flags += '|' + flags[i]
        }
        this._setParam('BackdropCornerFlags', '\"' + s_flags + '\"')
        this.__cornerFlags = flags
    }

    get cornerSize(){return this.__cornerSize}
    set cornerSize(size: number){
        size = size > 1 ? 1 : size < 0 ? 0 : size
        this._setParam('BackdropCornerSize', size.toString())
        this.__cornerSize = size
    }

    get edgeFile(){return this.__edgeFile}
    set edgeFile(path: string){
        this._setParam('BackdropEdgeFile', '\"' + path + '\"')
        this.__edgeFile = path
    }
    
    get blendAll(){return this.__blend}
    set blendAll(flag: boolean){
        if (flag){
            this._setParam('BackdropBlendAll')
        } else {
            this._removeParam('BackdropBlendAll')
        }
        this.__blend = flag
    }

    get mirrored(){return this.__mirrored}
    set mirrored(flag: boolean){
        if (flag){
            this._setParam('BackdropMirrored')
        } else {
            this._removeParam('BackdropMirrored')
        }
        this.__mirrored = flag
    }

    private __width: number = -1;
    private __height: number = -1;
    private __decorate: boolean = false;
    private __all_points: boolean = false;
    private __tile_mode: boolean = false;
    private __tile_size: number = 1;
    private __background: string = '';
    private __insets: [number, number, number, number] = [0, 0, 0, 0];
    private __cornerFlags: Backdrop.CornerFlags[] = [];
    private __cornerSize: number = 0;
    private __edgeFile: string = '';
    private __blend: boolean = false;
    private __mirrored: boolean = false;
}

export namespace Backdrop {
    export type CornerFlags = 'UL'|'UR'|'BL'|'BR'|'T'|'L'|'B'|'R'
}