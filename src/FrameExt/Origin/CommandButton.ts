import { onPreInit } from '../Init'
import { Frame } from '../Frame'
import { log } from '../../Utils'
import { Vec2 } from '../../Math'

export class OriginCommandButton extends Frame {
    static inst(i: number){
        if (!OriginCommandButton.__instance){
            return error(OriginCommandButton.name + ': can not get origin frame before FrameExt finish initialization.', 2)
        }
        return OriginCommandButton.__instance[i]
    }

    protected _set_pos(v: Vec2){
        let parent = this.parent
        let parent_abs_pos = parent ? parent.abs_pos : new Vec2(0, 0)
        let size = this.size

        let new_min = parent_abs_pos.add(v)
        let new_max = new_min.add(size)

        if (new_min.x < 0 || new_min.y < 0 || new_max.x > 0.8, new_max.y > 0.6){
            log(this.toString() + 
                ': can not be moved correctly outside of [[0, 0], [0.8, 0.6]]')
        }

        super._set_pos(v)
    }

    protected _set_size(v: Vec2){
        let new_min = this.abs_pos
        let new_max = new_min.add(this.size)

        if (new_min.x < 0 || new_min.y < 0 || new_max.x > 0.8, new_max.y > 0.6){
            log(this.toString() + 
                ': can not be moved correctly outside of [[0, 0], [0.8, 0.6]]')
        }

        super._set_size(v)
    }

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    private static __instance: OriginCommandButton[] = <OriginCommandButton[]><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            OriginCommandButton.__instance = []
            for (let i = 0; i < 12; i++){
                let handle = BlzGetFrameByName("CommandButton_" + i.toString(), 0)
                if (!handle){
                    error(OriginCommandButton.name + ': failed to init.')
                }

                BlzFrameClearAllPoints(handle)
                BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))

                OriginCommandButton.__instance.push(new OriginCommandButton(handle))
            }
        })
    })()
}