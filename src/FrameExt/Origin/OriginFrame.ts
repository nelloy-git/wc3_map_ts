import { Frame } from "../Frame";

export abstract class OriginFrame extends Frame {
    protected constructor(handle: jframehandle, is_simple: boolean){
        super(handle, is_simple)
    }
}