declare class Ability{}

export abstract class Casting {
    public abstract start(abil: Ability): void;
    public abstract casting(abil: Ability): void;
    public abstract cancel(abil: Ability): void;
    public abstract interrupt(abil: Ability): void;
    public abstract dinish(abil: Ability): void;
}