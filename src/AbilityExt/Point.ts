import { Log } from "../Utils";

export class Point {
    constructor(str: string)
    constructor(x: number, y:number)
    constructor(x: number|string, y?: number){
        if (typeof x === 'string'){
            [this.x, this.y] = Point._parse(x)
        } else {
            this.x = x
            this.y = y ? y : 0
        }
    }

    toString(){
        return Point._l_border +
               this.x.toString() +
               Point._sep +
               this.y.toString +
               Point._r_border
    }

    x: number;
    y: number;

    private static _parse(str: string): [number, number]{
        if (str.charAt(0) != Point._l_border ||
            str.charAt(str.length - 1) != Point._r_border){

            return Log.err(Point.toString() + 
                           ': can not parse string', 3)
        }

        str = str.slice(1, str.length - 1)
        let [s_x, s_y] = str.split(Point._sep)
        let x = parseFloat(s_x)
        let y = parseFloat(s_y)

        return [x, y]
    }

    private static _l_border = '['
    private static _r_border = ']'
    private static _sep = ','
}