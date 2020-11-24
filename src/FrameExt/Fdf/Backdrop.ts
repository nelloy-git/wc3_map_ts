import { Fdf } from "../Fdf";

type BackdropCornerFlags = 'UL'|'UR'|'BL'|'BR'|'T'|'L'|'B'|'R'

export class FdfBackdrop extends Fdf {
    constructor(name: string){
        super(name, 'BACKDROP', false)
    }

    public get width(){return this._width}
    public set width(w: number){
        this._setParam('Width', w.toString())
        this._width = w
    }

    public get height(){return this._height}
    public set height(h: number){
        this._setParam('Height', h.toString())
        this._height = h
    }

    public get decorateFileNames(){return this._decorate}
    public set decorateFileNames(flag: boolean){
        if (flag){
            this._setParam('DecorateFileNames')
        } else {
            this._removeParam('DecorateFileNames')
        }
        this._decorate = flag
    }

    public get setAllPoints(){return this._all_points}
    public set setAllPoints(flag: boolean){
        if (flag){
            this._setParam('SetAllPoints')
        } else {
            this._removeParam('SetAllPoints')
        }
        this._all_points = flag
    }

    public get backgroundTileMode(){return this._tile_mode}
    public set backgroundTileMode(flag: boolean){
        if (flag){
            this._setParam('BackdropTileBackground')
        } else {
            this._removeParam('BackdropTileBackground')
        }
        this._tile_mode = flag
    }

    public get backgroudTileSize(){return this._tile_size}
    public set backgroudTileSize(size: number){
        this._setParam('BackdropBackgroundSize', size.toString())
        this._tile_size = size
    }

    public get background(){return this._background}
    public set background(path: string){
        this._setParam('BackdropBackground', path)
        this._background = path
    }

    public get insets(){return this._insets}
    public set insets(insets: [right: number, top: number, bottom: number, left: number]){
        let [right, top, bottom, left] = insets
        this._setParam('BackdropBackgroundInsets',
                        string.format('%f %f %f %f', right, top, bottom, left))
        this._insets = insets
    }

    public get cornerFlags(){return this._cornerFlags}
    public set cornarFlags(flags: BackdropCornerFlags[]){
        let s_flags = flags.length > 0 ? flags[0] : ''
        for (let i = 1; i < flags.length; i++){
            s_flags += '|' + flags[i]
        }
        this._setParam('BackdropCornerFlags', '\"' + s_flags + '\"')
        this._cornerFlags = flags
    }

    public get cornerSize(){return this._cornerSize}
    public set cornerSize(size: number){
        size = size > 1 ? 1 : size < 0 ? 0 : size
        this._setParam('BackdropCornerSize', size.toString())
        this._cornerSize = size
    }

    public get edgeFile(){return this._edgeFile}
    public set edgeFile(path: string){
        this._setParam('BackdropEdgeFile', '\"' + path + '\"')
        this._edgeFile = path
    }
    
    public get blendAll(){return this._blend}
    public set blendAll(flag: boolean){
        if (flag){
            this._setParam('BackdropBlendAll')
        } else {
            this._removeParam('BackdropBlendAll')
        }
        this._blend = flag
    }

    public get mirrored(){return this._mirrored}
    public set mirrored(flag: boolean){
        if (flag){
            this._setParam('BackdropMirrored')
        } else {
            this._removeParam('BackdropMirrored')
        }
        this._mirrored = flag
    }

    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _all_points: boolean = false;
    private _tile_mode: boolean = false;
    private _tile_size: number = 1;
    private _background: string = '';
    private _insets: [number, number, number, number] = [0, 0, 0, 0];
    private _cornerFlags: BackdropCornerFlags[] = [];
    private _cornerSize: number = 0;
    private _edgeFile: string = '';
    private _blend: boolean = false;
    private _mirrored: boolean = false;
}