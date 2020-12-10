import { Backdrop, FdfBackdrop, OriginPortrait } from "../../FrameExt"

export class InterfacePortrait extends Backdrop {
    private constructor(){
        super(InterfacePortrait._fdf)
        this.visible = false
    }
    static get instance(){return InterfacePortrait._instance as InterfacePortrait}

    protected _set_pos(pos: [x: number, y: number]){
        super._set_pos(pos)
        let orig = OriginPortrait.instance()
        if (orig){
            orig.pos = [pos[0] + 0.05 * this.size[0], pos[1] + 0.05 * this.size[1]]
        }
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        let orig = OriginPortrait.instance()
        if (orig){
            orig.size = [0.9 * this.size[0], 0.9 * this.size[1]]
        }
        this.pos = this.pos
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag)
        let orig = OriginPortrait.instance()
        if (orig){
            orig.visible = flag
        }
    }

    private static _fdf = (()=>{
        let fdf = new FdfBackdrop(InterfacePortrait.name)
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
    private static _instance = IsGame() ? new InterfacePortrait() : undefined
}