import * as Json from '../../../Json'
import { getFileDir } from '../../../Utils'

const __dir__ = Macro(getFileDir())

export const Push = new Json.Cached(__dir__ + '/Push.json').data
export const TossUp = new Json.Cached(__dir__ + '/TossUp.json').data