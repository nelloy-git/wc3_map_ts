import { Screen } from "../FrameExt";
import { hUnit } from "../Handle";
import { Selection } from "../Input";
import { InterfaceAbilityPanel } from "./Ability/Panel";
import { InterfaceDamage } from "./Damage";
import { InterfaceMinimap } from "./Minimap";
import { InterfaceUnitBars } from "./UnitInfo/Bars";
import { InterfaceUnitParameters } from "./UnitInfo/Parameters";
import { InterfacePortrait } from "./UnitInfo/Portrait";

export function Init(){
    InterfaceDamage.Init()

    let map = InterfaceMinimap.instance
    Screen.addAction(([x0, y0], [w, h])=>{
        map.size = [0.12, 0.12]
        map.pos = [x0, y0 + h - map.size[1]]
    })

    let portrait = InterfacePortrait.instance

    let bars = new InterfaceUnitBars()
    bars.parent = portrait

    let params = new InterfaceUnitParameters()
    params.parent = portrait
    
    let skills_cols = 6
    let skills_rows = 1
    let skills = new InterfaceAbilityPanel(skills_cols, skills_rows)

    Screen.addAction(([x0, y0], [w, h])=>{
        portrait.size = [0.1, 0.1]
        portrait.pos = [x0, 0.03]

        bars.size = [1.5 * portrait.size[0], portrait.size[1] / 2]
        bars.pos = [portrait.size[0], 0]

        params.size = [portrait.size[0], 1.5 * portrait.size[1]]
        params.pos = [0, portrait.size[1]]

        skills.size = [0.05 * skills_cols, 0.05 * skills_rows]
        let [skills_w, skill_h] = skills.size
        skills.pos = [x0 + (w - skills_w) / 2, y0 + h - skill_h]
    })

    Selection.addAction((pl, gr)=>{
        let u: hUnit | undefined = undefined
        if (gr.length == 1){
            u = hUnit.get(gr[0])
        }

        bars.unit = u
        params.unit = u
        portrait.visible = u != undefined
        skills.unit = u
    })
}