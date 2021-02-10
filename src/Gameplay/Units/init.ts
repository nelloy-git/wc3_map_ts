import { getFileDir } from "../../Utils";
import { UnitType } from "../JsonUtils/UnitType";

let __dir__ = Macro(getFileDir())

export let OgreType = new UnitType(__dir__ + '/json/Ogre.json')