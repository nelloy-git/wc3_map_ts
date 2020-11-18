--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
local fmt = string.format or error('')

--=======
-- Class
--=======

local Logger = Class.new('Logger')
---@class Logger
local public = Logger.public
---@class LoggerClass
local static = Logger.static
---@type LoggerClass
local override = Logger.override
local private = {}

--=========
-- Static
--=========

---@param show_msg boolean
---@param show_wrn boolean
---@param show_err boolean
---@param autosave boolean
---@param write_msg boolean
---@param write_wrn boolean
---@param write_err boolean
---@param compile_log_path string
---@param runtime_log_path string
---@return Logger
function static.new(show_msg, show_wrn, show_err,
                    autosave, write_msg, write_wrn, write_err,
                    compile_log_path, runtime_log_path)

    local instance = Class.allocate(Logger)
    private.newData(instance,
                    show_msg, show_wrn, show_err,
                    autosave, write_msg, write_wrn, write_err,
                    compile_log_path, runtime_log_path)

    return instance
end

--========
-- Public
--========

---@param text string
function public:msg(text)
    local priv = private.data[self]

    local log_text = fmt("[%.3f] {%s} %s", os.clock() - private.start_time, 'Msg', text)
    if priv.show_msg then
        print(log_text)
    end

    if priv.write_msg then
        table.insert(priv.full_log, log_text)
        if priv.autosave then
            self:save()
        end
    end
end

---@param text string
function public:wrn(text)
    local priv = private.data[self]

    local log_text = fmt("[%.3f] {%s} %s", os.clock() - private.start_time, 'Wrn', text)
    if priv.show_wrn then
        print(log_text)
    end

    if priv.write_wrn then
        table.insert(priv.full_log, log_text)
        if priv.autosave then
            self:save()
        end
    end
end

---@param text string
---@param level number
function public:err(text, level)
    local priv = private.data[self]

    local log_text = fmt("[%.3f] {%s} %s", os.clock() - private.start_time, 'Err', text)
    if priv.show_err then
        print(log_text)
    end

    if priv.write_err then
        table.insert(priv.full_log, log_text)
        if priv.autosave then
            self:save()
        end
    end
    error('', (level or 1) + 1)
end

function public:save()
    local priv = private.data[self]

    if not IsGame() then
        for i = priv.saved + 1, #priv.full_log do
            priv.file:write(priv.full_log[i])
        end
        priv.saved = #priv.full_log
        priv.file:flush()
    else
        PreloadGenClear()
        PreloadGenStart()

        Preload("\")\r\n\tDEL "..priv.runtime_log_path.."\r\n\t(\"")
        Preload("\")\r\n\tDEL "..private.runtime_file_name.."\r\n\t(\"")
        for i = 1, #priv.full_log do
            local bat_msg = fmt("\")\r\n\techo %s >> %s \r\n\t(\"", priv.full_log[i], priv.runtime_log_path)
            Preload(bat_msg)
        end
        Preload("\")\r\n\tstart "..priv.runtime_log_path.."\r\n\t(\"")
        PreloadGenEnd(private.runtime_file_name)

        priv.saved = #priv.full_log
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

private.start_time = os.clock()
private.runtime_file_name = 'rename_to_bat_and_run.txt'

---@param self Logger
---@param show_msg boolean
---@param show_wrn boolean
---@param show_err boolean
---@param autosave boolean
---@param write_msg boolean
---@param write_wrn boolean
---@param write_err boolean
---@param compile_log_path string
---@param runtime_log_path string
function private.newData(self,
                         show_msg, show_wrn, show_err,
                         autosave, write_msg, write_wrn, write_err,
                         compile_log_path, runtime_log_path)
    local priv = {
        show_msg = show_msg,
        show_wrn = show_wrn,
        show_err = show_err,

        autosave = autosave,
        write_msg = write_msg,
        write_wrn = write_wrn,
        write_err = write_err,

        compile_log_path = compile_log_path,
        runtime_log_path = runtime_log_path,

        full_log = {},
        saved = 0
    }

    if not IsGame() then
        priv.file = assert(io.open(compile_log_path, "w"))
    end

    private.data[self] = priv
end

return static