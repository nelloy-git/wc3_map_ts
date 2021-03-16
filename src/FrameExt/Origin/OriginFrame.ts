import { Log } from "../../Utils";
import { Frame } from "../FrameOld";

export abstract class OriginFrame extends Frame {
    protected constructor(handle: jframehandle, is_simple: boolean){
        super(handle, is_simple)
    }

    public addAction(){
        return Log.err(OriginFrame.name + 
                       ': events are not available.')
    }
    public removeAction(){
        return Log.err(OriginFrame.name + 
                       ': events are not available.')
    }
}