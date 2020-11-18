export class Color {
    constructor(color: Color);
    constructor(r: number, g: number, b: number, a: number)
    constructor(r: number | Color, g?: number, b?: number, a?: number){
        if (r instanceof Color) {
            let color = r as Color

            r = color.r
            g = color.g
            b = color.b
            a = color.a
        }

        this.r = r
        this.g = g ? g : 1
        this.b = b ? b : 1
        this.a = a ? a : 1
    };

    public colorText(text: string){
        return '|c' + this.hex(this.r)
                    + this.hex(this.g)
                    + this.hex(this.b)
                    + this.hex(this.a) + '|r'
    }

    private hex(val: number){
        return string.format('%02X', math.floor(255 * val))
    }

    public r: number = 1;
    public g: number = 1;
    public b: number = 1;
    public a: number = 1;
}