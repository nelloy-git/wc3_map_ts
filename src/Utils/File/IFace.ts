export abstract class FileIFace<T> {
    static isExist(path: string){
        let [ok, err, code] = os.rename(path, path)
        if (!ok){
            if (code == 13){
                // Permission denied, but it exists
                return true
            }
        }
        return ok ? true : false
    }

    abstract read(path: string): void
    abstract write(path: string): void

    abstract data: T | undefined
}