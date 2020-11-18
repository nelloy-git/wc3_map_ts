--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type UtilsFunctions
local Functions = require('Functions') or error('')
local isTypeErr = Functions.isTypeErr or error('')
---@type UtilsSettings
local Settings = require('Settings') or error('')
local Log = Settings.default_logger or error('')

--=======
-- Class
--=======

local Action = Class.new('Action')
---@class Action
local public = Action.public
---@class ActionClass
local static = Action.static
---@type ActionClass
local override = Action.override
local private = {}

--========
-- Static
--========

---@alias Callback fun(vararg:any[]):any

---@param callback Callback
---@param owner any
---@param child Action | nil
---@return Action
function override.new(callback, owner, child)
    isTypeErr(callback, 'function', 'callback')
    if child then isTypeErr(child, 'Action', 'child') end

    local list = private.callback2list[callback]
    if list and list[owner] then
        return list[owner]
    end

    local instance = child or Class.allocate(Action)
    private.newData(instance, callback, owner)

    return instance
end

--========
-- Public
--========

---@return any
function public:run(...)
    local callback = private.data[self].callback

    if Settings.isDebug() then
        private.pcall_level = private.pcall_level + 1

        local success, result
        if private.pcall_level == 1 then
            success, result = pcall(callback, ...)
        else
            success = true
            result = callback(...)
        end

        private.pcall_level = private.pcall_level - 1
        if success then
            return result
        else
            Log:err(result)
        end
    else
        return callback(...)
    end
end

---@return any
function public:getOwner()
    return private.data[self].owner
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.callback2list = setmetatable({}, {__mode = 'v'})
private.pcall_level = 0

---@param self Action
---@param callback Callback
---@param owner any
function private.newData(self, callback, owner)
    local priv = {
        callback = callback,
        owner = owner
    }

    private.data[self] = priv
    if not private.callback2list[callback] then
        private.callback2list[callback] = setmetatable({}, {__mode = 'v'})
    end
    local list = private.callback2list[callback]
    list[owner or ''] = self
end

return static