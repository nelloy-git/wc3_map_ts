import * as Frame from '../../FrameExt'
import { hTimer } from '../../../src/Handle'
import { Vec2 } from '../../../src/Utils'

import { MouseDetectGrid } from './Grid'

const STEP_TIME = 0.025
// const GRID_SIZE = 8
// const ROI_SIZE = 3

export class MouseDetector {
    constructor(grid_size: number = 8, roi_size: number = 3){
        this.__precision = 0.01
        this.pos = new Vec2(0, 0)
        this.__pos = Frame.Screen.pos
        this.__bad_pos = Frame.Screen.pos
        this.__size = Frame.Screen.size
        this.__grid_size = grid_size >= 2 ? math.floor(grid_size) : 2
        this.__roi_size = roi_size >= 2 ? math.floor(roi_size) : 2

        this.__grid = new MouseDetectGrid(this.__grid_size, this.__grid_size)
        this.__grid.pos = new Vec2(-1, -1)
        this.__grid.size = new Vec2(0, 0)

        this.__timer = new hTimer()
        this.__filter = new hTimer()
        this.__enable = false
        this.__seach_period = this.__getSearchPeriod()
    }

    private __startSearch(){
        this.__bad_pos = Frame.Screen.pos
        this.__size = Frame.Screen.size
        this.__grid.pos = this.__bad_pos
        this.__grid.size = this.__size
        this.__getBetterPos()
    }

    private __getBetterPos(){
        let t = new hTimer()
        t.addAction(() => {
            t.destroy()
            let found: boolean
            [found, this.__bad_pos, this.__size] = this.__grid.getMousePos()

            if (!found){
                this.__pos = this.__bad_pos.add(this.__size.mult(0.5))
                this.__grid.pos = new Vec2(-1, -1)
                return
            }

            this.__grid.pos = this.__bad_pos.sub(this.__size.mult((this.__roi_size - 1) / 2))
            this.__grid.size = this.__size.mult(this.__roi_size)

            if (this.__size.x > this.__precision || this.__size.y > this.__precision){
                this.__getBetterPos()
                return
            }

            this.__pos = this.__bad_pos.add(this.__size.mult(0.5))
            this.__grid.pos = new Vec2(-1, -1)
        })
        t.start(STEP_TIME, false)
    }

    private __getSearchPeriod(){
        let period = STEP_TIME
        let prec = this.__precision
        while (prec < Frame.Screen.size.x){
            prec *= this.__grid_size / this.__roi_size
            period += STEP_TIME
        }
        return period
    }

    private __lerp(cur: Vec2, next: Vec2, k: number){
        return cur.add(next.sub(cur).mult(k))
    }

    get enable(){return this.__enable}
    set enable(f: boolean){
        if (this.__enable == f){
            return
        }

        if (f){
            this.__timer = new hTimer()
            this.__timer.addAction(() => {this.__startSearch()})
            this.__timer.start(this.__seach_period, true)

            this.__filter = new hTimer()
            this.__filter.addAction(() => {(<Vec2>this.pos) = this.__lerp(this.pos, this.__pos, 0.1)})
            this.__filter.start(0.03, true)

            this.__grid.pos = new Vec2(-1, -1)
        } else {
            this.__timer.destroy()
            this.__filter.destroy()
        }

        this.__enable = f
    }

    get precision(){return this.__precision}
    set precision(p: number){
        this.__precision = p > 0 ? p : 0.001
        this.__seach_period = this.__getSearchPeriod()
        let cur = this.__enable
        this.enable = false
        this.enable = cur
    }

    readonly pos: Vec2

    private __precision: number
    private __seach_period: number
    private __enable: boolean
    private __timer: hTimer
    private __filter: hTimer

    private __pos: Vec2
    private __bad_pos: Vec2
    private __size: Vec2

    private __grid: MouseDetectGrid

    private __grid_size: number
    private __roi_size: number
}