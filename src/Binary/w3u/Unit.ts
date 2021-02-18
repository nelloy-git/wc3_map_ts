// import { Field } from "../Field";
// import { FieldUnit } from './Field'
// import { id2byte, int2byte } from "../Utils";
// import { UnitChange } from "./Change";
// import { Object } from "../Object";

// export class tUnit extends Object {
//     constructor(base_id: number, id: number, changes: UnitChange<any>[]){
//         super(base_id, id, changes)
//     }

//     serialize(){
//         let raw = id2byte(this.base_id) + 
//                   id2byte(this.id) + 
//                   int2byte(this._changes.length)
//         this._changes.forEach(change => {
//             raw += change.serialize()
//         })
//         return raw
//     }
    
//     get changes(): ReadonlyArray<UnitChange<any>>{
//         return this._changes
//     }

//     protected _get<T extends Field.ValueType>(field: FieldUnit<T>): T|undefined{
//         for (let i = 0; i < this._changes.length; i++){
//             if (field.id == this._changes[i].field.id){
//                 return this._changes[i].value
//             }
//         }
//     }
    
//     protected _set<T extends Field.ValueType>(field: FieldUnit<T>,
//                                               val: T){
//         let change
//         for (let i = 0; i < this._changes.length; i++){
//             if (field.id == this._changes[i].field.id){
//                 change = this._changes[i]
//                 break
//             }
//         }

//         if (change){
//             change.value = val
//         } else {
//             let change = new UnitChange<T>(field, val)
//             this._changes.push(change)
//         }
//     }
// }