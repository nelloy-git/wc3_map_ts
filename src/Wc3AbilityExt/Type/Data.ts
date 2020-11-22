declare class Ability{}

export abstract class Casting {
    public abstract get name():string
    public abstract get icon():string
    public abstract cancel(abil: Ability): void;
    public abstract interrupt(abil: Ability): void;
    public abstract dinish(abil: Ability): void;
}