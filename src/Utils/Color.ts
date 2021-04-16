export class Color {
    constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255){
        this.__r = Math.floor(r)
        this.__g = Math.floor(g)
        this.__b = Math.floor(b)
        this.__a = Math.floor(a)
    };

    copy(){
        return new Color(this.__r, this.__g, this.__b, this.__a)
    }

    compare(other: Color){
        return (this.__r == other.__r) &&
               (this.__g == other.__g) &&
               (this.__b == other.__b) &&
               (this.__a == other.__a)
    }

    // ARGB
    colorText(text: string){
        return '|c' + this.hex(this.__a)
                    + this.hex(this.__r)
                    + this.hex(this.__g)
                    + this.hex(this.__b)
                    + text + '|r'
    }

    getWcCode(){
        return BlzConvertColor(this.__a,
                               this.__r,
                               this.__g,
                               this.__b)
    }

    // RGBA
    toBinary(){
        return string.char(this.__r)
               + string.char(this.__g)
               + string.char(this.__b)
               + string.char(this.__a)
    }

    toString(){
        return 'Color(' + this.__r + ', ' +
                          this.__g + ', ' +
                          this.__b + ', ' +
                          this.__a + ')'
    }

    private hex(val: number){
        return string.format('%02X', val)
    }

    get r(){return this.__r}
    set r(r: number){this.__r = r > 255 ? 255 : r < 0 ? 0 : Math.floor(r)}

    get g(){return this.__g}
    set g(g: number){this.__g = g > 255 ? 255 : g < 0 ? 0 : Math.floor(g)}

    get b(){return this.__b}
    set b(b: number){this.__b = b > 255 ? 255 : b < 0 ? 0 : Math.floor(b)}

    get a(){return this.__a}
    set a(a: number){this.__a = a > 255 ? 255 : a < 0 ? 0 : Math.floor(a)}

    private __r: number
    private __g: number
    private __b: number
    private __a: number
}