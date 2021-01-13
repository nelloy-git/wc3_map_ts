import { Screen } from "../FrameExt";
import { hUnit } from "../Handle";
import { Selection } from "../Input";
import { UnitExt } from "../UnitExt/UnitExt";
import { InterfaceAbilityPanel } from "./Ability/Panel";
import { InterfaceDamage } from "./Damage";
import { InterfaceMinimap } from "./Minimap";
import { InterfaceUnitInfoPanel } from './UnitInfo/Panel'
import { InterfaceUnitWorldInfo } from "./UnitWorldInfo";

export function Init(){
    InterfaceDamage.Init()
    InterfaceUnitWorldInfo.Init()

    let map = InterfaceMinimap.instance
    Screen.addAction(([x0, y0], [w, h])=>{
        map.size = [0.12, 0.12]
        map.pos = [x0, y0 + h - map.size[1]]
    })

    let unit_info = InterfaceUnitInfoPanel.instance
    
    let skills_cols = 6
    let skills_rows = 1
    let skills = new InterfaceAbilityPanel(skills_cols, skills_rows)
    skills.setKey(0, 0, OSKEY_Q)
    skills.setKey(1, 0, OSKEY_W)
    skills.setKey(2, 0, OSKEY_E)
    skills.setKey(3, 0, OSKEY_R)
    skills.setKey(4, 0, OSKEY_D)
    skills.setKey(5, 0, OSKEY_F)

    Screen.addAction(([x0, y0], [w, h])=>{
        let x = math.max(x0, -0.22)
        let y = x < -0.21 ? 0 : 0.03
        unit_info.pos = [x, y]
        unit_info.size = [0.2, 0.2]

        skills.size = [0.05 * skills_cols, 0.05 * skills_rows]
        let [skills_w, skill_h] = skills.size
        skills.pos = [x0 + (w - skills_w) / 2, y0 + h - skill_h]
    })

    Selection.addAction((pl, gr)=>{
        if (pl != GetLocalPlayer()){return}

        let u: UnitExt | undefined
        if (gr.length == 1){
            u = UnitExt.get(gr[0])
        } 

        unit_info.unit = u
        skills.unit = u
    })
}