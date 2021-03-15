import { Screen } from "../FrameExt";
import { hUnit } from "../Handle";
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

export function Init(){
    InterfaceDamage.Init()
    UnitWorldBars.Init()

    let map = InterfaceMinimap.instance
    let unit_info = InterfaceUnitInfoPanel.instance
    let skills = new InterfaceAbilityPanel(skills_cols, skills_rows)

    Screen.addAction(([x0, y0], [w, h])=>{
        let x = math.max(x0, -0.22)

        map.size = [0.12, 0.12]
        map.pos = [x, y0 + h - map.size[1]]

        unit_info.size = [0.2, 0.2]
        unit_info.pos = [x, x < -0.21 ? 0 : 0.03]

        skills.size = [0.05 * skills_cols, 0.05 * skills_rows]
        let [skills_w, skill_h] = skills.size
        skills.pos = [x0 + (w - skills_w) / 2, y0 + h - skill_h]
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
}