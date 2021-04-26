import { TBuff } from './TBuff'
import { TData } from './Data/Type'
import { TDuration } from './Duration/Type'

const TestData = new TData<void>()

const TestDur = new TDuration<void>()

export const TestType = new TBuff(TestData, TestDur)