import { TBuff } from './TBuff'
import { TData } from './TData'
import { TDuration } from './TDuration'

const TestData = new TData<void>()

const TestDur = new TDuration<void>()

export const TestType = new TBuff(TestData, TestDur)