import { Backdrop, FdfBackdrop, OriginMinimap } from "../FrameExt"

export class Minimap extends Backdrop {
    private constructor(){
        super(Minimap._fdf)
    }
    static instance = new Minimap()

    get pos(){return this._get_pos()}
    set pos(pos: [x: number, y: number]){
        this._set_pos(pos)
        let orig = OriginMinimap.instance()
        if (orig){
            if (orig.parent != this){orig.parent = this}
            orig.pos = [0.05 * pos[0], 0.05 * pos[1]]
        }
    }

    get size(){return this._get_size()}
    set size(size: [w: number, h: number]){
        this._set_size(size)
        let orig = OriginMinimap.instance()
        if (orig){
            if (orig.parent != this){orig.parent = this}
            orig.size = [0.9 * size[0], 0.9 * size[1]]
        }
    }

    private static _fdf = (()=>{
        let fdf = new FdfBackdrop('InterfaceMinimapBackground')
        fdf.width = 0.04
        fdf.height = 0.04
        fdf.backgroundTileMode = true
        fdf.backgroudTileSize = 0.2
        fdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
        fdf.blendAll = true
        fdf.insets = [0.005, 0.005, 0.005, 0.005]
        fdf.cornarFlags = ['UL','UR','BL','BR','T','L','B','R']
        fdf.cornerSize = 0.0125
        fdf.edgeFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-border'
        return fdf
    })()
}