import * as Frame from "../FrameExt";

import { hUnit } from "../Handle";
import { Vec2 } from "../Utils";
import { Selection } from "../WcIO";
// import { UnitInst } from "../Gameplay/Units/UnitType";
import { InterfaceAbilityPanel } from "./Ability/Panel";
import { InterfaceDamage } from "./Damage";
import { InterfaceMinimap } from "./Minimap";
import { IUnit } from "./Unit";
import { InterfaceUnitInfoPanel } from './UnitInfo/Panel'
import { UnitWorldBars } from "./UnitWorldInfo";

const skills_cols = 6
const skills_rows = 1

export function tmp(){

}

function Init(this: void){
    print('Interface initilizing')

    InterfaceDamage.Init()
    UnitWorldBars.Init()

    let map = InterfaceMinimap.inst
    
    let unit_info = InterfaceUnitInfoPanel.inst
    unit_info.visible = false

    let skills = new InterfaceAbilityPanel(skills_cols, skills_rows)
    skills.visible = false

    Frame.Screen.addAction((sc_pos, sc_size)=>{
        map.size = new Vec2(0.15, 0.15)
        map.pos = new Vec2(sc_pos.x, sc_pos.y + sc_size.y - map.height)

        unit_info.size = new Vec2(0.2, 0.2)
        unit_info.pos = new Vec2(Math.max(sc_pos.x, -(unit_info.size.x + 0.03)),
                                 sc_pos.x <= -(unit_info.size.x + 0.05) ? 0 : 0.03)

        skills.size = new Vec2(0.05 * skills_cols, 0.05 * skills_rows)
        skills.pos = new Vec2(sc_pos.x + (sc_size.x - skills.width) / 2,
                              sc_pos.y + (sc_size.y - skills.height))
    })

    Selection.addAction((pl, gr)=>{
        if (pl != GetLocalPlayer()){return}

        let u: IUnit | undefined
        if (gr.length == 1){
            u = IUnit(hUnit.get(gr[0]))
        } 

        unit_info.unit = u
        skills.unit = u
    })

    skills.setKey(0, 0, OSKEY_Q)
    skills.setKey(1, 0, OSKEY_W)
    skills.setKey(2, 0, OSKEY_E)
    skills.setKey(3, 0, OSKEY_R)
    skills.setKey(4, 0, OSKEY_D)
    skills.setKey(5, 0, OSKEY_F)

    print('Interface initilizing done')
}

Frame.onInit(Init)