import { Backdrop, FdfBackdrop, OriginPortrait } from "../FrameExt"

export class Portrait extends Backdrop {
    private constructor(){
        super(Portrait._fdf)
    }
    static get instance(){return Portrait._instance as Portrait}

    get pos(){return this._get_pos()}
    set pos(pos: [x: number, y: number]){
        this._set_pos(pos)
        let orig = OriginPortrait.instance()
        if (orig){
            orig.pos = [pos[0] + 0.05 * this.size[0], pos[1] + 0.05 * this.size[1]]
        }
    }

    get size(){return this._get_size()}
    set size(size: [w: number, h: number]){
        this._set_size(size)
        let orig = OriginPortrait.instance()
        if (orig){
            orig.size = [0.9 * this.size[0], 0.9 * this.size[1]]
        }
    }

    private static _fdf = (()=>{
        let fdf = new FdfBackdrop('InterfacePortraitBackground')
        fdf.width = 0.04
        fdf.height = 0.04
        fdf.backgroundTileMode = true
        fdf.backgroudTileSize = 0.2
        fdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
        fdf.blendAll = true
        fdf.insets = [0.001, 0.001, 0.001, 0.001]
        fdf.cornarFlags = ['UL','UR','BL','BR','T','L','B','R']
        fdf.cornerSize = 0.0125
        fdf.edgeFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-border'
        return fdf
    })()
    private static _instance = IsGame() ? new Portrait() : undefined
}