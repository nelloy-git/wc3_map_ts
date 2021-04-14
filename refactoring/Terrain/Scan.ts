// import * as Json from '../Json'

// let start = 65
// let end = 90

// function next(cur: number, next: number): [cur: number, next: number]{
//     if (cur > end){
//         cur = start
//         next++
//     }

//     return [cur, next]
// }

// export function scan(dir: string){
//     let _1 = start
//     let _2 = start
//     let _3 = start
//     let _4 = start

//     print('Scanning ' + dir)

//     let prog_next = 10
//     let list: Json.FileGame[] = []
//     while (_4 < end){
//         let name = String.fromCharCode(_1, _2, _3, _4)
//         let f = new Json.FileGame(dir + '/' + name + '.json');
//         if (typeof f.data !== 'undefined'){
//             list.push(f)
//         }

//         _1++
//         [_1, _2] = next(_1, _2);
//         [_2, _3] = next(_2, _3);
//         [_3, _4] = next(_3, _4);

//         let prog = (_4 - start) / (end - start) * 100
//         if (prog > prog_next){
//             print(string.format('%d%%', math.floor(prog)))
//             prog_next += 10
//         }
//     }

//     return list
// }