// import * as Frame from '../../FrameExt'
// import { Vec2 } from '../../Utils'

// export class InterfaceMultiBar extends Frame.SimpleEmpty {
//     constructor(count: number){
//         super()

//         this.background = new Frame.SimpleImage()
//         this.background.parent = this
//         this.background.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'
//         this.background.level = 0

//         this.__bars = []
//         this.__bar_heights = []
//         for (let i = 0; i < count; i++){
//             let bar = new Frame.SimpleStatusBar()
//             bar.parent = this
//             bar.level = i + 1
//             this.__bars.push(bar)

//             this.__bar_heights.push(1)
//         }

//         this.border = new Frame.SimpleImage()
//         this.border.parent = this
//         this.border.texture = 'UI\\Feedback\\XPBar\\human-xpbar-border.blp'
//         this.border.level = count

//         this.text = new Frame.SimpleText()
//         this.text.parent = this
//         this.text.text = ''
//         this.text.level = count + 1
//     }
    
//     bar(pos: number){return this.__bars[pos]}

//     setBarHeightPart(pos: number, h: number){
//         this.__bar_heights[pos] = h < 0 ? 0 : h > 1 ? 1 : h
//     }

//     protected _set_size(size: Vec2){
//         super._set_size(size)

//         this.background.size = size
//         for (let i = 0; i < this.__bars.length; i++){
//             this.__bars[i].size = new Vec2(size.x , this.__bar_heights[i] * size.y)
//         }
//         this.border.size = size
//         this.text.size = size
//         this.text.fontSize = 0.8 * size.y
//     }

//     readonly background: Frame.SimpleImage
//     readonly border: Frame.SimpleImage
//     readonly text: Frame.SimpleText
    
//     private __bars: Frame.SimpleStatusBar[]
//     private __bar_heights: number[]
// }