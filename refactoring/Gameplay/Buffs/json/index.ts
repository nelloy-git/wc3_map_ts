import * as Json from '../../../../src/Json'
import { getFileDir } from '../../../../src/Utils'

const __dir__ = Macro(getFileDir())

export const Acid = new Json.Cached(__dir__ + '/Acid.json').data
export const Push = new Json.Cached(__dir__ + '/Push.json').data
export const TossUp = new Json.Cached(__dir__ + '/TossUp.json').data