import { hUnit } from '../Handle'
import { TextTag } from '../Handle/TextTag'
import { Damage } from '../Parameter'

export namespace InterfaceDamage {
    export function Init(){
        Damage.addModifier(-10000, showDamage)
    }

    function showDamage(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
        if (dmg < 0.5){return dmg}

        let color = Damage.getColor(type)
        let x_vel = 0.05 * Math.random()
        let y_vel = 0.05 - x_vel
        let h = 100 * Math.random()

        TextTag.Timed(Math.floor(dmg).toString(), 12, color,
                      dst.x, dst.y, dst.z + h,
                      x_vel, y_vel, 1)

        return dmg
    }

}