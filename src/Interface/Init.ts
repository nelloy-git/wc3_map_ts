import { Screen } from "../FrameExt";
import { InterfaceAbilityPanel } from "./Ability/Panel";
import { Minimap } from "./Minimap";
import { Portrait } from "./Portrait";

export function Init(){
    let map = Minimap.instance
    Screen.addAction(([x0, y0], [w, h])=>{
        map.size = [0.12, 0.12]
        map.pos = [x0, y0 + h - map.size[1]]
    })

    let portrait = Portrait.instance
    Screen.addAction(([x0, y0], [w, h])=>{
        portrait.size = [0.1, 0.1]
        portrait.pos = [x0, 0.03]
    })
    
    let skills_cols = 6
    let skills_rows = 1
    let skills = new InterfaceAbilityPanel(skills_cols, skills_rows)
    Screen.addAction(([x0, y0], [w, h])=>{
        let [skills_w, skill_h] = skills.size
        skills.size = [0.05 * skills_cols, 0.05 * skills_rows]
        skills.pos = [x0 + (w - skills_w) / 2, y0 + h - skill_h]
    })
}