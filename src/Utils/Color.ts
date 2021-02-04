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

    public compare(other: Color){
        return (this._r == other._r) &&
               (this._g == other._g) &&
               (this._b == other._b) &&
               (this._a == other._a)
    }

    public colorText(text: string){
        return '|c' + this.hex(this._r)
                    + this.hex(this._g)
                    + this.hex(this._b)
                    + this.hex(this._a)
                    + text + '|r'
    }

    public getWcCode(){
        return BlzConvertColor(math.floor(255 * this._r),
                               math.floor(255 * this._g),
                               math.floor(255 * this._b),
                               math.floor(255 * this._a))
    }

    public toString(){
        return 'Color(' + this._r + ', ' +
                          this._g + ', ' +
                          this._b + ', ' +
                          this._a + ')'
    }

    private hex(val: number){
        return string.format('%02X', math.floor(255 * val))
    }

    public get r(){return this._r}
    public set r(r: number){this._r = r > 1 ? 1 : r < 0 ? 0 : r}

    public get g(){return this._g}
    public set g(g: number){this._g = g > 1 ? 1 : g < 0 ? 0 : g}

    public get b(){return this._b}
    public set b(b: number){this._b = b > 1 ? 1 : b < 0 ? 0 : b}

    public get a(){return this._a}
    public set a(a: number){this._a = a > 1 ? 1 : a < 0 ? 0 : a}

    private _r: number = 1;
    private _g: number = 1;
    private _b: number = 1;
    private _a: number = 1;
}