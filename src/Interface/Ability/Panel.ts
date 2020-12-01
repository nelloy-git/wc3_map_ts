import { Ability } from "../../AbilityExt";
import { Backdrop, FdfBackdrop } from "../../FrameExt";
import { InterfaceAbilityButton } from "./Button";

export class InterfaceAbilityPanel extends Backdrop {
    constructor(cols: number, rows: number){
        super()
        this._cols = cols
        this._rows = rows

        this.alpha = 0
        for (let y = 0; y < rows; y++){
            this._backgrounds.push([])
            this._buttons.push([])

            for (let x = 0; x < cols; x++){
                let back = new Backdrop(InterfaceAbilityPanel._background_fdf)
                back.parent = this
                this._backgrounds[y].push(back)

                let btn = new InterfaceAbilityButton()
                btn.parent = back
                this._buttons[y].push(btn)
            }
        }
        this.size = this.size
    }

    get size(){return this._get_size()}
    set size(size: [number, number]){
        this._set_size(size)

        let w = size[0] / this._cols
        let h = size[1] / this._rows

        for (let y = 0; y < this._rows; y++){
            for (let x = 0; x < this._cols; x++){
                this._backgrounds[y][x].pos = [x * w, y * h]
                this._backgrounds[y][x].size = [w, h]

                this._buttons[y][x].pos = [0.1 * w, 0.1 * h]
                this._buttons[y][x].size = [0.8 * w, 0.8 * h]
            }
        }
    }

    setAbility(x: number, y: number, abil: Ability){
        this._buttons[y][x].ability = abil
    }

    private _cols
    private _rows
    private _backgrounds: Backdrop[][] = [];
    private _buttons: InterfaceAbilityButton[][] = []

    private static _background_fdf = (() => {
        let fdf = new FdfBackdrop('InterfaceAbilityPanelBackground')
        fdf.width = 0.1
        fdf.height = 0.1
        fdf.backgroundTileMode = true
        fdf.backgroudTileSize = 0.2
        fdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
        fdf.blendAll = true
        fdf.insets = [0.001, 0.001, 0.001, 0.001]
        fdf.cornarFlags = ['UL', 'UR', 'BL', 'BR', 'T', 'L', 'B', 'R']
        fdf.cornerSize = 0.0125
        fdf.edgeFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-border'
        return fdf
    })()
}