import { getTerrainZ } from "../../src/Utils"

export class Camera {
    private constructor(){}

    static set height(h: number){
        Camera._height = h
        SetCameraField(CAMERA_FIELD_ZOFFSET, h, 0)
    }

    private static _update(this: void){
        let targ_x = GetCameraTargetPositionX()
        let targ_y = GetCameraTargetPositionY()
        let targ_z = getTerrainZ(targ_x, targ_y)

        let eye_x = GetCameraEyePositionX()
        let eye_y = GetCameraEyePositionY()
        let eye_z = getTerrainZ(eye_x, eye_y)

        SetCameraFieldForPlayer(GetLocalPlayer(), CAMERA_FIELD_ZOFFSET,
                                (targ_z + eye_z)/2 + Camera._height, 0.3)
    }

    private static _height = 0

    private static _timer = IsGame() ? (()=>{
        let t = CreateTimer()
        TimerStart(t, 0.05, true, Camera._update)
        return t
    })() : <jtimer><unknown>undefined
}