export class Logger {
    constructor(show_msg: boolean,
                show_wrn: boolean,
                show_err: boolean,
                autosave: boolean,
                write_msg: boolean,
                write_wrn: boolean,
                write_err: boolean,
                compile_log_path: string,
                runtime_log_path: string){

        this.show_msg = show_msg
        this.show_wrn = show_wrn
        this.show_err = show_err
        this.autosave = autosave
        this.write_msg = write_msg
        this.write_wrn = write_wrn
        this.write_err = write_err
        this.compile_log_path = compile_log_path
        this.runtime_log_path = runtime_log_path
    }

    readonly show_msg:boolean;
    readonly show_wrn:boolean;
    readonly show_err:boolean;
    readonly autosave:boolean;
    readonly write_msg:boolean;
    readonly write_wrn:boolean;
    readonly write_err:boolean;
    readonly compile_log_path:string;
    readonly runtime_log_path:string;
}