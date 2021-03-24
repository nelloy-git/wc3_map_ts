// import * as Abil from "../../AbilityExt";
// import { Log } from "../../Utils";

// import { GAbility } from './Ability'

// export class GAbilityType<T extends Abil.TargetType[]> extends Abil.TAbility<T> {
//     constructor(ttarg: Abil.TTargeting<T>, json_path: string){
//         super()

//         this.json_path = json_path

//         let tcast = new Abil.TCasting<T>()
//         tcast.start = (abil, targ) => {
//             this.castingStart(<any>GAbility.get(<any>abil), targ)
//         }

//         let tdata = new Abil.TData<T>()


//         this.__tabil = new Abil.TAbility(tcast, tdata, ttarg)
//     }

//     static get(tabil: Abil.TAbility<Abil.TargetType[]>){
//         let gtabil = GAbilityType.__tabil2this.get(tabil)
//         if (!gtabil){
//             return Log.err('')
//         }
//         return gtabil
//     }

//     abstract castingStart(abil: GAbility<T>, target: Abil.TargetType[]): void
//     abstract castingLoop(): void
//     abstract castingCancel(): void
//     abstract castingInterrupt(): void
//     abstract castingFinish(): void

//     readonly json_path: string
//     private readonly __tabil: Abil.TAbility<T>

//     private static __tabil2this = new Map<Abil.TAbility<Abil.TargetType[]>, GAbilityType<Abil.TargetType[]>>()
// }