import * as Binary from '../../Binary'

import { getFileDir } from "../../Utils";
import { UnitTypeJson } from "../JsonUtils";

let __dir__ = Macro(getFileDir())

export let Ogre = new UnitTypeJson(Binary.Map.w3u, __dir__ + '/json/Ogre.json')