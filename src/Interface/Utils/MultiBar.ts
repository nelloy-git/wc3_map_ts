import * as Frame from '../../FrameExt'

export class InterfaceMultiBar extends Frame.SimpleEmpty {
    constructor(count: number){
        super()

        this.background = new Frame.SimpleImage()
        this.background.parent = this
        this.background.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'
        this.background.level = 0

        this._bars = []
        this._bar_heights = []
        for (let i = 0; i < count; i++){
            let bar = new Frame.SimpleStatusBar()
            bar.parent = this
            bar.level = i + 1
            this._bars.push(bar)

            this._bar_heights.push(1)
        }

        this.border = new Frame.SimpleImage()
        this.border.parent = this
        this.border.texture = 'UI\\Feedback\\XPBar\\human-xpbar-border.blp'
        this.border.level = count

        this.text = new Frame.SimpleText()
        this.text.parent = this
        this.text.text = ''
        this.text.level = count + 1
    }

    setBarHeightPart(pos: number, h: number){
        this._bar_heights[pos] = h < 0 ? 0 : h > 1 ? 1 : h
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        let [w, h] = size

        this.background.size = size
        for (let i = 0; i < this._bars.length; i++){
            this._bars[i].size = [w, this._bar_heights[i] * h]
        }
        this.border.size = size
        this.text.size = size
        this.text.fontSize = 0.8 * h
    }

    readonly background: Frame.SimpleImage
    readonly border: Frame.SimpleImage
    readonly text: Frame.SimpleText
    bar(pos: number){return this._bars[pos]}
    
    private _bars: Frame.SimpleStatusBar[]
    private _bar_heights: number[]
}