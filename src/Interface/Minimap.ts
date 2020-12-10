import { Backdrop, FdfBackdrop, OriginMinimap } from "../FrameExt"

export class InterfaceMinimap extends Backdrop {
    private constructor(){
        super(InterfaceMinimap._fdf)
    }
    static get instance(){return InterfaceMinimap._instance as InterfaceMinimap}

    protected _set_pos(pos: [x: number, y: number]){
        super._set_pos(pos)
        let orig = OriginMinimap.instance()
        if (orig){
            if (orig.parent != this){orig.parent = this}
            orig.pos = [0.05 * this.size[0], 0.05 * this.size[1]]
        }
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        let orig = OriginMinimap.instance()
        if (orig){
            if (orig.parent != this){orig.parent = this}
            orig.size = [0.9 * this.size[0], 0.9 * this.size[1]]
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
        fdf.insets = [0.001, 0.001, 0.001, 0.001]
        fdf.cornarFlags = ['UL','UR','BL','BR','T','L','B','R']
        fdf.cornerSize = 0.0125
        fdf.edgeFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-border'
        return fdf
    })()
    private static _instance = IsGame() ? new InterfaceMinimap() : undefined
}