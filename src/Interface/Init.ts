import { Screen } from "../FrameExt";
import { hUnit } from "../Handle";
import { Selection } from "../Input";
import { InterfaceAbilityPanel } from "./Ability/Panel";
import { InterfaceDamage } from "./Damage";
import { InterfaceMinimap } from "./Minimap";
import { InterfaceUnitInfoPanel } from './UnitInfo/Panel'

namespace pos {
    let map = [0.12, 0.12]
}

export function Init(){
    InterfaceDamage.Init()

    let map = InterfaceMinimap.instance
    Screen.addAction(([x0, y0], [w, h])=>{
        map.size = [0.12, 0.12]
        map.pos = [x0, y0 + h - map.size[1]]
    })

    let unit_info = InterfaceUnitInfoPanel.instance
    
    let skills_cols = 6
    let skills_rows = 1
    let skills = new InterfaceAbilityPanel(skills_cols, skills_rows)

    Screen.addAction(([x0, y0], [w, h])=>{
        unit_info.pos = [x0, y0 + 0.03]
        unit_info.size = [0.2, 0.2]

        skills.size = [0.05 * skills_cols, 0.05 * skills_rows]
        let [skills_w, skill_h] = skills.size
        skills.pos = [x0 + (w - skills_w) / 2, y0 + h - skill_h]
    })

    Selection.addAction((pl, gr)=>{
        let u: hUnit | undefined = undefined
        if (gr.length == 1){
            u = hUnit.get(gr[0])
        }

        unit_info.unit = u
        skills.unit = u
    })
}