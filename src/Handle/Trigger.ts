import { ActionList } from "../Utils";
import { Handle } from "./Handle";

export class hTrigger extends Handle<jtrigger> {
    constructor(){
        super(CreateTrigger())

        this.actions = new ActionList(this.toString())
        TriggerAddAction(this.handle, () => {
            this.actions.run(this)
        })
    }

    public static get(id?: jtrigger | number){
        return Handle.get(id, 'destructable') as hTrigger | undefined
    }

    destroy(){
        DestroyTrigger(this.handle)
        super.destroy()
    }

    readonly actions: ActionList<[hTrigger]>
}