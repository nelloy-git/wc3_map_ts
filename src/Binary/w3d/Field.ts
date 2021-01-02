import { Field, FieldBool, FieldInt, FieldReal, FieldString, FieldUnreal } from "../Field"

export interface FieldDecor<T extends Field.ValueType> extends Field<T> {}
export class FieldDecorBool extends FieldBool implements FieldDecor<boolean> {}
export class FieldDecorInt extends FieldInt implements FieldDecor<number> {}
export class FieldDecorReal extends FieldReal implements FieldDecor<number> {}
export class FieldDecorUnreal extends FieldUnreal implements FieldDecor<number> {}
export class FieldDecorString extends FieldString implements FieldDecor<string> {}

export namespace FieldDecorList {
    export let ShowInFog = new FieldDecorBool('dshf')
    export let EditorUseList = new FieldDecorBool('dusr')

    export let ColorRed = new FieldDecorInt('dvr1')
    export let ColorGreen = new FieldDecorInt('dvg1')
    export let ColorBlue = new FieldDecorInt('dvb1')
    export let Variations = new FieldDecorInt('dvar')

    export let MinScale = new FieldDecorReal('dmas')
    export let MaxScale = new FieldDecorReal('dmis')

    export let Model = new FieldDecorString('dfil')
    export let Name = new FieldDecorString('dnam')
    export let PathingTexture = new FieldDecorString('dptx')
}