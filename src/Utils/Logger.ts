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

        Logger.instances_count++;

        this.show_msg = show_msg
        this.show_wrn = show_wrn
        this.show_err = show_err
        this.autosave = autosave
        this.write_msg = write_msg
        this.write_wrn = write_wrn
        this.write_err = write_err
        this.build_log_path = compile_log_path
        this.runtime_log_path = runtime_log_path

        this.build_file = IsGame() ? undefined : io.open(compile_log_path, "w") as [LuaFile]
    };

    public msg(text: string){
        if (!this.show_msg && !this.write_msg){
            return
        }

        let msg = this.format('msg', text)
        if (this.show_msg){
            print(msg)
        }
        if (this.write_msg){
            this.log.push(msg)
            if (this.autosave){
                this.save()
            }
        }
    }

    public wrn(text: string){
        if (!this.show_wrn && !this.write_wrn){
            return
        }

        let msg = this.format('Wrn', text)
        if (this.show_wrn){
            print(msg)
        }
        if (this.write_wrn){
            this.log.push(msg)
            if (this.autosave){
                this.save()
            }
        }
    }

    public err(text: string, lvl?: number | undefined): never{
        let msg = this.format('ERROR', text)
        
        if (this.show_err){
            //print(msg)
        }
        if (this.write_err){
            this.log.push(msg)
            if (this.autosave){
                this.save()
            }
        }

        error(msg, lvl)
    }

    public save(){
        if (IsGame()){
            PreloadGenClear()
            PreloadGenStart()

            let name = Logger.runtime_file_name + Logger.instances_count.toString() + '.txt'
            Preload("\")\r\n\tDEL " + this.runtime_log_path + "\r\n\t(\"")
            Preload("\")\r\n\tDEL " + name + "\r\n\t(\"")
            for (let i = 0; i < this.log.length; i++){
                let bat_msg = Logger.fmt("\")\r\n\techo %s >> %s \r\n\t(\"",
                                         this.log[i],
                                         this.runtime_log_path)
                Preload(bat_msg)
            }
            Preload("\")\r\n\tstart " + this.runtime_log_path + "\r\n\t(\"")
            PreloadGenEnd(name)
        } else {
            if (this.build_file){
                for (this.saved; this.saved < this.log.length; this.saved++) {
                    this.build_file[0].write(this.log[this.saved] + '\n');
                }
                this.build_file[0].flush()
            }
        }
    }

    private format(pref: string, text:string){
        return Logger.fmt("[%.3f] {%s} %s",
                          os.clock() - Logger.start_time,
                          pref, text)
    }

    private static instances_count = 0;
    private static fmt = string.format;
    private static start_time = os.clock();
    private static runtime_file_name = 'rename_to_bat_and_run'

    readonly show_msg:boolean;
    readonly show_wrn:boolean;
    readonly show_err:boolean;
    readonly autosave:boolean;
    readonly write_msg:boolean;
    readonly write_wrn:boolean;
    readonly write_err:boolean;
    readonly build_log_path:string;
    readonly runtime_log_path:string;

    private log: string[] = [];
    private saved: number = 0;
    private build_file: [LuaFile] | undefined;
}

export namespace Logger {
    let sep = IsGame() ? '\\' : _G.package.config.charAt(0);
    export let Default = new Logger(true, true, true,
                                    true,
                                    true, true, true,
                                    GetDst() + sep + '..' + sep + 'log.txt',
                                    'log.txt')
}