export class Color {
    constructor(color: Color);
    constructor(r: number, g: number, b: number, a: number)
    constructor(r: number | Color, g?: number, b?: number, a?: number){
        if (r instanceof Color) {
            let color = r as Color

            r = color._r
            g = color._g
            b = color._b
            a = color._a
        }

        this._r = r
        this._g = g ? g : 1
        this._b = b ? b : 1
        this._a = a ? a : 1
    };

    copy(){
        return new Color(this._r, this._g, this._b, this._a)
    }

    compare(other: Color){
        return (this._r == other._r) &&
               (this._g == other._g) &&
               (this._b == other._b) &&
               (this._a == other._a)
    }

    colorText(text: string){
        return '|c' + this.hex(this._a)
                    + this.hex(this._r)
                    + this.hex(this._g)
                    + this.hex(this._b)
                    + text + '|r'
    }

    getWcCode(){
        return BlzConvertColor(math.floor(255 * this._a),
                               math.floor(255 * this._r),
                               math.floor(255 * this._g),
                               math.floor(255 * this._b))
    }

    toString(){
        return 'Color(' + this._r + ', ' +
                          this._g + ', ' +
                          this._b + ', ' +
                          this._a + ')'
    }

    private hex(val: number){
        return string.format('%02X', math.floor(255 * val))
    }

    get r(){return this._r}
    set r(r: number){this._r = r > 1 ? 1 : r < 0 ? 0 : r}

    get g(){return this._g}
    set g(g: number){this._g = g > 1 ? 1 : g < 0 ? 0 : g}

    get b(){return this._b}
    set b(b: number){this._b = b > 1 ? 1 : b < 0 ? 0 : b}

    get a(){return this._a}
    set a(a: number){this._a = a > 1 ? 1 : a < 0 ? 0 : a}

    private _r: number = 1;
    private _g: number = 1;
    private _b: number = 1;
    private _a: number = 1;
}